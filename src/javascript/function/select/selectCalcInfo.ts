import knex from "../../config/knex";

async function selectCalcInfo(data: any) {
  const result: Array<CalcInfo> = await knex("calculate_info")
    .select("*")
    .where(data);
  return result;
}

export default selectCalcInfo;
