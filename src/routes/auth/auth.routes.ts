import express from "express";
import passport from "passport";
import { login, signup } from "../../controllers/auth.controller";



const router = express.Router();

// define routes
router.post('/signup', signup)

router.post('/login', login)

router.get('/protected-route', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log("Protected Route")
    res.json({ message: 'This is a protected route' });
});

export default router;