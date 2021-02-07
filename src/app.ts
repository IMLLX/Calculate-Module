import express from "express";
import bodyParser from "body-parser";
import http from "http";
import createRouter from "./router/create";
import calculateRouter from "./router/calculate";
import testRouter from "./router/test";
process.env.ENV = "DEV";
process.env.PORT = "3000";

const app: express.Application = express();
const port = process.env.PORT || "9002";

app.set("port", port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/create", createRouter);
app.use("/calculate", calculateRouter);
app.use("/test", testRouter);

const server = http.createServer(app);
server.listen(port);

export default app;
