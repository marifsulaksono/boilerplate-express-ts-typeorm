import { Repository } from "typeorm";
import { TokenAuth } from "./auth.model";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export class AuthService {
    constructor(
        private readonly authRepository: Repository<TokenAuth>,
    ) {}

    async GetRefreshToken(token: string, ip: string) {
        return this.authRepository.findOneBy({ refresh_token: token, ip_address: ip });
    }

    // create a new one if the user has never logged in, or update if they have
    async StoreRefreshToken(user_id: string, token: string, ip: string) {
        return this.authRepository.createQueryBuilder()
            .insert()
            .into(TokenAuth)
            .values({ user_id, refresh_token: token, ip_address: ip })
            .orUpdate({
                conflict_target: ["user_id"],  // The column that causes conflict (primary key or unique key)
                overwrite: ["refresh_token", "ip_address"]  // The columns to update
            })
            .execute();
    }

    // this service can used to logout by delete the refresh token
    async DeleteRefreshToken(user_id: string, ip: string) {
        return this.authRepository.delete({ user_id, ip_address: ip });
    }    
}