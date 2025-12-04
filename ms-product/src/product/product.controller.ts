import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { storage } from '../cloudinary/cloudinary-storage.config';
import { memoryStorage } from 'multer';
import { RemiseDto } from './dto/remise.dto';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 30, { storage: memoryStorage() }))
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[] = [],
  ) {
    return this.productService.create(dto, images);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 30, { storage: memoryStorage() }))
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() images: Express.Multer.File[] = [],
  ) {
    return this.productService.update(id, updateProductDto, images);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Post('rating/:idProduct')
  updateRating(
    @Body('rating') rating: number,
    @Param('idProduct') idProduct: number,
  ) {
    console.log(rating);

    return this.productService.updateRating(idProduct, rating);
  }

  @Post('feedback/:idProduct/:idUser')
  updateFeedback(
    @Body('comment') comment: string,
    @Param('idProduct') idProduct: number,
    @Param('idUser') idUser: number,
  ) {
    return this.productService.updateFeedback(idProduct, idUser, comment);
  }

  @Post('discount/:idProduct')
  addRemise(
    @Body() remiseDto: RemiseDto,
    @Param('idProduct') idProduct: number,
  ) {
    return this.productService.addRemise(
      idProduct,
      remiseDto.discount,
      remiseDto.start_date,
      remiseDto.end_date,
    );
  }
}
