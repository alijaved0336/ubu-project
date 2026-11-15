import * as Sharp from 'sharp';
import { Injectable } from '@nestjs/common';
import { encode } from 'blurhash';

const MAX_FILE_SIZE = 100 * 1024; // 100 KB
const MAX_DIMENSION = 1280;
@Injectable()
export class ImageService {
  constructor() { }

  private async encodeImageToBlurhash(imageUrlOrBuffer: string | Buffer): Promise<string> {
    try {
      let buffer: Buffer;

      if (typeof imageUrlOrBuffer === 'string') {
        const axios = await import('axios'); // lazy import
        const response = await axios.default.get(imageUrlOrBuffer, { responseType: 'arraybuffer' });
        buffer = Buffer.from(response.data);
      } else {
        buffer = imageUrlOrBuffer;
      }

      // Use sharp to get raw pixel data
      const { data, info } = await Sharp(buffer).resize(64, 64, { fit: 'inside' }).raw().ensureAlpha().toBuffer({ resolveWithObject: true });

      const clamped = new Uint8ClampedArray(data);
      return encode(clamped, info.width, info.height, 4, 4);
    } catch (error) {
      console.error('Blurhash (sharp) failed:', error.message);
      return '';
    }
  }

  async generateBlurhash(image: string | Buffer): Promise<string> {
    return this.encodeImageToBlurhash(image);
  }

  async compressImage(buffer: Buffer): Promise<Buffer> {
    const metadata = await this.getImageMetadata(buffer);
    const { width, height } = this.getResizedDimensions(metadata);

    let quality = 80;
    let bestOutput = buffer;

    while (quality >= 20) {
      try {
        const compressed = await this.convertToWebP(buffer, quality, width, height);

        if (compressed.length <= MAX_FILE_SIZE) {
          return compressed;
        }

        bestOutput = compressed;
        quality -= 10;
      } catch (e) {
        console.error(`Compression failed at quality ${quality}:`, e);
        break;
      }
    }

    return bestOutput;
  }

  private async getImageMetadata(buffer: Buffer) {
    const image = Sharp(buffer);
    return await image.metadata();
  }

  private getResizedDimensions(metadata: Sharp.Metadata): { width?: number; height?: number } {
    const { width, height } = metadata;
    if (!width || !height) return {};

    const aspectRatio = width / height;
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      if (width > height) {
        return { width: MAX_DIMENSION, height: Math.round(MAX_DIMENSION / aspectRatio) };
      } else {
        return { width: Math.round(MAX_DIMENSION * aspectRatio), height: MAX_DIMENSION };
      }
    }

    return { width, height };
  }

  private async convertToWebP(buffer: Buffer, quality: number, width?: number, height?: number): Promise<Buffer> {
    const transformer = Sharp(buffer).toFormat('webp', { quality });

    if (width && height) {
      transformer.resize(width, height, { fit: 'inside' });
    }

    return await transformer.toBuffer();
  }

  async getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
    const metadata = await Sharp(buffer).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  }

  async compressFile(file: Express.Multer.File) {
    const { buffer, mimetype } = file;
    let compressedBuffer;
    if (mimetype.startsWith('image/')) {
      compressedBuffer = await this.compressImage(buffer);
    }

    if (mimetype.startsWith('video/')) {
      return file;
    }

    return {
      ...file,
      buffer: compressedBuffer,
      size: compressedBuffer.length,
      dimensions: await this.getImageDimensions(compressedBuffer),
    };
  }

  async createTinyBlurImage(buffer: Buffer): Promise<string> {
    const bluryImage = await Sharp(buffer)
      .resize(64, 64, { fit: 'inside' }) // very small size
      .blur(2) // smooth it out
      .webp({ quality: 100 }) // compress aggressively
      .toBuffer();

    const base64 = bluryImage.toString('base64');
    const dataUrl = `data:image/webp;base64,${base64}`;

    return dataUrl;
  }
}
