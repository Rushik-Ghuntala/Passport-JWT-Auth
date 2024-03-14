import express from "express";
import auth from './auth/auth.routes'

const router = express.Router();

// define routes
router.use('/auth', auth)


export default router;