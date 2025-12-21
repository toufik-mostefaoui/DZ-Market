import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { CommandController } from './command.controller';
import { CommandClient } from './entities/command-client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ReportProduct } from './entities/report-product.entity';
import { CommandVendeur } from './entities/command-vendeur.entity';
import { CommandItem } from './entities/command-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommandClient,
      CommandVendeur,
      CommandItem,
      ReportProduct,
    ]),
    HttpModule,
  ],
  controllers: [CommandController],
  providers: [CommandService],
})
export class CommandModule {}
