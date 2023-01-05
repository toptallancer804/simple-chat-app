import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigurationService } from '../config/configuration.service';

interface jwtPayload {
  email: string;
  sub: string;
}

interface jwtResponse {
  userId: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigurationService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies?.access_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.authConfig.secret,
    });
  }

  async validate(payload: jwtPayload): Promise<jwtResponse> {
    // console.log('jwt.strategy.ts: validate() payload: ', payload);
    // If you want to add more info to req.user object, you can do it here (e.g. access DB).
    return { userId: payload.sub, email: payload.email };
  }
}
