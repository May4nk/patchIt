import knex from "knex";
import dotenv from "dotenv";
import config from "./knexfile.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV}`});

const env: string = process.env.NODE_ENV!;
const db = knex(config[env!]);

export default db;
