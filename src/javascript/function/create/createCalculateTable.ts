import knex from "../../config/knex";
import selectCalculateTable from "../select/selectCalculateTable";

function createCalculateTable(data: BaseTable) {
  return new Promise((resolve, reject) => {
    knex("calculate_table")
      .insert(data)
      .then(async (insertId: Array<number>) => {
        resolve((await selectCalculateTable({ id: insertId[0] }))[0]);
      })
      .catch((reason) => {
        reject(reason);
      });
  });
}

export default createCalculateTable;
