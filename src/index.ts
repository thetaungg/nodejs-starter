const express = require("express");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  const text = "hello";
  res.status(200).send(text);
});

app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});
