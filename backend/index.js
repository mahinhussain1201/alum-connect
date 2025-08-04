const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const authRoutes = require("./routes/authRoutes");
const userRoutes= require("./routes/userRoutes");
const alumniRoutes= require("./routes/alumniRoutes");
const studentRoutes=require("./routes/studentRoutes");
const internshipRoutes=require("./routes/internshipRoutes");
const eventRoutes=require("./routes/eventRoutes")

const app = express();
const PORT = 8000;

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(cors())

console.log("inside index.js")

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes)
app.use("/api/alumni",alumniRoutes)
app.use("/api/student",studentRoutes)
app.use("/api/internship",internshipRoutes)
app.use("/api/events",eventRoutes);



app.listen(PORT, () => console.log(`Server listening on port:${PORT}`));