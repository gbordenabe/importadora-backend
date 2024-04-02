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
  Head,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-usuario.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiBadRequestResponseImplementation,
  ApiCreatedResponseImplementation,
  ApiForbiddenResponseImplementation,
  ApiNotFoundImplementation,
  ApiOkResponseImplementation,
  ApiUnauthorizedResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { User } from './entities/user.entity';
import { Auth, GetUser } from 'src/auth/decorators';
import { FindAndCountUsersDto } from './dto/find-and-count-users.dto';
import { FindAllUsersQueryDto } from './dto/find-all-users-query.dto';
import { ROLE_NAME_ENUM } from '../role/entities/role_name.enum';
@ApiTags('User')
@ApiUnauthorizedResponseImplementation()
@ApiBadRequestResponseImplementation()
@ApiBearerAuth()
@Controller('user')
export class UsuariosController {
  constructor(private readonly userService: UserService) {}

  //solicitar verificacion de correo
  @ApiOkResponseImplementation()
  @Auth()
  @Get('request-email-verification')
  async requestEmailVerification(@GetUser() user: User) {
    return await this.userService.sendPersonalEmailVerificationCode(user.email);
  }

  @ApiOkResponseImplementation()
  @ApiNotFoundImplementation()
  @Head('verify-email/:code')
  async verifyEmail(@Param('code') code: string) {
    await this.userService.verifyEmail(code);
  }

  @ApiCreatedResponseImplementation(User)
  @ApiForbiddenResponseImplementation()
  @Post()
  create(@Body() createUsuarioDto: CreateUserDto) {
    return this.userService.create(createUsuarioDto);
  }

  @ApiOkResponseImplementation({
    type: FindAndCountUsersDto,
  })
  @ApiForbiddenResponseImplementation()
  @Get()
  findAll(@Query() queryParams: FindAllUsersQueryDto) {
    return this.userService.findAll(queryParams);
  }

  //get my perfil
  @ApiOkResponseImplementation({ type: User })
  @Auth()
  @Get('my-profile')
  getMyProfile(@GetUser('id') userId: number) {
    return this.userService.findOneById({ id: userId });
  }

  @ApiOkResponseImplementation({ type: User })
  @ApiForbiddenResponseImplementation()
  @ApiNotFoundImplementation()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneById({ id });
  }

  //update my perfil
  @ApiOkResponseImplementation({ type: User })
  @Auth()
  @Patch('my-profile')
  updateMyProfile(
    @GetUser('id') userId: number,
    @Body() dto: UpdateMyProfileDto,
  ) {
    return this.userService.updateOneById(userId, dto);
  }

  @ApiOkResponseImplementation({ type: User })
  @ApiForbiddenResponseImplementation()
  @ApiNotFoundImplementation()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUserDto,
  ) {
    return this.userService.updateOneById(id, updateUsuarioDto);
  }

  @ApiOkResponseImplementation({ type: User })
  @ApiForbiddenResponseImplementation()
  @ApiNotFoundImplementation()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeOneById(id);
  }
}
