import express from "express";
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer();
const app = express();

// Route requests to the auth service
app.use("/auth", (req, res) => {
  proxy.web(req, res, { target: "http://auth:3000" });
});

// Route requests to the product service
app.use("/products", (req, res) => {
  proxy.web(req, res, { target: "http://product:3001" });
});

// Route requests to colors (through product service)
app.use("/colors", (req, res) => {
  proxy.web(req, res, { target: "http://product:3001" });
});

// Route requests to categories (through product service)
app.use("/category", (req, res) => {
  proxy.web(req, res, { target: "http://product:3001" });
});

// Route cart requests to order service
app.use("/cart", (req, res) => {
  proxy.web(req, res, { target: "http://order:3002" });
});

// Route order requests to order service
app.use("/orders", (req, res) => {
  proxy.web(req, res, { target: "http://order:3002" });
});

// Start the server
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});