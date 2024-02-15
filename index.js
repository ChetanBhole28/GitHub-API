const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const github = require('./github');

const app = express();
app.use(bodyParser.json());


const userId = uuidv4();
app.use(bodyParser.json());
app.use(cors);

app.use((req, res, next) => {
    req.headers["request_id"] = userId;
    next();
  });

app.use("/v1/", github);

app.listen(3000, console.log("Server Started"));