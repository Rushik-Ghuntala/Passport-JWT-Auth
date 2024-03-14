import { Request, Response } from "express";
import { User } from "../entities/user.entities";
import { AppDataSource } from "../config/database";
import { Error, Success } from "../utils/response";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
require('dotenv').config();


export const signup = async(req: Request, res: Response) => {
    try{

        const {name, email, password} = req.body;

        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOne({ where: { email: email }})

        if(existingUser){
            return Error("User is Already Registered...",400);
        }

        // secure password
        let hashedPassword;

        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } 
        catch (err) {
            return Error('Error in Hashing Password...', 500)
        }

        // create the user
        const user = userRepository.create({
            name,
            email,
            password: hashedPassword,
        })

        const newUser = await userRepository.save(user);
        
        return Success("User Registered Seccessfully...", newUser);
    }
    catch(err){
        console.error(err)

        return Error("Something went wrong in Signin User")
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const userRepository = AppDataSource.getRepository(User);

        // Check for registered user
        const user = await userRepository.findOne({ where: { email: email } });

        // If user is not registered
        if (!user) {
            return res.status(401).json({ error: "User is not Registered..." });
        }

        const payload = {
            email: user.email,
            id: user.id,
        };

        // Verify password and generate JWT Token
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // If password is incorrect
            return res.status(403).json({ error: "Password Incorrect..." });
        }

        // Create JWT Token
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: "2h"
        });

        user.token = token;

        user.password = ""; 

        // Set cookie with JWT token
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        res.cookie("token", token, options);

        // Send success response
        return Success("User Logged in Successfully...", token)

    } catch (err) {
        console.error(err);
        // Send error response
        return res.status(500).json({ error: "Login Failed..." });
    }
}
