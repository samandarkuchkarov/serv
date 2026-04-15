import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) return true; // skip entirely if not configured

    const token: string | undefined = request.body?.recaptcha;
    if (!token) {
      throw new HttpException('Captcha failed', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    try {
      const { data } = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        { params: { secret, response: token } },
      );
      if (!data.success) {
        throw new HttpException('Captcha failed', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      return true;
    } catch (err: any) {
      if (err instanceof HttpException) throw err;
      throw new HttpException('Captcha failed', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
