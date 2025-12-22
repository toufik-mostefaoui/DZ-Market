/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandClient } from './entities/command-client.entity';
import { Repository } from 'typeorm';
import { Status } from './enumeration/status.enum';
import { ReportProduct } from './entities/report-product.entity';
import { CommandVendeur } from './entities/command-vendeur.entity';
import { CommandItem } from './entities/command-item.entity';

@Injectable()
export class CommandService {
  constructor(
    @InjectRepository(CommandClient)
    private commandClientRepository: Repository<CommandClient>,
    @InjectRepository(CommandVendeur)
    private commandVendeurRepo: Repository<CommandVendeur>,
    @InjectRepository(CommandItem)
    private commandItemRepo: Repository<CommandItem>,
    @InjectRepository(ReportProduct)
    private reportProductRepository: Repository<ReportProduct>,
    private readonly httpService: HttpService,
  ) {}

  async create(createCommandDto: CreateCommandDto) {
    const commandClient = await this.commandClientRepository.save({
      id_client: createCommandDto.id_client,
      total_price: 0, // temporary, will update later
    });

    const products: any[] = [];
    const vendeurTotals: Record<number, number> = {}; // accumulate subtotal per vendeur

    for (const prod of createCommandDto.products) {
      const product = await this.httpService
        .get(`${process.env.MSPRODUCTS_URL}/product/${prod.id_product}`)
        .toPromise()
        .catch((err) => {
          throw new HttpException(
            err.response.data.message ||
              `Error fetching product ${prod.id_product}`,
            err.response.status,
          );
        });

      if (!product || product.data == null) {
        throw new NotFoundException(`Product ${prod.id_product} not found`);
      }

      const commandItem = await this.commandItemRepo.save({
        id_command: commandClient.id_command,
        id_product: product.data.id,
        quantity: prod.quantity,
        price: product.data.price,
        id_vendeur: product.data.id_vendeur,
        status: Status.ENATTENTE,
      });

      const subtotal = product.data.price * prod.quantity;
      vendeurTotals[product.data.id_vendeur] =
        (vendeurTotals[product.data.id_vendeur] || 0) + subtotal;

      products.push({
        id_product: product.data.id,
        quantity: prod.quantity,
        price: product.data.price,
        id_vendeur: product.data.id_vendeur,
      });
    }

    // Save CommandVendeur rows
    for (const [id_vendeur, sub_total] of Object.entries(vendeurTotals)) {
      await this.commandVendeurRepo.save({
        id_command: commandClient.id_command,
        id_vendeur: Number(id_vendeur),
        sub_total,
        status: Status.ENATTENTE,
      });
    }

    const total_price: number = products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    commandClient.total_price = total_price;
    await this.commandClientRepository.save(commandClient);

    return commandClient;
  }

  async findAll() {
    const commands = await this.commandClientRepository.find();

    for (const command of commands) {
      const items = await this.commandItemRepo.find({
        where: { id_command: command.id_command },
      });
      if (items.length === 0) {
        command.status = Status.ANNULER;
        await this.commandClientRepository.save(command);
      }
      const allValidated = items.every(
        (item) => item.status === Status.VALIDER,
      );

      if (allValidated) {
        command.status = Status.VALIDER;
        await this.commandClientRepository.save(command);
      } else {
        command.status = Status.ENATTENTE;
        await this.commandClientRepository.save(command);
      }

      (command as any).products = items;
    }

    return commands;
  }

  async findCommandByClient(id_client: number) {
    const commands = await this.commandClientRepository.find({
      where: { id_client: id_client },
    });

    if (!commands)
      throw new NotFoundException(
        `Command for userID : ${id_client} not found`,
      );
    for (const command of commands) {
      const items = await this.commandItemRepo.find({
        where: { id_command: command.id_command },
      });
      if (items.length === 0) {
        command.status = Status.ANNULER;
        await this.commandClientRepository.save(command);
      }
      const allValidated = items.every(
        (item) => item.status === Status.VALIDER,
      );

      if (allValidated) {
        command.status = Status.VALIDER;
        await this.commandClientRepository.save(command);
      } else {
        command.status = Status.ENATTENTE;
        await this.commandClientRepository.save(command);
      }

      (command as any).products = items;
    }

    return commands;
  }

