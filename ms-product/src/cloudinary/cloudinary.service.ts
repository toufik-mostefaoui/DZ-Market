/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
  file: Express.Multer.File,
  folder = 'products',
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      if (!result) return reject(new Error('Cloudinary upload failed'));
      resolve({ url: result.secure_url, public_id: result.public_id });
    }).end(file.buffer);
  });
}


  async deleteImage(public_id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) return reject(error);
      resolve();
    });
  });
}

}
