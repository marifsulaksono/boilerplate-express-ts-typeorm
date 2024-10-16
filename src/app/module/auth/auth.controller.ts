import { Router, Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { UserService } from "../users/users.service";
import ValidatorMiddleware from "../../middleware/validator";
import { LoginDto, RefreshTokenDto } from "./auth.dto";
import { MetadataToken } from "../../../lib/types/token";
import { CustomHttpExceptionError } from "../../../lib/common/customError";
import * as bcrypt from 'bcrypt';
import { TokenJwtGenerator, TokenJwtVerification } from "../../../lib/auth/token";
import { ResponseSuccessBuilder } from "../../../lib/common/response";

export class AuthController{
    public router: Router;
    private authService: AuthService;
    private userService: UserService;
    
    constructor (authService: AuthService, userService: UserService) {
        this.router = Router();
        this.authService = authService;
        this.userService = userService;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/login', ValidatorMiddleware(LoginDto), this.login);
        this.router.post('/new-access-token', ValidatorMiddleware(RefreshTokenDto), this.refreshAccessToken);
        this.router.post('/logout', ValidatorMiddleware(RefreshTokenDto), this.logout);
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ip: string = req.ip;
            const payload: LoginDto = req.body;
            const metadata: MetadataToken = {
                id: '',
                name: '',
                email: '',
            }
            const existUser = await this.userService.GetByEmail(payload.email)
            if (!existUser) {
                throw new CustomHttpExceptionError('Informasi Username atau password tidak ditemukan!', 401);
            }

            // validate password
            const isValidPassword = await bcrypt.compare(payload.password, existUser.password);
            if (!isValidPassword) {
                throw new CustomHttpExceptionError('Informasi Username atau password tidak ditemukan!', 401);
            }

            metadata.id = existUser.id;
            metadata.name = existUser.name;
            metadata.email = existUser.email;

            // generate jwt token
            const accessToken = await TokenJwtGenerator(metadata, process.env.JWT_ACCESS_TOKEN_EXP, false);
            const refreshToken = await TokenJwtGenerator(metadata, process.env.JWT_REFRESH_TOKEN_EXP, true);

            // store refrsh token to database
            await this.authService.StoreRefreshToken(metadata.id, refreshToken, ip);

            req.id = metadata.id;
            req.email = metadata.email;

            // return access token and refresh token to frontend
            ResponseSuccessBuilder(res, 200, 'Login berhasil', {
                access_token: accessToken,
                refresh_token: refreshToken,
                metadata: {
                    name: metadata.name,
                    email: metadata.email,
                }
            });
        } catch (error) {
            next(error);
        }
    }

    refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ip: string = req.ip;
            const refresTokenDto: RefreshTokenDto = req.body;
            const token = await this.authService.GetRefreshToken(refresTokenDto.refresh_token, ip);
            if (!token) {
                throw new CustomHttpExceptionError('Token tidak sesuai', 401);
            }
    
            // jwt verify
            const metadata = await TokenJwtVerification(token.refresh_token, true);

            // generate new access token
            const accessToken = await TokenJwtGenerator(metadata, process.env.JWT_ACCESS_TOKEN_EXP, false);

            req.id = metadata.id;
            req.name = metadata.name;
            req.email = metadata.email;
            ResponseSuccessBuilder(res, 200, 'Berhasil mendapatkan access token baru', { access_token: accessToken })
        } catch (error) {
            next(error);
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ip: string = req.ip;
            const refresTokenDto: RefreshTokenDto = req.body;
            const metadata = await TokenJwtVerification(refresTokenDto.refresh_token, true);
            await this.authService.DeleteRefreshToken(metadata.id, ip);
            ResponseSuccessBuilder(res, 200, 'Logout berhasil', null);
        } catch (error) {
            next(error);
        }
    }
}