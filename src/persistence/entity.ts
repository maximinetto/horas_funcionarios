import NotExistsError from "@/errors/NotExistsError";
import persistence from "@/persistence/persistence.config";

export const valueExistsInPersistence = ({
  value,
  key,
  entity,
  relatedKey,
}: {
  value: unknown;
  key: string;
  entity: string;
  relatedKey?: string;
}): boolean => {
  const entityNotExists = Object.keys(persistence).find((k) => k === entity);
  if (!entityNotExists) {
    throw new NotExistsError(`${entity} does not exists`);
  }

  const keyToFind = relatedKey ?? key;

  if (!Array.isArray(value)) {
    return (
      persistence[entity].findUnique({
        where: { [keyToFind]: value },
        select: {
          [keyToFind]: true,
        },
      }) != null
    );
  }

  return persistence[entity]
    .findMany({
      where: { [keyToFind]: { in: value } },
      select: {
        [keyToFind]: true,
      },
    })
    .then((result) => {
      return result.length === value.length;
    });
};
