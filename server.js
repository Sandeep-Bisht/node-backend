const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());

// Connect DB
connectDB();

// Routes
const userRoutes = require("./routes/userRoute");
app.use("/api/users", userRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
