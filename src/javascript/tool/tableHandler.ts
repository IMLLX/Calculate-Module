import selectCalcInfo from "../function/select/selectCalcInfo";
import calcHandler from "./calculate_module/calcHandler";

/** 对计算表进行处理
 *  包含如下操作:
 *  1 判断 calc_id 是否存在
 *  2 判断 calcType 是否需要立即进行计算
 *  3 对该 calcinfo 进行计算
 *
 */
async function tableHandler(calctable: BaseTable, calc_now?: boolean) {
  let calcinfo = (await selectCalcInfo({ id: calctable.calc_id }))[0];
  if (calcinfo) {
    if (calcinfo.calcType || calc_now) {
      // 若需要立即计算
      return {
        calc_msg: await calcHandler(calcinfo, calctable),
        calc_info: calcinfo,
      };
    } else {
      return { calc_msg: "不需要执行计算", calc_info: calcinfo };
    }
  } else {
    return { calc_msg: "计算信息不存在", calc_info: undefined };
  }
}

// selectCalcInfo({ id: 52 }).then((res) => {
//   console.log(res);
//   if (res[0]) {
//     console.log(1);
//   }
// });

export default tableHandler;
