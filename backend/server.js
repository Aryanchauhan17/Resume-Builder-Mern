const express = require("express");
const mongoose  = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");



dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
const PORT = process.env.PORT || 5000;

//TEST ROUTE
app.get("/", (req,res) => {
    res.send("Backend is running!");
});

const resumeRoutes = require("./routes/resumeRoutes");
app.use("/api/resumes", resumeRoutes);
app.use("/api/users", userRoutes);

//connect to mongodb using mongoose
mongoose
  .connect(
    process.env.MONGO_URI, // MongoDB connection string from .env
    { useNewUrlParser: true, useUnifiedTopology: true } // options to avoid warnings
  )
  .then(() => {
    console.log("MongoDB connected"); 
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
  

    
