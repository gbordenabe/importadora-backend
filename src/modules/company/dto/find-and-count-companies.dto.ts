import { IFindAndCountResult } from 'src/common/interfaces/service.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';

export class FindAndCountCompaniesDto implements IFindAndCountResult<Company> {
  @ApiProperty({ type: () => [Company] })
  data: Company[];
  @ApiProperty()
  count: number;
}
