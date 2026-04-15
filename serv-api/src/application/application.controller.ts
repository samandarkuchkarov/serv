import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RecaptchaGuard } from './guards/recaptcha.guard';
import { ApplicationService } from './application.service';
import { SubmitApplicationDto } from './dto/submit-application.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Throttle({ default: { ttl: 60000, limit: 10 } }) // 10 submissions per minute
  @Post('submit')
  @UseGuards(RecaptchaGuard)
  submit(@Body() dto: SubmitApplicationDto) {
    return this.applicationService.sendToBitrix(dto.bitrix);
  }
}
