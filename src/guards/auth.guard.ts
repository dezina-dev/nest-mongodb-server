import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return false;
    }

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      // Attach the user data to the request for later use if needed
      request.user = decodedToken;
      return true;
    } catch (error) {
      return false; // Invalid token
    }
  }
}
