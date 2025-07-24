import express from "express";
import mongoose from "mongoose";
import { activitiesRoutes } from "./routes/activitiesRoutes.js";
import { usersRoutes } from "./routes/usersRoutes.js";

import path from 'path';
import { fileURLToPath } from "url";

// Resolving dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initializing Express app
const app = express();

// Middleware to receive JSON
app.use(express.json());

// Adding the API end-points and the route handlers
app.use("/api/activities", activitiesRoutes);
app.use("/api/users", usersRoutes);

// Use the client app
app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('/file.svg', (req, res) => {
  res.sendFile(path.join(__dirname, 'file.svg'));
});

//Render client for any path
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/client/dist/index.html')))

// Connecting to MongoDB using Mongoose
mongoose
  .connect(process.env.DB_URI, { dbName: "demo_db" })
  .then(() => {
    console.log("connected to DB successfully");
    
    // Listening to requests if DB connection is successful
    app.listen(4000, () => console.log("Listening to port 4000"));
  })
  .catch((err) => console.log(err));
