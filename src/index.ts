import express, { Request, Response } from 'express';
import { AppDataSource } from './config/database';
import router from './routes/index.routes';
import passport from 'passport';
import './middlewares/passport'
import cookieParser from 'cookie-parser'

const app = express();
require('dotenv').config();
app.use(express.json())
app.use(passport.initialize());

app.use(cookieParser())

const PORT = process.env.PORT ?? 4000

AppDataSource.initialize()
    .then(() => {
        console.log("Database ka connection successfully...")

        app.use('/app/v1', router)

        app.listen(PORT, () => {
            console.log(`Server Started at ${PORT}`)
        })

        //default router
        app.get('/', (req: Request, res: Response) => {
            res.send("HEllo Default routers")
        })

    })
    .catch((err) => {
        console.log("Error while Connecting Database...", err);
    })

<<<<<<< HEAD
=======
<<<<<<< HEAD
//heellooo
=======
// helo honey boney
// hello darling 
>>>>>>> dev
>>>>>>> stage
