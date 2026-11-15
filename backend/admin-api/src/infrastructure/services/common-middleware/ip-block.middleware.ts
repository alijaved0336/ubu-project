import { HttpStatus, Injectable, NestMiddleware, Request, Response } from '@nestjs/common';
import axios from 'axios';
import { NextFunction } from 'express';

@Injectable()
export class IpBlockMiddleware implements NestMiddleware {
  async use(@Request() req, @Response() res, next: NextFunction) {
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;
    console.log("===========ip=======",ip)
    try {
      const { data: externalGeo } = await axios.get(`http://ip-api.com/json/${ip}`);
      console.log('Geo check:-------------------', externalGeo);

      if (externalGeo?.country === 'France') {
        return res.status(HttpStatus.FORBIDDEN).json({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Access from this region is not allowed',
        });
      }

      next(); // IP is safe
    } catch (err) {
      console.error('Geo check failed or access denied:', err.message || err);

      next();
    }
   


  }
}
