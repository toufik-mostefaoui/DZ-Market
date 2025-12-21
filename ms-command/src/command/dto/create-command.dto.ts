import { ApiProperty } from '@nestjs/swagger';
import { CommandProductDto } from './CommandProduct.dto';
import { IsNotEmpty } from 'class-validator';

export class CreateCommandDto {
  @ApiProperty({ description: 'ID of the User', example: 1 })
  @IsNotEmpty({ message: 'id_user should not be empty' })
  id_client: number;

  @ApiProperty({
    description: 'List of products in the command',
    type: [CommandProductDto],
  })
  @IsNotEmpty({ message: 'products should not be empty' })
  products: CommandProductDto[];
}
