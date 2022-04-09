import _groupBy from "lodash/groupBy";
import { operations as balanceRepository } from "persistence/actualBalance";
import { operations as calculationRepository } from "persistence/calculations";
import CalculateForTas from "services/calculations/classes/CalculateForTAS";

/*
    - Consultar la tabla de empleados y obtener el tipo de empleado de cada id
    - Si el empleado es de tipo TAS y me pasan un registro de horas de tipo Docencia, entonces debo lanzar una excepción que diga que no es posible insertar un registro de horas diferente el tipo de empleado.
   */
/* Debo traer los datos de la tabla saldos y horarios
       Para ello debo buscar desde el primer id del empleado y el año
       en el cual aún le quedan horas sin que lleguen a cero todas las columnas (suma horas es mayor a cero) hasta la fecha actual
       Si no encuentro nada, entonces debo partir de la fecha actual con el saldo inicial igual a cero
       Si encuentro algo, entonces debo partir la suma desde el primer año en el que aún le quedan horas 
       hasta llegar a la fecha actual (puedo pasarle una fecha final que sea diferente a la actual)) 
  */
/*
    - Obtener el año y mes actual (o la fecha por parámetro)
    - Buscar en la tabla calculos el primer registro que tenga el empleado desde el mes de enero del año del punto de arriba
    hasta mes actual de dicho año
    - Si no encuentro nada, entonces debo insertar un/os registro/s partiendo del mes que no tiene registro asociado al empleado 
      y debo ponerle el saldo inicial igual a cero a todos las columnas
    - Si el/los meses que pasan ya existen en el sistema entonces debo actualizar el/los registro/s con los nuevos valores (saldos y horas)
    */
/*
    Calcular el saldo total es la suma de las horas hábiles multiplicado por 1.5 más las horas no hábiles multiplicado por 2 más 
    las horas simples menos las horas de descuento de cada mes adicionando las horas de los años anteriores
  */
/*
    Para restar las horas que van quedando en cada mes debo restar las horas de los años anteriores de la siguiente manera:
      - Debo tener en un array las horas de descuento y sumarlas.
      - Luego de traer los saldos de horas anteriores debo recorrerlos empezando por el año menor hasta el año actual 
      (o la fecha pasada por parámetro) y siguiendo el orden de simples, hábiles y inhábiles de cada año.
      Si el saldo de horas de descuento es mayor a cero entonces debo restarle las horas de descuento al saldo de horas del año 
      que estoy recorriendo. Si la resta es mayor o igual a cero entonces ya puedo tener el saldo final de ese año e ingresarlo a BBDD.
      Si la resta es menor a cero entonces debo ir a restar a la columna que sigue (si ya no quedan horas simples entonces siguen 
        las horas hábiles y si fueran hábiles siguen las horas inhábiles y sino sigo con las horas simples del año siguiente y 
        así sucesivamente). Siguiendo el paso anterior, si el saldo es menor a cero entonces debo sumar el cálculo anterior y con el saldo
        que corresponde al año que recorro (simples, hábiles e inhábiles, en ese orden) sino no lo es debo manterlo igual.
      Por último si el último saldo del año anterior al año actual es menor a cero entonces debo sumar el saldo del año anterior 
      al año actual (que es la suma de las horas simples por un lado, luego la suma de las horas hábiles y luego las inhábiles)
      sino no lo es debo manterlo igual.
      - Vuelvo a recorrer el array de horas calculado del paso anterior y si hay algún saldo menor a cero entonces en un nuevo
      array debo dejar ese saldo igual a cero y si no lo es debo dejarlo igual.
        Por último el saldo de horarios finales queda con el cálculo anterior. Si algún año queda con saldo cero entonces debo
        para el siguiente año debo descriminarlo de los años anteriores.
        Si llegara a haber un total de horas negativo ( que sale de la suma del array que puede tener valores negativos) entonces
        debería dejar un mensaje al usuario que el funcionario debe horas.
      - Luego de todos los cálculos debo dejar el saldo de horarios finales en la tabla de saldos con la referencia del año actual
        para el nuevo cálculo del año siguiente. 
        Si deseara recalcularlo (puede ser incluso reemplazando algún mes) entonces debo borrar el registro de saldos del año actual
        y volver a insertarlo con el nuevo saldo. 
  */
export default async function calculateForTAS({
  year,
  official,
  calculations,
  actualDate,
}) {
  const hourlyBalances = await balances({ year, officialId: official.id });
  const calculateService = new CalculateForTas(calculationRepository);
  calculate(
    { year, official, calculations, actualDate, hourlyBalances },
    calculateService
  );
  tryToRecalculateLaterHours({ official, year }, calculateService);
  save();
}

async function tryToRecalculateLaterHours(
  { official, year },
  calculateService
) {
  const calculations = await calculationRepository.get({
    year: {
      gt: year,
    },
    actualBalance: {
      officialId: official.id,
    },
  });

  if (!hasMoreLaterHours(calculations)) return;

  const hourlyBalances = await balanceRepository.getTAS({
    where: {
      year: {
        gt: year,
        officialId: official.id,
      },
    },
    include: {
      hourlyBalances: {
        include: {
          hourlyBalanceTAS: true,
        },
      },
    },
  });

  const currentCalculations = _groupBy(calculations, "year");

  Object.entries(currentCalculations).forEach(([year, calculations]) => {
    calculate(
      { calculations, official, hourlyBalances, year },
      calculateService
    );
  });
}

function hasMoreLaterHours(calculations) {
  return calculations.length > 0;
}

async function calculate(
  { year, official, calculations, actualDate, hourlyBalances },
  calculateService
) {
  return calculateService.calculate({
    year,
    official,
    calculations,
    actualDate,
    hourlyBalances,
  });
}

async function balances({ year, officialId }) {
  const lastActualBalances =
    await balanceRepository.getBalanceTASBYOfficialIdAndYear({
      officialId: officialId,
      year,
    });

  return lastActualBalances.length === 0
    ? { hourlyBalanceTAS: [] }
    : lastActualBalances[0];
}

function save() {}
