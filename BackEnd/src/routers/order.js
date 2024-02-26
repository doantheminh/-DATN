import express from 'express'
import { checkPermission } from "../middlewares/checkPermission.js";
import { createOrder, getOrders, cancelOrder, getOrderById, returnOrder, applyDiscountCodeOrder, timeLineOrder, orderConfirmed } from '../controllers/order.js';
import { calculateRevenueByMonth, calculateRevenueByYear, getOrderStatistics, getRevenue, getRevenueByDay, } from '../statistics/statisticsOrder.js';
import { stripePay } from '../controllers/pay.js';
const orderroute = express.Router();
orderroute.post('/order', createOrder)
orderroute.get('/order', getOrders)
orderroute.put('/order/:orderId/status', cancelOrder)
orderroute.get('/orders', getRevenue)
orderroute.get('/order/statistics', getOrderStatistics)
orderroute.get('/revenue-by-day', getRevenueByDay);
orderroute.get("/order/:orderId", getOrderById);
orderroute.post('/create-checkout-session', stripePay)
orderroute.get('/revenue-by-year', calculateRevenueByYear);
orderroute.get("/revenue-by-month", calculateRevenueByMonth);
orderroute.post('/order/:orderId/return', returnOrder);
orderroute.post('/order/:orderId/:discountCode', applyDiscountCodeOrder);
orderroute.get('/timeline', timeLineOrder)
orderroute.patch('/order/confirm/:id', orderConfirmed)
export default orderroute