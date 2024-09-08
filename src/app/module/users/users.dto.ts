import { IsNotEmpty, IsString, Matches } from "class-validator";

const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export class UserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @Matches(passwordRegEx, { message: `Password must contain minimum 8, at least one uppercase letter, one lowercase letter, one number` })
    password: string;
}