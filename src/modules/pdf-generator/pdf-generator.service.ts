import { Injectable } from '@nestjs/common';
const PDFDocument = require('pdfkit-table');

@Injectable()
export class PdfGeneratorService {
  async generatePdf(transactionId: number): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'portrait',
        bufferPages: true,
      });

      doc.text(`TITULO DE PRUEBA - ${transactionId}`);
      doc.moveDown();
      doc.text('Subtitulo de prueba');

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        resolve(Buffer.concat(buffer));
      });
      doc.end();
    });

    return pdfBuffer;
  }
}
