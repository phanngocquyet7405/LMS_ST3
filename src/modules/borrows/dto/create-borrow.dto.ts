import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsNumber,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BorrowItemDto {
    @IsNotEmpty()
    @IsNumber()
    bookId: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

export class CreateBorrowDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BorrowItemDto)
    items: BorrowItemDto[];

    @IsNotEmpty()
    dueDate: string;
}