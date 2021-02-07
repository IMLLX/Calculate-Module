import knex from "../../config/knex";
import colInit from "./colInit";

var FormulaParser = require("hot-formula-parser").Parser;
/** 列计算器
 *  根据 tablename 和 parse 计算结果
 *  需要返回结果
 */
async function columnCalculater(calc_table: string, parse: string) {
  let parser = new FormulaParser();
  try {
    let data = await knex(calc_table).select("*");
    parser = colInit(parser, data);
    return parser.parse(parse);
  } catch (error) {
    throw error;
  }
}
export default columnCalculater;
