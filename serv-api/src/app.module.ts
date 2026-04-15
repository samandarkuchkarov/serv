import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BannerModule } from './banner/banner.module';
import { AdvantageModule } from './advantage/advantage.module';
import { ConstructorModule } from './constructor/constructor.module';
import { EquipmentModule } from './equipment/equipment.module';
import { VacancyModule } from './vacancy/vacancy.module';
import { ServiceModule } from './service/service.module';
import { PartnerModule } from './partner/partner.module';
import { ApplicationModule } from './application/application.module';
import { HttpLoggerMiddleware } from './common/logger/http-logger.middleware';
import { AllExceptionsFilter } from './common/logger/all-exceptions.filter';
import { winstonConfig } from './common/logger/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true, ttl: 300000 }),
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60000, limit: 150 },
      { name: 'auth', ttl: 60000, limit: 100 },
    ]),
    WinstonModule.forRoot(winstonConfig),
    AuthModule,
    BannerModule,
    AdvantageModule,
    ConstructorModule,
    EquipmentModule,
    VacancyModule,
    ServiceModule,
    PartnerModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
