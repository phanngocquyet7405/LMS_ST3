import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsEnum(['ADMIN', 'LIBRARIAN', 'READER'], { message: 'Quyền hạn không hợp lệ' })
    role?: 'ADMIN' | 'LIBRARIAN' | 'READER';
}