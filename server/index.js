const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserRoutes = require("./Routes/UserRoutes.js");
const ImageRoutes = require("./Routes/ImageRoutes.js");
const ResRoutes = require("./Routes/ResRoutes.js");
const AdminRoutes = require("./Routes/AdminRoutes.js");

dotenv.config();
mongoose
  .connect(process.env.DBURI)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", UserRoutes);
app.use("/api/image", ImageRoutes);
app.use("/api/restaurant", ResRoutes);
app.use("/api/admin", AdminRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
