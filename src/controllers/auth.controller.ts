import { IResponse } from "../utils/response.type"
import * as authService from '../services/auth.service'
import { Request, Response } from "express";

export const signup = async(req: Request, res: Response) => {
    const signupResponse: IResponse = await authService.signup(req, res);
     
        return res.status(signupResponse.code).json(signupResponse)

}

export const login = async(req: Request, res: Response) => {
    const loginRespose: any = await authService.login(req, res);

    return res.status(loginRespose.code).json(loginRespose)


}