var FormulaParser = require("hot-formula-parser").Parser;
import knex from "../../config/knex";
import colInit from "./colInit";

/** 执行计算信息
 *  更新计算后的表但
 *  不返回结果 只返回结果字符串
 */
async function calcHandler(calcinfo: CalcInfo, basetable: BaseTable) {
  let data: Array<any> = await knex(basetable.calc_table).select("*");
  let parser = new FormulaParser();
  let error_count = 0;
  parser = colInit(parser, data); // 列初始
  for (let index = 0; index < data.length; index++) {
    let element = data[index];
    parser = parserInit(parser, element); // 行初始
    if (validParser(basetable.calc_flag, parser).result) {
      let result = inlineCalculater(parser, calcinfo.calcParser);
      if (result.error) {
        element[basetable.save_field] = `ERROR ${result.error}`;
        error_count++;
      } else {
        element[basetable.save_field] = result.result;
        if (basetable.valid_flag) {
          // 若需要判断合理性
          parser.setVariable(basetable.save_field, result.result);
          // 判断结果合理性时要在parser中更新result
          element[basetable.valid_field] = validParser(
            basetable.valid_flag,
            parser
          ).result;
        }
      }
    } else {
      continue;
    }
    try {
      knex(basetable.calc_table)
        .update(element)
        .where({ id: element.id })
        .then(() => {});
    } catch (error) {
      if (error.sqlMessage) {
        throw error.sqlMessage;
      } else {
        throw error;
      }
    }
  }
  return `计算完成 共 ${error_count} 个错误`;
}

/** 行内计算
 *  用于新建计算时对整个数据表进行计算
 */
function inlineCalculater(parser: any, parse: string) {
  return parser.parse(parse);
}
/** 结果合理性判断
 *  返回 true 或者 false
 */
function validParser(validParse: string, parser: any) {
  return parser.parse(validParse);
}

/** 对行初始化 parser
 */
function parserInit(parser: any, data: any) {
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const element = data[key];
      parser.setVariable(key, element);
    }
  }

  return parser;
}

// /** 列初始化
//  *  average(column('test_field_1','test_field_1 > 100')) + test_field_2 + sum(column('test_field_3', 'test_field_3 > 20'))
//  */
// function colInit(parser: any, data: any) {
//   parser.setFunction("column", function (cname: Array<string>) {
//     let r: any = [];
//     if (cname[1]) {
//       if (parser.parse(cname[1]).result) {
//         data.forEach((element: any) => {
//           r.push(element[cname[0]]);
//         });
//       } else {
//         return 0;
//       }
//     } else {
//       data.forEach((element: any) => {
//         r.push(element[cname[0]]);
//       });
//     }
//     return r.toString();
//   });
//   return parser;
// }
export default calcHandler;
