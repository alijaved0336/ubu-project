import { DataSource, type DataSourceOptions } from 'typeorm'
require('dotenv').config({ path: '.env.staging' })

export const dataSourceOptions: DataSourceOptions = {
  host: process.env.DATABASE_DOCKER_HOST ?? process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  type: 'postgres',
  logging: true,
  entities: ['dist/infrastructure/orm/entities/*.entity.js'],
//   migrations: ['dist/infrastructure/orm/migration/migrations/*.js'],
  migrationsRun: false,
  migrationsTableName: 'custom_migration_table'
}

const datasource = new DataSource(dataSourceOptions)
export default datasource
