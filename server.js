const express = require("express");
const connectDB = require("./config/db");
const app = express();

const path = require("path");

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

// Server Static assests in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.relative(__dirname, "client", "build", "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
