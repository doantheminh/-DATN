import express from 'express';
import { getTopSellingProducts, getTopSellingProductsMonth, getTopSellingProductsWeek } from '../statistics/statisticsTop10sanpham.js';
const router = express.Router();
router.get('/top-selling-products', getTopSellingProducts);
router.get('/startOfWeek', getTopSellingProductsWeek);
router.get('/startOfMonth', getTopSellingProductsMonth);
export default router;