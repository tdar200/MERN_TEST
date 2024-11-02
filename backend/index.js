const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3333;

const contactRoutes = require("./routes/contactRoutes");

app.use(cors());
app.options("*", cors());

app.use(express.json());

app.use("/api/contacts", contactRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
