import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Encrypter } from 'src/common/utilities/encrypter';
import { ROLES_DATA } from 'src/modules/role/data/roles.data';
import { Role } from 'src/modules/role/entities/role.entity';
import { ROLE_NAME_ENUM } from 'src/modules/role/entities/role_name.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    await Promise.allSettled(
      ROLES_DATA.map((role) => this.roleRepository.save(role)),
    );
    await this.createAdminUser();
  }
  getConnection() {
    return this.dataSource;
  }
  async createAdminUser() {
    const user_name = process.env.FIRST_USER_USERNAME;
    const user = await this.userRepository.findOneBy({ user_name });
    if (!user) {
      const password = process.env.FIRST_USER_PASSWORD;
      console.log('Creating first user');
      console.log('user_name: ', user_name);
      console.log('password: ', password);
      await this.userRepository.save({
        user_name,
        password: Encrypter.encrypt(password),
        role: await this.roleRepository.findOneBy({
          name: ROLE_NAME_ENUM.TREASURER,
        }),
        name: 'Admin',
        last_name: 'Admin',
      });
    }
  }
}
