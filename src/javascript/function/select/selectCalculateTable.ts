import knex from "../../config/knex";

async function selectCalculateTable(data: any, order?: boolean) {
  let result: Array<BaseTable> = [];
  if (order) {
    result = await knex("calculate_table")
      .select("*")
      .where(data)
      .orderBy("calc_priority", "desc");
  } else {
    result = await knex("calculate_table").select("*").where(data);
  }
  return result;
}
export default selectCalculateTable;
