import express from "express";
import { signin, signup, me, logout,forgotPassword, changePassword, verifyEmail } from "../controllers/auth.js";

const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.get('/me', me)
router.post('/logout', logout)
router.post('/forgot-password', forgotPassword)
router.post('/change-password', changePassword)
router.post('/verify-email', verifyEmail)

export default router