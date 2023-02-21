const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const { Pool } = require("pg");

const PORT = process.env.PORT || 8060;

const pool = new Pool({
  PGHOST: process.env.PGHOST,
  PGUSER: process.env.PGUSER,
  PGDATABASE: process.env.PGDATABASE,
  PGPASSWORD: process.env.PGPASSWORD,
  PGPORT: process.env.PGPORT,
});

app.get("/", (req, res) => {
  res.send("WELCOME");
});

app.get("/api/recipes", (req, res) => {
  pool
    .query("SELECT * FROM recipes")
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

app.post("/api/recipes", (req, res) => {
  const { title, nameid, image, type, vegetarian, ingredients, instructions } =
    req.body;

  pool
    .query(
      "INSERT INTO recipes (title, nameid, image , type , vegetarian  , ingredients , instructions ) VALUES ($1, $2 , $3 , $4 , $5 , $6 , $7) RETURNING * ",
      [title, nameid, image, type, vegetarian, ingredients, instructions]
    )
    .then((data) => res.json(data.rows[0]))
    .catch((e) => res.sendStatus(500));
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
