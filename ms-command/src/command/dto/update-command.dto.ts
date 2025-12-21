import { PartialType } from '@nestjs/mapped-types';
import { CreateCommandDto } from './create-command.dto';
import { CommandProductDto } from './CommandProduct.dto';
import { Status } from '../enumeration/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Not } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

export class UpdateCommandDto extends PartialType(CreateCommandDto) {
  @ApiProperty({ description: 'ID of the Seller', example: 1 })
  @IsNotEmpty({ message: 'id_vendeur should not be empty' })
  id_vendeur: number;

  @ApiProperty({ description: 'Status of the command', enum: Status })
  status: Status;
}
