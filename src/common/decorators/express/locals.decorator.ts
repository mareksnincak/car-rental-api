import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Locals = createParamDecorator(
  (name: string, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    return response.locals[name];
  },
);
