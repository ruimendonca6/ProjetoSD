/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateHistoricalEventDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  lang: string;

  @IsString()
  @IsNotEmpty()
  category1: string;

  @IsString()
  @IsNotEmpty()
  category2: string;

  @IsString()
  @IsNotEmpty()
  granularity: string;
}
