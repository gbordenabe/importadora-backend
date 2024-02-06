import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';

export class LoginResponseDto {
  @ApiProperty({ type: () => User })
  user: User;
  @ApiProperty()
  jwt: string;
}
