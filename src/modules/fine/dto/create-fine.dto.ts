import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFineDto {
    @IsNotEmpty()
    @IsNumber()
    borrowId: number;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsString()
    reason?: string;
}