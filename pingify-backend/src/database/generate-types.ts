import knex from "knex";
import { updateTypes } from "knex-types";
import config from "../knexfile.ts";

const db = knex(config.development);

updateTypes(db, { output: "src/database/types.ts" })
  .then(() => {
    console.log("Types generated successfully");
    return db.destroy();
  })
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });