import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import config from "./config.js";
import categoryRouter from "./routes/category.js";
import colorRouter from "./routes/color.js";
import productsRoutes from "./routes/product.js";
import MessageBroker from "./utils/messageBroker.js";
import cors from "cors";


dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.connectDB();
    this.setMiddlewares();
    this.setRoutes();
    this.setupMessageBroker();
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
        credentials: true, // if you need cookies or auth headers
      })
    );
  }

  setRoutes() {
    this.app.use("/products", productsRoutes);
    this.app.use("/colors", colorRouter);
    this.app.use("/category", categoryRouter);
  }

  setupMessageBroker() {
    MessageBroker.connect();
  }

  start() {
    this.server = this.app.listen(3001, () =>
      console.log("Server started on port 3001")
    );
  }

  async stop() {
    await mongoose.disconnect();
    this.server.close();
    console.log("Server stopped");
  }
}

export default App;
