import express from "express";
import mongoose from "mongoose";
import config from "./config.js";
import cors from "cors";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";

class App {
  constructor() {
    this.app = express();
    this.connectDB();
    this.setMiddlewares();
    this.setRoutes();
  }

  setMiddlewares() {
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    
    this.app.use(cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    }));
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

  setRoutes() {
    this.app.use("/cart", cartRoutes);
    this.app.use("/orders", orderRoutes);
  }

  start() {
    this.server = this.app.listen(config.port, () =>
      console.log(`Order Service started on port ${config.port}`)
    );
  }

  async stop() {
    await mongoose.disconnect();
    this.server.close();
    console.log("Server stopped");
  }
}

export default App;