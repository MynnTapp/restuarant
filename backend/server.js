const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
