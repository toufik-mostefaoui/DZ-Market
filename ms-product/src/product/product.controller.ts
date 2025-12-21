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
  ParseIntPipe,
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
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 30, { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ...Object.keys(new CreateProductDto()).reduce((acc, key) => {
          acc[key] = { type: 'string' }; // or number based on your DTO type
          return acc;
        }, {} as any),
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Upload one or more product images',
        },
      },
      required: ['images'], // images are required
    },
  })
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
  findOne(@Param('id' ,ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 30, { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
  schema: {
    type: 'object',
    properties: {
      ...Object.keys(new UpdateProductDto()).reduce((acc, key) => {
        acc[key] = { type: 'string' }; // or number based on your DTO type
        return acc;
      }, {} as any),
      images: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
        description: 'Upload one or more product images',
      },
    },
    required: ['images'], // images are required
  },
})
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rating: { type: 'number', example: 4 },
      },
    },
  })
  updateRating(
    @Body('rating') rating: number,
    @Param('idProduct') idProduct: number,
  ) {
    console.log(rating);

    return this.productService.updateRating(idProduct, rating);
  }

  @Post('feedback/:idProduct/:idUser')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: { type: 'string', example: 'this is good product' },
      },
    },
  })
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
