import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsInt,
    Min
} from 'class-validator';

export class CreateBookDto {

    @IsNotEmpty({ message: 'Tiêu đề sách không được để trống' })
    @IsString()
    title: string;

    @IsOptional()
    @IsInt()
    authorId?: number;

    @IsNotEmpty({ message: 'Mã ISBN không được để trống' })
    @IsString()
    isbn: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    categoryId?: number;

    @IsNotEmpty({ message: 'Số lượng không được để trống' })
    @IsNumber()
    @Min(0, { message: 'Số lượng không được nhỏ hơn 0' })
    quantity: number;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}