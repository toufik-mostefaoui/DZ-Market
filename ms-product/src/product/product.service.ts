import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Any, Double, Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { createTracing } from 'trace_events';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    images: Express.Multer.File[] = [],
  ) {
    const ExistingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });
    if (ExistingProduct)
      throw new HttpException('Product Already exist', HttpStatus.CONFLICT);

    // if (createProductDto.discount === 0) {
    //   createProductDto.discount_start_at = null;
    //   createProductDto.discount_end_at = null;
    // } else {
    //   if (
    //     !createProductDto.discount_start_at ||
    //     !createProductDto.discount_end_at
    //   )
    //     throw new BadRequestException('Start and end date are required');

    //   if (
    //     new Date(createProductDto.discount_start_at) >=
    //     new Date(createProductDto.discount_end_at)
    //   )
    //     throw new BadRequestException('Start date must be before end date');
    // }

    const uploadedImages: { url: string; public_id: string }[] = [];

    for (const file of images) {
      const result = await this.cloudinaryService.uploadImage(file);
      uploadedImages.push({
        url: result.url, // secure URL from Cloudinary
        public_id: result.public_id, // store public_id for future deletions
      });
    }

    const product = this.productRepository.create({
      ...createProductDto,
      images: uploadedImages, // store array of objects
    });

    return this.productRepository.save(product);
  }

  async findAll() {
    const products = await this.productRepository.find({
      where: { is_deleted: false },
    });
    if (!products || products.length === 0)
      throw new NotFoundException('No product found');

    const now = new Date();

    // Verify discount for each product
    for (const product of products) {
      if (
        product.discount > 0 &&
        product.discount_end_at &&
        now > product.discount_end_at
      ) {
        // Discount expired → update fields
        product.discount = 0;
        product.discount_start_at = null;
        product.discount_end_at = null;
        await this.productRepository.save(product);
      }
    }

    return products;
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product || product.is_deleted)
      throw new NotFoundException('Product not found');

    const now = new Date();

    if (
      product.discount > 0 &&
      product.discount_end_at &&
      now > product.discount_end_at
    ) {
      product.discount = 0;
      product.discount_start_at = null;
      product.discount_end_at = null;
      await this.productRepository.save(product);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    images: Express.Multer.File[] = [],
  ) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    let newImages: { url: string; public_id: string }[] = [];

    if (images.length > 0) {
      // 1️⃣ Delete old images from Cloudinary
      for (const img of product.images || []) {
        if (img.public_id) {
          await this.cloudinaryService.deleteImage(img.public_id);
        }
      }

      // 2️⃣ Upload new images
      for (const file of images) {
        const uploaded = await this.cloudinaryService.uploadImage(file);
        newImages.push(uploaded);
      }
    } else {
      // Keep old images if no new images uploaded
      newImages = product.images;
    }

    const updatedProduct = this.productRepository.merge(product, {
      ...updateProductDto,
      images: newImages,
    });

    return this.productRepository.save(updatedProduct);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product || product.is_deleted)
      throw new NotFoundException('Product not found');

    product.is_deleted = true;
    await this.productRepository.save(product);

    return product;
  }

  async updateRating(idProduct: number, rating: number) {
    const product = await this.productRepository.findOne({
      where: { id: idProduct },
    });
    if (!product || product.is_deleted)
      throw new NotFoundException('Product not found');

    product.viewes_number++;
    console.log(product.viewes_number);

    let ratingNumber = product.rating * (product.viewes_number - 1);
    ratingNumber = ratingNumber + rating;
    console.log(ratingNumber);

    const newRating = ratingNumber / product.viewes_number;
    console.log(newRating);

    product.rating = newRating;
    await this.productRepository.save(product);

    return product;
  }

  async updateFeedback(idProduct: number, idUser: number, comment: string) {
    const product = await this.productRepository.findOne({
      where: { id: idProduct },
    });
    if (!product || product.is_deleted)
      throw new NotFoundException('Product not found');

    product.feedBacks.push({ id_user: idUser, comment: comment });

    await this.productRepository.save(product);

    return product;
  }

  async addRemise(
    idProduct: number,
    discount: number,
    startDate: Date,
    endDate: Date,
  ) {
    const product = await this.productRepository.findOne({
      where: { id: idProduct },
    });
    if (!product || product.is_deleted)
      throw new NotFoundException('Product not found');

    if (discount === 0) {
      product.discount = 0;
      product.discount_start_at = null;
      product.discount_end_at = null;
      return await this.productRepository.save(product);
    }
    if (!startDate || !endDate)
        throw new BadRequestException('Start and end date are required');

    if (new Date(startDate) >= new Date(endDate))
        throw new BadRequestException('Start date must be before end date');
    

    const now = new Date();
    if (new Date(endDate) <= now)
        throw new BadRequestException('End date must be in the future');

    product.discount = discount;
    product.discount_start_at = startDate;
    product.discount_end_at = endDate;
    return await this.productRepository.save(product);
  }
}
