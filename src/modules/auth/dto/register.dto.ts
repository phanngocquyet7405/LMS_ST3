import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty({ message: 'Họ và tên không được để trống' })
    fullName!: string;

    @IsEmail({}, { message: 'Email không đúng định dạng' })
    email!: string;

    @IsString()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password!: string;
}