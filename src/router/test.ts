import express from "express";
import Ajv from "ajv";
import Boom from "boom";
import knex from "../javascript/config/knex";
import columnCalculater from "../javascript/tool/calculate_module/columnCalculater";
var router = express.Router();

router.get("/data", async function (req, res) {
  // 获取表的数据
  let tablename: any = req.query.tablename;
  let result = {};
  if (tablename) {
    try {
      result = await knex(tablename).select("*");
      res.json({
        statusCode: 200,
        success: true,
        result,
      });
    } catch (error) {
      res.json(Boom.badRequest(error, error).output.payload);
    }
  } else {
    res.json(Boom.badRequest("请求格式错误").output.payload);
  }
});

router.get("/calctable", async function (req, res) {
  // 获取表已有的计算信息
  let data: any = req.query;
  console.log(data);
  
  let result = {};
  if (data) {
    try {
      result = await knex("calculate_table")
        .select("*")
        .where(data ? data : "")
        .orderBy("calc_priority", "desc");
      res.json({
        statusCode: 200,
        success: true,
        result,
      });
    } catch (error) {
      res.json(Boom.badRequest(error, error).output.payload);
    }
  } else {
    res.json(Boom.badRequest("请求格式错误").output.payload);
  }
});

router.get("/calc_info", async function (req, res) {
  // 获取表已有的计算信息
  let data: any = req.query;
  let result = {};
  if (data) {
    try {
      result = await knex("calculate_info")
        .select("*")
        .where(data ? data : "");
      res.json({
        statusCode: 200,
        success: true,
        result,
      });
    } catch (error) {
      res.json(Boom.badRequest(error, error).output.payload);
    }
  } else {
    res.json(Boom.badRequest("请求格式错误").output.payload);
  }
});

const testSchema = {
  type: "object",
  required: ["calc_table", "parse"],
};

router.post("/test_parse", async function (req, res) {
  // 测试表达式结果
  let ajv = new Ajv();
  let validfunc = ajv.compile(testSchema);
  let valid = validfunc(req.body);
  if (valid) {
    let calc_table: any = req.body.calc_table;
    let parse: any = req.body.parse;
    let result = {};
    try {
      result = await columnCalculater(calc_table, parse);
      res.json({
        statusCode: 200,
        success: true,
        result,
      });
    } catch (error) {
      res.json(Boom.badRequest(error, error).output.payload);
    }
  } else {
    res.json(Boom.badRequest("请求格式错误").output.payload);
  }
});

export default router;
