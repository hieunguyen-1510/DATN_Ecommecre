import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import connectCloudinary from './src/config/cloudinary.js';
import userRouter from './src/routes/authRoutes.js';
import productRouter from './src/routes/productRoutes.js';
import contactRouter from './src/routes/contactRoutes.js';
import cartRouter from './src/routes/cartRoutes.js';
import passwordRouter from './src/routes/passwordRoutes.js';
import paymentRouter from './src/routes/paymentRoutes.js';
import userListRouter from './src/routes/userRoutes.js';
import reviewsRouter from './src/routes/reviewsRoutes.js';
import orderRouter from './src/routes/orderRoutes.js';
import roleRouter from './src/routes/roleRoutes.js';
import inventoryRouter from './src/routes/inventoryRoutes.js';
import discountRouter from './src/routes/discountRoutes.js';
import reportRouter from './src/routes/reportRoutes.js';
import bannerRouter from './src/routes/bannerRoutes.js';
import chatbotRouter from './src/routes/chatbotRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
connectDB();
connectCloudinary();

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/user',passwordRouter);
app.use('/api/product', productRouter);
app.use('/api/cart',cartRouter);
app.use('/api',contactRouter);
app.use('/api/reviews',reviewsRouter);
app.use('/api/payment',paymentRouter);
app.use('/api/users',userListRouter);
app.use('/api/roles',roleRouter);
app.use('/api/orders',orderRouter);
app.use('/api/inventory',inventoryRouter);
app.use('/api/discounts',discountRouter);
app.use('/api/banners',bannerRouter);
app.use('/api/reports',reportRouter);
app.use('/api/chatbot', chatbotRouter);
app.get('/', (req, res) => {
    res.send('API Server working...');
});

// Listen server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});