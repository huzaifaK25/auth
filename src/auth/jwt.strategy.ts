import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // tells passport how to extract JWT (from header here)
      ignoreExpiration: false, // tells passport to check expiration of JWT
      secretOrKey: jwtConstants.secret, // secret key used to verify JWT is from our server
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
