import knex from "../../config/knex";
import selectCalcInfo from "../select/selectCalcInfo";

function createCalculate(data: CalcInfo) {
  return new Promise((resolve, reject) => {
    knex("calculate_info")
      .insert(data)
      .then(async (insertId: Array<number>) => {
        resolve((await selectCalcInfo({ id: insertId[0] }))[0]);
      })
      .catch((reason) => {
        reject(reason);
      });
  });
}

export default createCalculate;
