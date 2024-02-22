import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config({ path: `${ process.env.INIT_CWD }/.env.${process.env.NODE_ENV}`});

const config: { [key: string]: Knex.Config } = {
  dev: {
    client: process.env.DB,
    connection: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      loadExtensions: ['.ts'],
      extension: "ts",
      directory: "./migrations",
    },
  },

  prod: {
    client: process.env.DB,
    connection: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      loadExtensions: ['.ts'],
      extension: "ts",
      directory: "./migrations",
    },
    seeds: {
      loadExtensions: ['.ts'],
      extension: "ts",
      directory: "./seeds",
    }
  }
};

export default config;
