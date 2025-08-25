import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import config from "./config/index.js";
import AuthController from "./controllers/auth.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";

class App {
  constructor() {
    this.app = express();
    this.authController = AuthController;
    this.connectDB();
    this.setMiddlewares();
    this.setRoutes();
  }

  async connectDB() {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  }

  async disconnectDB() {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }

  setMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(
      cors({
        origin: "http://localhost:5173", // your frontend URL
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true, // if you need cookies/auth
      })
    );
  }

  setRoutes() {
    this.app.use("/auth", authRouter);
    this.app.use("/users", userRouter);
  }

  start() {
    this.server = this.app.listen(3000, () =>
      console.log("Server started on port 3000")
    );
  }

  async stop() {
    await mongoose.disconnect();
    this.server.close();
    console.log("Server stopped");
  }
}

export default App;
