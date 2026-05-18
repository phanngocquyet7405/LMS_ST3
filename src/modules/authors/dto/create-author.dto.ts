import { IsNotEmpty, IsOptional, IsString, IsEmail, IsDateString } from 'class-validator';

export class CreateAuthorDto {
    @IsNotEmpty({ message: 'Tên tác giả không được để trống' })
    @IsString()
    name: string;

    @IsOptional()
    @IsEmail({}, { message: 'Định dạng email tác giả không hợp lệ' })
    email?: string;

    @IsOptional()
    @IsDateString({}, { message: 'Ngày sinh phải đúng định dạng ngày chuỗi ngày (YYYY-MM-DD)' })
    birthDate?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}