import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CommandService } from './command.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('command')
export class CommandController {
  constructor(private readonly commandService: CommandService) {}

  @Post()
  create(@Body() createCommandDto: CreateCommandDto) {
    return this.commandService.create(createCommandDto);
  }

  @Get()
  findAll() {
    return this.commandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commandService.findOne(+id);
  }

  @Get('vendeur/:id_vendeur')
  findByVendeur(@Param('id_vendeur') id_vendeur: string) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommandDto: UpdateCommandDto) {
    return this.commandService.update(+id, updateCommandDto);
  }

  @Delete(':id_command')
  @ApiBody({
    schema: {
      type: 'object',
      description: 'Delete Command by client',
    },
  })
  remove(
    @Param('id_command', ParseIntPipe) id_command: string,
    //@Param('id_client', ParseIntPipe) id_client: string,
  ) {
    return this.commandService.remove(+id_command);
  }

  @Delete('/vendeur/:id_command/:id_vendeur')
  @ApiBody({
    schema: {
      type: 'object',
      description: 'Delete Command by vendeur',
    },
  })
  anullerCommandByVendeur(
    @Param('id_command', ParseIntPipe) id_command: string,
    @Param('id_vendeur', ParseIntPipe) id_vendeur: string,
  ) {
    return this.commandService.anullerCommandByVendeur(+id_command, +id_vendeur);
  }

  @Post('report/:id_product/:id_user/:id_command')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        description: { type: 'string', example: 'Bad quality' },
      },
    },
  })
  reportProduct(
    @Param('id_product') id_product: number,
    @Param('id_user') id_user: number,
    @Param('id_command') id_command: number,
    @Body()
    description: string,
  ) {
    return this.commandService.report(
      id_product,
      id_user,
      id_command,
      description,
    );
  }
}
