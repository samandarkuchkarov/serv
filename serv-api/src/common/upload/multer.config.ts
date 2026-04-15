import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export function createMulterOptions(folder: string) {
  return {
    storage: diskStorage({
      destination: `./uploads/${folder}`,
      filename: (_req: any, file: Express.Multer.File, cb: any) => {
        cb(null, `${uuidv4()}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
      if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp|svg\+xml)$/)) {
        return cb(new BadRequestException('Only image files are allowed'), false);
      }
      cb(null, true);
    },
  };
}
