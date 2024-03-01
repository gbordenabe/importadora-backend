// multipart.middleware.ts

import {
  Injectable,
  MethodNotAllowedException,
  NestMiddleware,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MultipartMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const contentType = req.headers['content-type'];

    if (req.method !== 'POST') {
      // Si el método no es POST, responde con un error en inglés
      throw new MethodNotAllowedException('Method not allowed.');
    }

    if (!contentType || !contentType.includes('multipart/form-data')) {
      // Si el contenido no es multipart/form-data, responde con un error
      throw new UnsupportedMediaTypeException('Unsupported media type.');
    }

    // Si el método es POST y el contenido es multipart/form-data, continúa con la siguiente capa (controlador)
    next();
  }
}
