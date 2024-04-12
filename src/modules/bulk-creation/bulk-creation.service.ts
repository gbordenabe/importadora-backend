import { BadRequestException, Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import * as csv from 'csv-parser';
import { ClientService } from '../client/services/client.service';

@Injectable()
export class BulkCreationService {
  constructor(private readonly clientService: ClientService) {}

  createClientsFromCsv(file: Express.Multer.File): Promise<any> {
    if (file.mimetype !== 'text/csv') {
      throw new BadRequestException(
        'Invalid file type. Please upload a CSV file.',
      );
    }

    const results = [];
    const clientNumbers = new Set();

    const readableStream = new Readable();
    readableStream.push(file.buffer);
    readableStream.push(null);

    return new Promise((resolve, reject) => {
      readableStream
        .pipe(csv())
        .on('data', (data) => {
          if (!clientNumbers.has(data.Numero)) {
            clientNumbers.add(data.Numero);
            results.push(data);
          }
        })
        .on('end', async () => {
          const formatedResults = results.map((result) => {
            return {
              name: result['Nombre del Cliente'],
              business_name: result['Razon Social'],
              client_number: result.Numero,
              cuit_cuil: result.Cuit,
              province: result['Provincia '],
            };
          });
          try {
            const response =
              await this.clientService.bulkCreation(formatedResults);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
