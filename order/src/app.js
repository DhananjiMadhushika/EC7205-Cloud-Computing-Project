import express from "express";
import mongoose from "mongoose";
import config from "./config.js";
import cors from "cors";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import MessageBroker from "./utils/messageBroker.js";

class App {
  constructor() {
    this.app = express();
    this.connectDB();
    this.setMiddlewares();
    this.setRoutes();
    this.setupMessageBroker();
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
    
    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.status(200).json({ 
        status: "healthy", 
        service: "order-service",
        rabbitmq: {
          connected: MessageBroker.isReady()
        },
        timestamp: new Date().toISOString()
      });
    });
  }

  setupMessageBroker() {
    MessageBroker.connect();
  }

  start() {
    this.server = this.app.listen(config.port, () =>
      console.log(`Order Service started on port ${config.port}`)
    );
  }

  async stop() {
    await MessageBroker.close();
    await mongoose.disconnect();
    this.server.close();
    console.log("Order Service stopped");
  }
}

export default App;