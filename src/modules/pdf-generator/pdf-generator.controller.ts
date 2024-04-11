import { Controller, Get, Param, Res } from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';

@Controller('pdf-generator')
export class PdfGeneratorController {
  constructor(private readonly pdfGeneratorService: PdfGeneratorService) {}

  @Get(':transactionId')
  async generatePdf(@Res() res, @Param('transactionId') transactionId: string) {
    const buffer = await this.pdfGeneratorService.generatePdf(+transactionId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
