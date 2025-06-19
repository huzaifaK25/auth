import { Module } from '@nestjs/common';
import { UsersModule } from '../modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsModule } from 'src/modules/appointments/appointments.module';

@Module({
  imports: [
    // imports config module into root 
    ConfigModule.forRoot({
      // allows to explicitly define file path for env file
      envFilePath: '.env'
    }),
    // database configuration
    TypeOrmModule.forRootAsync({
      // uses config module for credentials and setup
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        //entities: [User],
        autoLoadEntities: true,
        synchronize: true
      })
    }),
    UsersModule, AppointmentsModule],
  controllers: [],
  providers: []
})
export class AppModule {}
