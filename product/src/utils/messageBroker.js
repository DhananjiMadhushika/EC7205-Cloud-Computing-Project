import amqp from "amqplib";

class MessageBroker {
  constructor() {
    this.channel = null;
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    console.log("Connecting to RabbitMQ for inventory updates...");

    setTimeout(async () => {
      try {
        this.connection = await amqp.connect("amqp://rabbitmq:5672");
        this.channel = await this.connection.createChannel();
        
        // Set up connection event handlers
        this.connection.on('error', (err) => {
          console.error("RabbitMQ connection error:", err.message);
          this.isConnected = false;
        });

        this.connection.on('close', () => {
          console.log("RabbitMQ connection closed");
          this.isConnected = false;
          setTimeout(() => this.connect(), 5000);
        });
        
        // Create queue with simple configuration
        await this.channel.assertQueue("inventory_updates", { 
          durable: true
        });
        
        this.isConnected = true;
        console.log("RabbitMQ connected for inventory management");
        console.log("Queue 'inventory_updates' is ready");
        
      } catch (err) {
        console.error("Failed to connect to RabbitMQ:", err.message);
        setTimeout(() => this.connect(), 10000);
      }
    }, 20000);
  }

  async publishMessage(queue, message) {
    console.log(`Publishing message to ${queue}:`, message.type);

    if (!this.isConnected || !this.channel) {
      console.error("No RabbitMQ channel available. Message not sent");
      return false;
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      await this.channel.sendToQueue(queue, messageBuffer, { persistent: true });
      console.log(`Message published successfully:`, message.type);
      return true;
    } catch (err) {
      console.error("Error publishing message:", err);
      return false;
    }
  }

  async consumeInventoryUpdates(callback) {
    if (!this.isConnected || !this.channel) {
      console.error("No RabbitMQ channel available for consuming");
      return;
    }

    try {
      console.log("Setting up inventory updates consumer...");
      
      await this.channel.consume("inventory_updates", async (message) => {
        if (message) {
          try {
            const content = message.content.toString();
            const parsedContent = JSON.parse(content);
            
            console.log("Received inventory update:", parsedContent.type);
            
            await callback(parsedContent);
            this.channel.ack(message);
            console.log("Inventory update processed successfully");
            
          } catch (error) {
            console.error("Error processing inventory update:", error);
            this.channel.reject(message, false);
          }
        }
      });
      
      console.log("Started consuming inventory updates");
    } catch (err) {
      console.error("Error setting up inventory updates consumer:", err);
    }
  }

  // Simple status check
  isReady() {
    return this.isConnected && this.channel;
  }

  async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log("RabbitMQ connection closed");
      this.isConnected = false;
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
    }
  }
}

export default new MessageBroker();