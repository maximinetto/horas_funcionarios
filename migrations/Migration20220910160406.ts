import { Migration } from '@mikro-orm/migrations';

export class Migration20220910160406 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `officials` (`id` int unsigned not null auto_increment primary key, `created_at` datetime null, `updated_at` datetime null, `record_number` int not null, `first_name` varchar(255) not null, `last_name` varchar(255) not null, `position` varchar(255) not null, `contract` enum(\'PERMANENT\', \'TEMPORARY\') not null, `type` enum(\'tas\', \'teacher\') not null, `date_of_entry` date not null, `charge_number` int not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `actual_balances` (`id` varchar(36) not null, `created_at` datetime null, `updated_at` datetime null, `year` int not null, `total` numeric(10,0) not null, `official_id` int unsigned null, `type` enum(\'tas\', \'teacher\') not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `actual_balances` add index `actual_balances_official_id_index`(`official_id`);');
    this.addSql('alter table `actual_balances` add index `actual_balances_type_index`(`type`);');

    this.addSql('create table `hourly_balance_teachers` (`id` varchar(36) not null, `created_at` datetime null, `updated_at` datetime null, `year` int not null, `balance` bigint not null, `actual_balance_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `hourly_balance_teachers` add index `hourly_balance_teachers_actual_balance_id_index`(`actual_balance_id`);');

    this.addSql('create table `hourly_balances_tas` (`id` varchar(36) not null, `created_at` datetime null, `updated_at` datetime null, `year` int not null, `surplus_non_working` bigint not null, `surplus_simple` bigint not null, `surplus_business` bigint not null, `actual_balance_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `hourly_balances_tas` add index `hourly_balances_tas_actual_balance_id_index`(`actual_balance_id`);');

    this.addSql('create table `calculation_teachers` (`id` varchar(36) not null, `created_at` datetime null, `updated_at` datetime null, `year` int not null, `month` int not null, `observations` text null, `surplus` bigint not null, `discount` bigint not null, `actual_balance_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `calculation_teachers` add index `calculation_teachers_actual_balance_id_index`(`actual_balance_id`);');

    this.addSql('create table `calculation_tas` (`id` varchar(36) not null, `created_at` datetime null, `updated_at` datetime null, `year` int not null, `month` int not null, `observations` text null, `surplus_business` bigint not null, `surplus_non_working` bigint not null, `surplus_simple` bigint not null, `discount` bigint not null, `working_overtime` bigint not null, `working_night_overtime` bigint not null, `non_working_overtime` bigint not null, `non_working_night_overtime` bigint not null, `compensated_night_overtime` bigint not null, `actual_balance_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `calculation_tas` add index `calculation_tas_actual_balance_id_index`(`actual_balance_id`);');

    this.addSql('alter table `actual_balances` add constraint `actual_balances_official_id_foreign` foreign key (`official_id`) references `officials` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `hourly_balance_teachers` add constraint `hourly_balance_teachers_actual_balance_id_foreign` foreign key (`actual_balance_id`) references `actual_balances` (`id`) on update cascade;');

    this.addSql('alter table `hourly_balances_tas` add constraint `hourly_balances_tas_actual_balance_id_foreign` foreign key (`actual_balance_id`) references `actual_balances` (`id`) on update cascade;');

    this.addSql('alter table `calculation_teachers` add constraint `calculation_teachers_actual_balance_id_foreign` foreign key (`actual_balance_id`) references `actual_balances` (`id`) on update cascade;');

    this.addSql('alter table `calculation_tas` add constraint `calculation_tas_actual_balance_id_foreign` foreign key (`actual_balance_id`) references `actual_balances` (`id`) on update cascade;');
  }

}
