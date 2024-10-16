import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDto {
    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    username: string;

    @IsNotEmpty({ message: "Password tidak boleh kosong" })
    @IsString({ message: "Password tidak sesuai" })
    password: string;
}

export class RefreshTokenDto {
    @IsNotEmpty({ message: "Refresh token tidak boleh kosong" })
    @IsString({ message: "Refresh token tidak sesuai" })
    refresh_token: string;
}