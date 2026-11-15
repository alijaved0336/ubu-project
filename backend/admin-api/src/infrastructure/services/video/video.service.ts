import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeFile, unlink, readFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import { execSync } from 'child_process';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const ffprobePath = execSync('which ffprobe').toString().trim();
ffmpeg.setFfprobePath(ffprobePath);

@Injectable()
export class VideoService {
  constructor() {}

  async getVideoMetadata(filePath: string) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(metadata);
      });
    });
  }

  async compressVideo(file: Express.Multer.File, crf = 28): Promise<Express.Multer.File> {
    const inputPath = join(tmpdir(), `${randomUUID()}-${file.originalname}`);
    const outputExt = 'mp4';
    const outputPath = join(tmpdir(), `${randomUUID()}-compressed.${outputExt}`);

    try {
      await writeFile(inputPath, file.buffer);
      await new Promise<void>((resolve, reject) => {
        const command = ffmpeg(inputPath);
        command.videoCodec('libx264');
        command
          .outputOptions([`-crf ${crf}`, '-preset veryfast', '-c:a aac', '-b:a 96k', '-movflags +faststart'])
          .output(outputPath)
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .run();
      });
      const compressedBuffer = await readFile(outputPath);

      return {
        ...file,
        buffer: compressedBuffer,
        size: compressedBuffer.length,
        mimetype: 'video/mp4',
        originalname: `${file.originalname.replace(/\.[^/.]+$/, '')}.${outputExt}`,
      };
    } finally {
      await unlink(inputPath).catch(() => {});
      await unlink(outputPath).catch(() => {});
    }
  }
}
