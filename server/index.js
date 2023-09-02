require("dotenv").config();

/* REQUIRES */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const path = require("path");
// *? const { fileURLToPath } = require("url");
const authRouter = require("./src/router/authRouter");
const apiRouter = require("./src/router/apiRouter");


/* CONFIGURATIONS */
// *? const __filename = fileURLToPath(import.meta.url);
// *? const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/media", express.static(path.join(__dirname, "media")));


/* ROUTERS */
app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/', (req, res) => {
  res.status(404).end("Not found");
});


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));