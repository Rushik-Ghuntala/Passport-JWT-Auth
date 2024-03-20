import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../entities/user.entities';
import { AppDataSource } from '../config/database';
import { Request } from 'express';

const jwtSecret = process.env.JWT_SECRET;

const cookieExtractor = (req: Request) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret as string,
        },
        async (payload, done) => {
            try 
            {
                const userRepository = AppDataSource.getRepository(User);
                const user = await userRepository.findOne({
                    where: { username: payload.username },
                });
                if (user) return done(null, user);
                
                return done(null, false);
            } 
            catch (error) {
                return done(error, false);
            }
        }
    )
);

export default passport;
