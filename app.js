const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { MongoClient, ServerApiVersion } = require("mongodb");

const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

require('dotenv').config();

app.use("/", indexRouter);

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  console.log('MongoDB database connection established successfully');
  client.close();
});

const port = process.env.PORT || 3100;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
