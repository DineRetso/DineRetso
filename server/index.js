const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const UserRoutes = require("./Routes/UserRoutes.js");
const ImageRoutes = require("./Routes/ImageRoutes.js");
const ResRoutes = require("./Routes/ResRoutes.js");
const AdminRoutes = require("./Routes/AdminRoutes.js");
const OwnerRoutes = require("./Routes/OwnerRoutes.js");
const Dine = require("./Models/AdminModel.js");
const PaymentRoutes = require("./Routes/PaymentRoutes.js");
const path = require("path");

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
app.use(helmet());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


app.use("/api/users", UserRoutes);
app.use("/api/image", ImageRoutes);
app.use("/api/restaurant", ResRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/owner", OwnerRoutes);
app.use("/api/payment", PaymentRoutes);

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/client/build", "index.html"))
);

app.use((err, req, res, next) => {
  res.status(500).send({message: err.message});
})

const port = process.env.PORT;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
