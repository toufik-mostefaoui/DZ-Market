import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config';


export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    folder: 'products',
    format: file.mimetype.split('/')[1], // 'jpg', 'png', etc.
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  }),
});
