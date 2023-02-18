const express = require("express");
const app = express();
const port = 3002;

const cors = require("cors");
const validator = require("./validator");
const { validationResult } = require("express-validator");
const shortid = require("shortid");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sample",
  port: 3306,
  connectionLimit: 5,
});

const db = Object.freeze({
  pool: pool,
});

app.get("/customers", async (req, res) => {
  const result = await db.pool.query("SELECT * FROM customer");
  let requestID = req.headers["request-id"];
  res.setHeader("request-id", requestID);
  res.status(200).json(result);
});

app.get("/agents", async (req, res) => {
  const result = await db.pool.query("SELECT * FROM agents");
  let requestID = req.headers["request-id"];
  res.setHeader("request-id", requestID);
  res.status(200).json(result);
});

app.get("/agents/:id", async (req, res) => {
  let request_id = req.headers["request-id"];
  res.setHeader("request-id", request_id);
  let agentCode = req.params.id;
  let queryCheck = `SELECT * from agents where AGENT_CODE='${agentCode}'`;
  const rowsCheck = await db.pool.query(queryCheck);
  if (rowsCheck.length == 0) {
    res.status(404).send({ message: "Agent Id not found" });
  }
  try {
    let select_query = `SELECT * from agents where AGENT_CODE='${agentCode}'`;
    const result = await db.pool.query(select_query);
    res.status(200).json(result);
  } catch (err) {
    throw err;
  }
});
app.post("/agents", validator.validateAgent, async (req, res) => {
  const errors = validationResult(req);
  let request_id = req.headers["request-id"];
  res.setHeader("request-id", request_id);
  if (!errors.isEmpty()) {
    return res.status(422).json({ Errors: errors.array() });
  }
  try {
    const agentCode = shortid.generate().slice(-6);
    let insert_query = `INSERT INTO agents VALUES('${agentCode}','${req.body.agentName}',
                        '${req.body.workingArea}','${req.body.commission}','${req.body.phoneNo}',
                        '${req.body.country}')`;
    await db.pool.query(insert_query);
    res.statusCode = 201;
    return res.json({
      message: "Agent is created with id: " + agentCode,
    });
  } catch (err) {
    throw err;
  }
});
app.put("/agents/:id", validator.validateAgent, async (req, res) => {
  const errors = validationResult(req);
  let request_id = req.headers["request-id"];
  res.setHeader("request-id", request_id);
  if (!errors.isEmpty()) {
    return res.status(422).json({ Errors: errors.array() });
  }
  try {
    let agentCode = req.params.id;
    let queryCheck = `SELECT * from agents where AGENT_CODE='${agentCode}'`;
    const rowsCheck = await db.pool.query(queryCheck);
    if (rowsCheck.length == 0) {
      res.status(404).send({ message: "Agent Id not found" });
    }
    let update_query = `Update agents set 
            AGENT_NAME='${req.body.agentName}',
            WORKING_AREA='${req.body.workingArea}',
            COMMISSION='${req.body.commission}',
            PHONE_NO='${req.body.phoneNo}',
            COUNTRY='${req.body.country}' 
            where AGENT_CODE='${agentCode}'`;
     await db.pool.query(update_query);
    res.statusCode = 200;
    return res.json({
      message: "Agent with id: " + agentCode + " is updated.",
    });
  } catch (err) {
    throw err;
  }
});
app.patch("/agents/:id", validator.validateAgent, async (req, res) => {
  const errors = validationResult(req);
  let request_id = req.headers["request-id"];
  res.setHeader("request-id", request_id);
  if (!errors.isEmpty()) {
    return res.status(422).json({ Errors: errors.array() });
  }
  try {
    let agentCode = req.params.id;
    let queryCheck = `SELECT * from agents where AGENT_CODE='${agentCode}'`;
    const rowsCheck = await db.pool.query(queryCheck);
    if (rowsCheck.length == 0) {
      res.status(400).send({ message: "Agent Id not found" });
    }
    let update_query = `Update agents set 
            AGENT_NAME='${req.body.agentName}',
            WORKING_AREA='${req.body.workingArea}',
            COMMISSION='${req.body.commission}',
            PHONE_NO='${req.body.phoneNo}',
            COUNTRY='${req.body.country}' 
            where AGENT_CODE='${agentCode}'`;
    const result = await db.pool.query(update_query);
    res.statusCode = 200;
    return res.json({
      message: "Agent with id: " + agentCode + " is updated.",
    });
  } catch (err) {
    throw err;
  }
});
app.delete("/agents/:id", async (req, res) => {
  const errors = validationResult(req);
  let request_id = req.headers["request-id"];
  res.setHeader("request-id", request_id);
  if (!errors.isEmpty()) {
    return res.status(422).json({ Errors: errors.array() });
  }
  try {
    let agentCode = req.params.id;
    let queryCheck = `SELECT * from agents where AGENT_CODE='${agentCode}'`;
    const rowsCheck = await db.pool.query(queryCheck);
    if (rowsCheck.length == 0) {
      res.status(404).send({ message: "Agent Id not found" });
    }
    let delete_query = `Delete from agents where AGENT_CODE='${agentCode}'`;
    const result = await db.pool.query(delete_query);
    res.statusCode = 200;
    return res.json({
      message: "Deleted Agent with id: " + agentCode,
    });
  } catch (err) {
    throw err;
  }
});
app.get("/companies", async (req, res) => {
  const result = await db.pool.query("SELECT * FROM company");
  let requestID = req.headers["request-id"];
  res.setHeader("request-id", requestID);
  res.status(200).json(result);
});

app.get("/orders", async (req, res) => {
  const result = await db.pool.query("SELECT * FROM orders");
  let requestID = req.headers["request-id"];
  res.setHeader("request-id", requestID);
  res.status(200).json(result);
});

app.get("*", async (req, res) => {
  res.status(404).json({
    message: "Resource id not found, please use other available resources!!!",
  });
});

app.listen(port, () => {
  console.log(`Application is listening at  http://localhost:${port}`);
});
