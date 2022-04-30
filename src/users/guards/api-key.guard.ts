import { Request, Response } from 'express';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UnauthorizedAppException } from '@src/common/exceptions/unauthorized.exception';
import { UserRepository } from '@src/db/repositories/user.repository';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.get('Api-Key');

    if (!apiKey) {
      throw new UnauthorizedAppException('Missing api key');
    }

    const user = await this.userRepository.findByApiKey(apiKey);

    if (!user) {
      throw new UnauthorizedAppException('Invalid api key');
    }

    const response: Response = context.switchToHttp().getResponse();
    response.locals.user = user;

    return true;
  }
}
