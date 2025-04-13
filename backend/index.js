import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import colors from "colors";
import cookieParser from "cookie-parser";
import connectDB from "./database/config.js";


// Routes
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import shopRouter from "./routes/shopRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";
import couponRouter from "./routes/couponRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import withdrawRouter from "./routes/withdrawRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import rowDataRouter from "./routes/commentRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import brandRouter from "./routes/brandRoutes.js";
import supplierRouter from "./routes/supplierRoutes.js";
import subcategoryRouter from "./routes/subcategoryRoutes.js";
import openaiRouter from "./routes/openaiChatRoutes.js";

// Express app

dotenv.config();

const app = express();

const corsConfig =
  process.env.NODE_ENV === "development"
    ? {
        origin: process.env.CLIENT_URL,
        credentials: true,
      }
    : {
        origin: process.env.BACKEND_URL,
        credentials: true,
      };

app.options("*", cors(corsConfig)); // Preflight requests
app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static("uploads")); // image uploads
app.use(morgan("tiny"));

// End points
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/shops", shopRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subcategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/suppliers", supplierRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/withdrawals", withdrawRouter);
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/data", rowDataRouter);
app.use("/api/v1/openai", openaiRouter);

// Global error handler
app.use(globalErrorHandler);

// Server listening
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  connectDB();
  console.log(`The server starts on ${PORT}`.yellow.bold);
});