  async findCommandByVendeur(id_vendeur: number) {
    const commands = await this.commandVendeurRepo.find({
      where: { id_vendeur: id_vendeur },
    });

    if (!commands)
      throw new NotFoundException(
        `Command for vendeurID : ${id_vendeur} not found`,
      );
    for (const command of commands) {
      const items = await this.commandItemRepo.find({
        where: { id_command: command.id_command, id_vendeur: id_vendeur },
      });

      const commandClient = await this.commandClientRepository.findOne({
        where: { id_command: command.id_command },
      });

      (command as any).products = items;
      (command as any).id_client = commandClient?.id_client;
    }

    return commands;
  }

  async update(id_command: number, updateCommandDto: UpdateCommandDto) {
    const commandVendeur = await this.commandVendeurRepo.findOne({
      where: {
        id_command: id_command,
        id_vendeur: updateCommandDto.id_vendeur,
      },
    });

    const commandClient = await this.commandClientRepository.findOne({
      where: { id_command: id_command },
    });

    if (!commandVendeur || !commandClient)
      throw new NotFoundException('Command not found');

    commandVendeur.status = updateCommandDto.status;
    await this.commandVendeurRepo.save(commandVendeur);

    const commandItems = await this.commandItemRepo.find({
      where: {
        id_command: id_command,
        id_vendeur: updateCommandDto.id_vendeur,
      },
    });

    for (const item of commandItems) {
      if (updateCommandDto.status === Status.ANNULER) {
        await this.commandItemRepo.remove(item);
        continue;
      }
      item.status = updateCommandDto.status;
      await this.commandItemRepo.save(item);
    }
    return { commandClient, commandVendeur };
  }

  async remove(id_command: number) {
    const commandsVendeur = await this.commandVendeurRepo.find({
      where: { id_command: id_command },
    });

    const commandClient = await this.commandClientRepository.findOne({
      where: { id_command: id_command },
    });

    if (!commandsVendeur || !commandClient)
      throw new NotFoundException('Command not found');

    const commandItems = await this.commandItemRepo.find({
      where: { id_command: id_command },
    });

    for (const item of commandItems) {
      // item.status = Status.ANNULER;
      // await this.commandItemRepo.save(item);
      await this.commandItemRepo.remove(item);
    }

    for (const cmdVendeur of commandsVendeur) {
      cmdVendeur.status = Status.ANNULER;
      await this.commandVendeurRepo.save(cmdVendeur);
    }

    commandClient.status = Status.ANNULER;
    await this.commandClientRepository.save(commandClient);

    return { commandClient, commandsVendeur };
  }

  async anullerCommandByVendeur(id_command: number, id_vendeur: number) {
    const commandVendeur = await this.commandVendeurRepo.findOne({
      where: { id_command: id_command, id_vendeur: id_vendeur },
    });

    if (!commandVendeur) throw new NotFoundException('Command not found');

    commandVendeur.status = Status.ANNULER;
    await this.commandVendeurRepo.save(commandVendeur);

    const productRemoved = await this.commandItemRepo.find({
      where: { id_command: id_command, id_vendeur: id_vendeur },
    });

    for (const item of productRemoved) {
      await this.commandItemRepo.remove(item);
    }

    return commandVendeur;
  }

  async report(
    id_product: number,
    id_user: number,
    id_command: number,
    description: string,
  ) {
    if (!description) {
      throw new HttpException('Missing required fields', 400);
    }
    const product = await this.httpService
      .get(`${process.env.MSPRODUCTS_URL}/product/${id_product}`)
      .toPromise()
      .catch((err) => {
        throw new HttpException(
          err.response.data.message || `Error fetching product ${id_product}`,
          err.response.status,
        );
      });
    if (!product || product.data == null) {
      throw new NotFoundException(`Product ${id_product} not found`);
    }
    const command = await this.commandClientRepository.findOne({
      where: { id_command: id_command },
    });
    if (!command)
      throw new NotFoundException(`Command ${id_command} not found`);
    const reportPayload = {
      id_user: id_user,
      id_product: id_product,
      id_vendeur: product.data.id_vendeur,
      id_command: id_command,
      description: description,
    };
    return await this.reportProductRepository.save(reportPayload);
  }
}
