import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
  Param,
  Head,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiNotFoundImplementation,
  ApiOkResponseImplementation,
  ApiUnauthorizedResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshTokenDto } from './dto/refres-token.dto';
import { RecoverPasswordByEmailDto } from './dto/recover-password-by-email.dto';
import { Auth } from './decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponseImplementation({ type: LoginResponseDto })
  @ApiUnauthorizedResponseImplementation()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async loginUser(@Body() loginDto: LoginUserDto) {
    return await this.authService.login(loginDto);
  }

  @ApiOkResponseImplementation({ type: RefreshTokenDto })
  @ApiUnauthorizedResponseImplementation()
  @Auth()
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refresToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto.jwt);
  }

  @ApiOperation({
    summary: 'Solictar recuperación de contraseña',
    description:
      'Se envia un email un link al email que apuntara al http.frontendhost.com/recove-password?code=codeExample&email=emailExample. Atrapar el codigo y el email del query params y enviarlo al endpoint + la contraseña nueva /recover-pass-by-email',
  })
  @ApiNotFoundImplementation()
  @ApiOkResponseImplementation()
  @Get('pass-recovery-req/:email')
  async passwordRecoveryRequest(@Param('email') email: string) {
    await this.authService.requestPasswordRecovery(email);
  }

  @ApiOkResponseImplementation()
  @ApiNotFoundImplementation()
  @Head('check-code-and-email/:code/:email')
  async checkCodeAndEmail(
    @Param('code') code: string,
    @Param('email') email: string,
  ) {
    await this.authService.checkCodeAndEmail(code, email);
  }

  @ApiOperation({
    summary: 'Recuperar contraseña por email, despues de solicitarla',
  })
  @ApiNotFoundImplementation()
  @ApiOkResponseImplementation()
  @ApiUnauthorizedResponseImplementation()
  @HttpCode(HttpStatus.OK)
  @Post('recover-pass-by-email')
  async recoverPasswordByEmail(
    @Body() recoverPassByEmail: RecoverPasswordByEmailDto,
  ) {
    await this.authService.recoverPasswordByEmail(recoverPassByEmail);
  }
}
