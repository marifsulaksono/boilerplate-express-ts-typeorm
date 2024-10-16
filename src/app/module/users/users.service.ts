import { Repository } from "typeorm";
import { User } from "./users.model";
import { FilterRequest } from "../../../lib/types/filterRequest";
import metaPagination from "../../../lib/common/pagination";
import { UserDto } from "./users.dto";
import { CustomHttpExceptionError } from "../../../lib/common/customError";
import * as bcrypt from 'bcrypt';

export class UserService {
    constructor(
        private readonly userRepository: Repository<User>
    ) {}

    GetAll = async(page: number, limit: number, filter: FilterRequest) => {
        const queryBuilder = this.userRepository.createQueryBuilder('user')
        queryBuilder.select(['user.id', 'user.name', 'user.email', 'user.created_at'])
        .where('user.deleted_at IS NULL')

        if (filter.name) {
            queryBuilder.andWhere('LOWER(user.name) LIKE LOWER(:name)', {name: `%${filter.name}%`})
        }

        const [users, total] = await queryBuilder.skip((page - 1) * limit).limit(limit).getManyAndCount();
        return {
            users,
            meta: metaPagination(page, limit, total)
        };
    }

    GetById = async(id: string) => {
        const queryBuilder = this.userRepository.createQueryBuilder('user')
        return queryBuilder.select(['user.id', 'user.name', 'user.email', 'user.created_at'])
        .where('user.id = :id', { id })
        .getOne();
    }

    GetByEmail = async(email: string) => {
        const queryBuilder = this.userRepository.createQueryBuilder('user')
        return queryBuilder.select(['user.id', 'user.name', 'user.email', 'user.password', 'user.created_at'])
        .where('user.email = :email', { email })
        .getOne();
    }

    async Create(data: UserDto) {
        data.password = await bcrypt.hash(data.password, 10);
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    async Update(id: string, data: UserDto) {
        const existUser = await this.userRepository.findOneBy({id});
        if (!existUser) {
            throw new CustomHttpExceptionError('User not found', 404);
        }

        data.password = await bcrypt.hash(data.password, 10);
        Object.assign(existUser, data)
        return this.userRepository.save(existUser)
    }

    async Delete(id: string): Promise<{ affected?: number }> {
        return this.userRepository.softDelete(id);
    }
}