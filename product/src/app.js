import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import config from "./config.js";
import categoryRouter from "./routes/category.js";
import colorRouter from "./routes/color.js";
import productsRoutes from "./routes/product.js";
import MessageBroker from "./utils/messageBroker.js";
import { updateProductStock } from "./controllers/product.js";
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
    this.app.use(
      cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
      })
    );

    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  }

  setRoutes() {
    this.app.use("/products", productsRoutes);
    this.app.use("/colors", colorRouter);
    this.app.use("/category", categoryRouter);
    
    // Health check
    this.app.get("/health", (req, res) => {
      res.status(200).json({ 
        status: "healthy", 
        service: "product-service",
        rabbitmq: {
          connected: MessageBroker.isReady()
        },
        timestamp: new Date().toISOString()
      });
    });
  }

  setupMessageBroker() {
    MessageBroker.connect();
    
    // Set up consumer after connection
    setTimeout(() => {
      this.startInventoryConsumer();
    }, 25000);
  }

  startInventoryConsumer() {
    console.log("Starting inventory updates consumer...");
    
    if (MessageBroker.isReady()) {
      MessageBroker.consumeInventoryUpdates(async (message) => {
        try {
          console.log("Processing inventory update:", message.type, "for order:", message.orderId);
          
          switch (message.type) {
            case "REDUCE_STOCK":
              await updateProductStock(message.products);
              console.log(`Stock reduced for order ${message.orderId}`);
              break;
              
            case "RESTORE_STOCK":
              const restoreUpdates = message.products.map(p => ({
                productId: p.productId,
                quantity: -p.quantity
              }));
              await updateProductStock(restoreUpdates);
              console.log(`Stock restored for order ${message.orderId}`);
              break;
              
            default:
              console.log(`Unknown inventory update type: ${message.type}`);
          }
        } catch (error) {
          console.error("Error processing inventory update:", error);
          throw error;
        }
      });
    } else {
      console.log("RabbitMQ not ready, will retry consumer setup in 10 seconds...");
      setTimeout(() => this.startInventoryConsumer(), 10000);
    }
  }

  start() {
    this.server = this.app.listen(3001, () =>
      console.log("Product Service started on port 3001")
    );
  }

  async stop() {
    await MessageBroker.close();
    await mongoose.disconnect();
    this.server.close();
    console.log("Product Service stopped");
  }
}

export default App;