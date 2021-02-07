import express from "express";
import Ajv from "ajv";
import Boom from "boom";
import createCalculateSchema from "../json/createCalculate.Schema.json";
import createCalculate from "../javascript/function/create/createCalculate";
import createCalcTable from "../json/createCalcTable.Schema.json";
import createCalculateTable from "../javascript/function/create/createCalculateTable";
import tableHandler from "../javascript/tool/tableHandler";
import selectCalcInfo from "../javascript/function/select/selectCalcInfo";

var router = express.Router();
router.post("/table", function (req, res) {});
router.post("/calctable", async function (req, res) {
  // 新建计算表
  let ajv = new Ajv();
  let validfunc = ajv.compile(createCalcTable);
  let valid = validfunc(req.body);
  if (valid) {
    let data = <BaseTable>req.body;
    let calcinfo = (await selectCalcInfo({ id: data.calc_id }))[0];
    if (calcinfo) {
      // 判断计算信息是否存在
      createCalculateTable(data)
        .then(async (table: any) => {
          try {
            if (table) {
              let calc_stack = await tableHandler(table);
              res.json({
                message: "创建计算表成功",
                statusCode: 200,
                calc_stack: calc_stack,
              });
            }
          } catch (error) {
            res.json(Boom.badRequest(error).output.payload);
          }
        })
        .catch((reason) => {
          res.json(Boom.badRequest(reason, reason).output.payload);
        });
    } else {
      res.json(Boom.badRequest("计算信息不存在,创建计算表失败").output.payload);
    }
  } else {
    res.json(Boom.badRequest("请求格式错误", validfunc.errors).output.payload);
  }
});
router.post("/calculate", function (req, res) {
  // 新建计算信息
  let ajv = new Ajv();
  let validfunc = ajv.compile(createCalculateSchema);
  let valid = validfunc(req.body);
  if (valid) {
    let CalcInfo: CalcInfo = req.body;
    createCalculate(CalcInfo)
      .then(async (result: any) => {
        if (result) {
          res.json({
            message: "创建计算信息成功",
            statusCode: 200,
            success: true,
            data: result,
          });
        }
      })
      .catch((reason) => {
        res.json(Boom.badRequest(reason, reason).output.payload);
      });
  } else {
    res.json(Boom.badRequest("请求格式错误", validfunc.errors).output.payload);
  }
});

export default router;
