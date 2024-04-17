import { Injectable } from '@nestjs/common';
import { TransactionService } from '../transaction/services/transaction.service';
const PDFDocument = require('pdfkit-table');

const example = {
  created_at: '2024-04-12T12:59:36.894Z',
  updated_at: '2024-04-12T13:32:37.114Z',
  id: 127,
  status: 'PENDING',
  bill_status: 'PENDING',
  cash_status: 'PENDING',
  check_status: 'PENDING',
  credit_note_status: 'EDITED',
  credit_status: 'PENDING',
  deposit_status: 'PENDING',
  retention_status: 'PENDING',
  total_checks: '3.00',
  total_deposit: '1.00',
  total_cash: '1.00',
  total_credit: '2.00',
  total_credit_note: '1.00',
  total_retention: '1.00',
  total_bill: '9.00',
  total_amount: '9.00',
  sku: '145212042024-imp-006559',
  is_active: true,
  company: {
    id: 1,
    name: 'Importadora',
    acronym: 'imp',
    is_active: true,
  },
  client: {
    id: 3,
    name: 'Mati',
    client_number: '6559',
    business_name: 'Mati E.I.R.L',
    cuit_cuil: '6559',
    city: 'Zapala',
    location: '',
    province: 'Neuquén',
    is_active: true,
  },
  created_by: {
    id: 2,
    user_name: 'vendedor',
    email: 'vendedor@gmail.com',
    name: 'Vendedor',
    last_name: 'vendedor25 con espacio',
    city: 'Comuna 6',
    location: '',
    province: 'Ciudad Autónoma de Buenos Aires',
    is_email_verified: false,
    is_active: true,
    role: {
      id: 1,
      name: 'SELLER',
    },
  },
  updated_by: null,
  bills: [
    {
      created_at: '2024-04-12T12:59:36.894Z',
      updated_at: '2024-04-12T13:32:37.114Z',
      request_change_comment: null,
      id: 82,
      status: 'PENDING',
      number: '1',
      amount: 9,
      date: '2024-04-01',
      observation: '1',
      approving_treasurer: null,
      created_by: {
        id: 2,
        user_name: 'vendedor',
        email: 'vendedor@gmail.com',
        name: 'Vendedor',
        last_name: 'vendedor25 con espacio',
        city: 'Comuna 6',
        location: '',
        province: 'Ciudad Autónoma de Buenos Aires',
        is_email_verified: false,
        is_active: true,
        role: {
          id: 1,
          name: 'SELLER',
        },
      },
      updated_by: null,
      historical: [],
    },
  ],
  cash: [
    {
      id: 22,
      status: 'PENDING',
      document_number: '1',
      created_at: '2024-04-12T12:59:36.894Z',
      updated_at: '2024-04-12T13:32:37.114Z',
      amount: '1.00',
      date: '2024-04-19',
      observation: '',
      request_change_comment: null,
      approving_treasurer: null,
      created_by: {
        id: 2,
        user_name: 'vendedor',
        email: 'vendedor@gmail.com',
        name: 'Vendedor',
        last_name: 'vendedor25 con espacio',
        city: 'Comuna 6',
        location: '',
        province: 'Ciudad Autónoma de Buenos Aires',
        is_email_verified: false,
        is_active: true,
        role: {
          id: 1,
          name: 'SELLER',
        },
      },
      updated_by: null,
      historical: [],
      file: null,
    },
  ],
  checks: [
    {
      id: 37,
      status: 'PENDING',
      document_number: '1',
      created_at: '2024-04-12T12:59:36.894Z',
      updated_at: '2024-04-12T13:32:37.114Z',
      amount: '1.00',
      date: '2024-04-25',
      observation: '1',
      request_change_comment: null,
      bank_name: null,
      type: 'OWN',
      approving_treasurer: null,
      created_by: {
        id: 2,
        user_name: 'vendedor',
        email: 'vendedor@gmail.com',
        name: 'Vendedor',
        last_name: 'vendedor25 con espacio',
        city: 'Comuna 6',
        location: '',
        province: 'Ciudad Autónoma de Buenos Aires',
        is_email_verified: false,
        is_active: true,
        role: {
          id: 1,
          name: 'SELLER',
        },
      },
      updated_by: null,
      historical: [],
      file: null,
    },
    {
      id: 36,
      status: 'PENDING',
      document_number: '1',
      created_at: '2024-04-12T12:59:36.894Z',
      updated_at: '2024-04-12T13:32:37.114Z',
      amount: '1.00',
      date: '2024-04-19',
      observation: '1',
      request_change_comment: null,
      bank_name: null,
      type: 'THIRD_PARTY',
      approving_treasurer: null,
      created_by: {
        id: 2,
        user_name: 'vendedor',
        email: 'vendedor@gmail.com',
        name: 'Vendedor',
        last_name: 'vendedor25 con espacio',
        city: 'Comuna 6',
        location: '',
        province: 'Ciudad Autónoma de Buenos Aires',
        is_email_verified: false,
        is_active: true,
        role: {
          id: 1,
          name: 'SELLER',
        },
      },
      updated_by: null,
      historical: [],
      file: null,
    },
    {
      id: 35,
      status: 'PENDING',
      document_number: '1',
      created_at: '2024-04-12T12:59:36.894Z',
      updated_at: '2024-04-12T13:32:37.114Z',
      amount: '1.00',
      date: '2024-04-19',
      observation: '1',
      request_change_comment: null,
      bank_name: null,
      type: 'ELECTRONIC',
      approving_treasurer: null,
      created_by: {
        id: 2,
        user_name: 'vendedor',
        email: 'vendedor@gmail.com',
        name: 'Vendedor',
        last_name: 'vendedor25 con espacio',
        city: 'Comuna 6',
        location: '',
        province: 'Ciudad Autónoma de Buenos Aires',
        is_email_verified: false,
        is_active: true,
        role: {
          id: 1,
          name: 'SELLER',
        },
      },
      updated_by: null,
      historical: [],
      file: null,
    },
  ],
  credit_notes: [
    {
      id: 11,
      status: 'EDITED',
      created_at: '2024-04-12T12:59:36.894Z',
      updated_at: '2024-04-12T13:32:36.050Z',
      amount: 1,
      date: '2024-04-13',
      observation: 'OBS 2',
      request_change_comment: 'Cambiar la obs',
      porcentage: 0,
      approving_treasurer: {
        id: 1,
        user_name: 'adminImportadora',
        email: null,
        name: 'Admin',
        last_name: 'Admin',
        city: null,
        location: null,
        province: null,
        is_email_verified: false,
        is_active: true,
        role: {
          id: 2,
          name: 'TREASURER',
        },
      },
      created_by: {
        id: 2,
        user_name: 'vendedor',
        email: 'vendedor@gmail.com',
        name: 'Vendedor',
        last_name: 'vendedor25 con espacio',
        city: 'Comuna 6',
        location: '',
        province: 'Ciudad Autónoma de Buenos Aires',
        is_email_verified: false,
        is_active: true,
        role: {
          id: 1,
          name: 'SELLER',
        },
      },
      updated_by: {
        id: 1,
        user_name: 'adminImportadora',
        email: null,
        name: 'Admin',
        last_name: 'Admin',
        city: null,
        location: null,
        province: null,
        is_email_verified: false,
        is_active: true,
        role: {
          id: 2,
          name: 'TREASURER',
        },
      },
      historical: [],
    },
  ],
  credits: [
    {
      id: 20,
      status: 'PENDING',
      created_at: '2024-04-12T12:59:36.894Z',
      updated_at: '2024-04-12T13:32:37.114Z',
      amount: 1,
      date: '2024-04-20',
      observation: '1',
      request_change_comment: null,
      type: 'COMMERCIAL',
      approving_treasurer: null,
      created_by: {
        id: 2,
        user_name: 'vendedor',
        email: 'vendedor@gmail.com',
        name: 'Vendedor',
        last_name: 'vendedor25 con espacio',
        city: 'Comuna 6',
        location: '',
        province: 'Ciudad Autónoma de Buenos Aires',
        is_email_verified: false,
        is_active: true,
        role: {
          id: 1,
          name: 'SELLER',
        },
      },
      updated_by: null,
      historical: [],
    },
    {
      id: 21,
      status: 'PENDING',
      created_at: '2024-04-12T12:59:36.894Z',
      updated_at: '2024-04-12T13:32:37.114Z',
      amount: 1,
      date: '2024-04-19',
      observation: '',
      request_change_comment: null,
      type: 'FINANCIAL',
      approving_treasurer: null,
      created_by: {
        id: 2,
        user_name: 'vendedor',
        email: 'vendedor@gmail.com',
        name: 'Vendedor',
        last_name: 'vendedor25 con espacio',
        city: 'Comuna 6',
        location: '',
        province: 'Ciudad Autónoma de Buenos Aires',
        is_email_verified: false,
        is_active: true,
        role: {
          id: 1,
          name: 'SELLER',
        },
      },
      updated_by: null,
      historical: [],
    },
  ],
  deposits: [
    {
      id: 51,
      status: 'PENDING',
      document_number: '1',
      created_at: '2024-04-12T12:59:36.894Z',
      updated_at: '2024-04-12T13:32:37.114Z',
      amount: '1.00',
      date: '2024-04-19',
      observation: '',
      request_change_comment: null,
      bank_name: null,
      approving_treasurer: null,
      created_by: {
        id: 2,
        user_name: 'vendedor',
        email: 'vendedor@gmail.com',
        name: 'Vendedor',
        last_name: 'vendedor25 con espacio',
        city: 'Comuna 6',
        location: '',
        province: 'Ciudad Autónoma de Buenos Aires',
        is_email_verified: false,
        is_active: true,
        role: {
          id: 1,
          name: 'SELLER',
        },
      },
      updated_by: null,
      historical: [],
      file: {
        id: 181,
        file_name: '022a2a36efde207a727abb53967e2b36-1712926776879.jpg',
        size: '48130',
        type: 'image/jpeg',
      },
    },
  ],
  retentions: [
    {
      id: 19,
      status: 'PENDING',
      created_at: '2024-04-12T12:59:36.894Z',
      updated_at: '2024-04-12T13:32:37.114Z',
      amount: 1,
      date: '2024-04-13',
      observation: '',
      request_change_comment: null,
      approving_treasurer: null,
      created_by: {
        id: 2,
        user_name: 'vendedor',
        email: 'vendedor@gmail.com',
        name: 'Vendedor',
        last_name: 'vendedor25 con espacio',
        city: 'Comuna 6',
        location: '',
        province: 'Ciudad Autónoma de Buenos Aires',
        is_email_verified: false,
        is_active: true,
        role: {
          id: 1,
          name: 'SELLER',
        },
      },
      updated_by: null,
      historical: [],
      file: {
        id: 182,
        file_name: 'Logo Azul Oscuro@4x-1712865784592 2-1712926776879.png',
        size: '27493',
        type: 'image/png',
      },
    },
  ],
};

