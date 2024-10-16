import { NextFunction, Request, Response, Router } from "express";
import { UserService } from "./users.service";
import { FilterRequest } from "../../../lib/types/filterRequest";
import { ResponseSuccessBuilder } from "../../../lib/common/response";
import { UserDto } from "./users.dto";
import { CustomHttpExceptionError } from '../../../lib/common/customError';
import ValidatorMiddleware from "../../middleware/validator";

export class UserController {
    public router: Router;
    private userService: UserService;

    constructor(userService: UserService) {
        this.router = Router();
        this.userService = userService;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.GetAll);
        this.router.get('/:id', this.GetById);
        this.router.post('/', ValidatorMiddleware(UserDto), this.Create);
        this.router.put('/:id', ValidatorMiddleware(UserDto), this.Update);
        this.router.delete('/:id', this.Delete);
    }

    GetAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filter: FilterRequest = {
                name: req.query.name as string | undefined,
            }
            const page: number = parseInt(req.query.page as string) || 1;
            const limit: number = parseInt(req.query.limit as string) || 10;
            const users = await this.userService.GetAll(page, limit, filter);
            return ResponseSuccessBuilder(res, 200, undefined, users);
        } catch (error) {
            next(error);
        }
    }

    GetById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id: string = req.params.id;
            const user = await this.userService.GetById(id);
            return ResponseSuccessBuilder(res, 200, undefined, user);
        } catch (error) {
            next(error);
        }
    }

    Create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload: UserDto = req.body;
            const user = await this.userService.Create(payload);
            return ResponseSuccessBuilder(res, 201, 'Success create user', user);
        } catch (error) {
            next(error);
        }
    }

    Update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id: string = req.params.id;
            const payload: UserDto = req.body;
            const user = await this.userService.Update(id, payload);
            return ResponseSuccessBuilder(res, 200, 'Success update user', user);
        } catch (error) {
            next(error);
        }
    }

    Delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id: string = req.params.id;
            const isDeleted = await this.userService.Delete(id);
            if (!isDeleted) {
                throw new CustomHttpExceptionError('User not found', 400);
            }
            return ResponseSuccessBuilder(res, 200, 'Success delete user', null);
        } catch (error) {
            next(error);
        }
    }
}