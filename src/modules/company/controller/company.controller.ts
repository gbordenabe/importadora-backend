import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyService } from '../services/company.service';
import { Company } from '../entities/company.entity';
import {
  ApiBadRequestResponseImplementation,
  ApiCreatedResponseImplementation,
  ApiForbiddenResponseImplementation,
  ApiNotFoundImplementation,
  ApiOkResponseImplementation,
  ApiUnauthorizedResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAndCountCompaniesDto } from '../dto/find-and-count-companies.dto';
import { FindAllCompaniesQueryDto } from '../dto/find-all-companies-query.dto';

@ApiTags('Company')
@ApiUnauthorizedResponseImplementation()
@ApiBearerAuth()
@ApiBadRequestResponseImplementation()
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({
    summary: 'Get all companies',
    description: `Obtaining array companies`,
  })
  @ApiOkResponseImplementation({
    type: FindAndCountCompaniesDto,
  })
  @Get()
  async findAll(@Query() queryParams: FindAllCompaniesQueryDto) {
    return await this.companyService.findAll(queryParams);
  }

  @ApiCreatedResponseImplementation(Company)
  @ApiOperation({
    summary: 'Create company',
    description: `Obtaining company created`,
  })
  @ApiForbiddenResponseImplementation()
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(createCompanyDto);
  }

  @ApiOkResponseImplementation({ type: Company })
  @ApiOperation({
    summary: 'Get company by id',
    description: `Obtaining company by id`,
  })
  @ApiNotFoundImplementation()
  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number): Promise<Company> {
    return this.companyService.findOneById({ id });
  }

  @ApiOkResponseImplementation({ type: Company })
  @ApiOperation({
    summary: 'Update company by id',
    description: `Updated company by id`,
  })
  @ApiForbiddenResponseImplementation()
  @ApiNotFoundImplementation()
  @Patch(':id')
  updateOneById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companyService.updateOneById(id, updateCompanyDto);
  }

  @ApiOkResponseImplementation()
  @ApiOperation({
    summary: 'Delete company by id',
    description: `deleted company by id`,
  })
  @ApiForbiddenResponseImplementation()
  @ApiNotFoundImplementation()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.companyService.removeOneById(id);
  }
}
