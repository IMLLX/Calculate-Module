import express from "express";
import Ajv from "ajv";
import Boom from "boom";
import selectCalculateTable from "../javascript/function/select/selectCalculateTable";
import tableHandler from "../javascript/tool/tableHandler";
var router = express.Router();

const calcTableSchema = {
  required: ["calc_table"],
};

router.get("/table", async function (req, res) {
  let ajv = new Ajv();
  let validfunc = ajv.compile(calcTableSchema);
  let valid = validfunc(req.query);
  if (valid) {
    let calc_table = req.query.calc_table;
    let basetables = await selectCalculateTable(
      { calc_table: calc_table },
      true
    );
    let calc_stack = [];
    if (basetables[0]) {
      try {
        for (let index = 0; index < basetables.length; index++) {
          const element = basetables[index];
          calc_stack.push(await tableHandler(element, true));
        }
        res.json({
          statusCode: 200,
          message: "计算完成",
          calc_stack: calc_stack,
        });
      } catch (error) {
        res.json(Boom.badRequest(error).output.payload);
      }
    } else {
      res.json({
        statusCode: 200,
        message: "没有需要进行的计算",
      });
    }
  } else {
    res.json(Boom.badRequest("请求格式错误", validfunc.errors).output.payload);
  }
});

export default router;
