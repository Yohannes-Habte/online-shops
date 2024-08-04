import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import cookieParser from 'cookie-parser';

// Routes
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import shopRouter from './routes/shopRoutes.js';
import conversationRouter from './routes/conversationRoutes.js';
import couponRouter from './routes/couponRoutes.js';
import eventRouter from './routes/eventRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import productRouter from './routes/productRoutes.js';
import withdrawRouter from './routes/withdrawRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import rowDataRouter from './routes/commentRoutes.js';

// Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static('uploads')); // image upload using multer
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://shopping-app.onrender.com'],
    credentials: true, // to send token from the backend to the frontend
  })
);

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database successfully connected!'.blue.bold);
  } catch (error) {
    console.log(error);
  }
};

app.use(morgan('tiny'));

// End points
app.use('/api/auths', authRouter);
app.use('/api/users', userRouter);
app.use('/api/shops', shopRouter);
app.use('/api/products', productRouter);
app.use('/api/coupons', couponRouter);
app.use('/api/orders', orderRouter);
app.use('/api/wthdraws', withdrawRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/messages', messageRouter);
app.use('/api/events', eventRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/comments', commentRouter);
app.use('/api/data', rowDataRouter);

// Global error handler
app.use(globalErrorHandler);

// Server Listner
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  connectDB();
  console.log(`The server starts on ${PORT}`.yellow.bold);
});