const traductions = {
  OWN: 'propio',
  THIRD_PARTY: 'de terceros',
  ELECTRONIC: 'electrónico',
  COMMERCIAL: 'comercial',
  FINANCIAL: 'financiero',
};

@Injectable()
export class PdfGeneratorService {
  constructor(private readonly transactionService: TransactionService) {}

  tranformDate(date: string): string {
    const newDate = new Date(date);
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
  }

  async generatePdf(id: number): Promise<Buffer> {
    let data;
    try {
      data = await this.transactionService.findOneById({ id });
    } catch (error) {
      data = example;
    }
    const normalFont = 'Helvetica';
    const boldFont = 'Helvetica-Bold';

    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'portrait',
        bufferPages: true,
        margin: 25,
      });

      const title = () => {
        doc.fontSize(15);
        doc.font(boldFont);
      };

      title();
      doc.fontSize(20);
      doc.text(`Impresión de transacción`);
      doc.table(
        {
          headers: ['SKU', 'Fecha', 'Vendedor', 'Empresa', 'Cliente'],
          rows: [
            [
              data.sku,
              this.tranformDate(data.created_at),
              `${data.created_by.name} ${data.created_by.last_name}`,
              data.company.name,
              `${data.client.name} ${data.client.business_name}`,
            ],
          ],
        },
        {
          columnSize: [100, 30, 100, 100, 100],
        },
      );
      doc.moveDown();

      title();
      doc.text(`Factura o nota de debito (${data.bills.length})`);
      if (data.bills.length > 0) {
        doc.table(
          {
            headers: ['N° de Factura', 'Monto', 'Fecha', 'Observaciones'],
            rows: data.bills.map((bill) => [
              bill.number,
              bill.amount,
              this.tranformDate(bill.date),
              bill.observation,
            ]),
          },
          {
            columnSize: [100, 50, 50, 200],
          },
        );
      }
      doc.moveDown();

      title();
      doc.text(`Cheques (${data.checks.length})`);
      if (data.checks.length > 0) {
        doc.table(
          {
            headers: [
              'Tipo',
              'N° de Cheque',
              'Banco',
              'Monto',
              'Fecha',
              'Observaciones',
              'Adjunto',
            ],
            rows: data.checks.map((check) => [
              traductions[check.type],
              check.document_number,
              check.bank_name || '',
              check.amount,
              this.tranformDate(check.date),
              check.observation,
              check.file ? 'Si' : 'No',
            ]),
          },
          {
            columnSize: [50, 100, 50, 50, 50, 200, 50],
          },
        );
      }
      doc.moveDown();

      title();
      doc.text(`Efectivo (${data.cash.length})`);
      if (data.cash.length > 0) {
        doc.table(
          {
            headers: [
              'N° de Comprobante',
              'Monto',
              'Fecha',
              'Observación',
              'Adjunto',
            ],
            rows: data.cash.map((cash) => [
              cash.document_number,
              cash.amount,
              this.tranformDate(cash.date),
              cash.observation,
              cash.file ? 'Si' : 'No',
            ]),
          },
          {
            columnSize: [100, 50, 50, 200, 50],
          },
        );
      }
      doc.moveDown();

      title();
      doc.text(`Deposito / Transferencia (${data.deposits.length})`);
      if (data.deposits.length > 0) {
        doc.table(
          {
            headers: [
              'N° de Comprobante',
              'Banco',
              'Monto',
              'Fecha',
              'Observaciones',
              'Adjunto',
            ],
            rows: data.deposits.map((deposit) => [
              deposit.document_number,
              deposit.bank_name || '',
              deposit.amount,
              this.tranformDate(deposit.date),
              deposit.observation,
              deposit.file ? 'Si' : 'No',
            ]),
          },
          {
            columnSize: [100, 50, 50, 50, 200, 50],
          },
        );
      }
      doc.moveDown();

      title();
      doc.text(`Solicitud de crédito (${data.credits.length})`);
      if (data.credits.length > 0) {
        doc.table(
          {
            headers: ['Tipo', 'Monto', 'Fecha', 'Observaciones'],
            rows: data.credits.map((credit) => [
              traductions[credit.type],
              credit.amount,
              this.tranformDate(credit.date),
              credit.observation,
            ]),
          },
          {
            columnSize: [100, 50, 50, 200],
          },
        );
      }
      doc.moveDown();

      title();
      doc.text(`NC o saldo recibido (${data.credit_notes.length})`);
      if (data.credit_notes.length > 0) {
        doc.table(
          {
            headers: ['Monto', 'Fecha', 'Porcentaje %', 'Observaciones'],
            rows: data.credit_notes.map((creditNote) => [
              creditNote.amount,
              this.tranformDate(creditNote.date),
              creditNote.porcentage,
              creditNote.observation,
            ]),
          },
          {
            columnSize: [50, 50, 200],
          },
        );
      }
      doc.moveDown();

      title();
      doc.text(`Retencion impositiva (${data.retentions.length})`);
      if (data.retentions.length > 0) {
        doc.table(
          {
            headers: ['Monto', 'Fecha', 'Observaciones', 'Adjunto'],
            rows: data.retentions.map((retention) => [
              retention.amount,
              this.tranformDate(retention.date),
              retention.observation,
              retention.file ? 'Si' : 'No',
            ]),
          },
          {
            columnSize: [50, 50, 200, 50],
          },
        );
      }

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
