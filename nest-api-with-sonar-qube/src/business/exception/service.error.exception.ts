import { InternalServerErrorException } from '@nestjs/common';

export class ServiceErrorException extends InternalServerErrorException {
  constructor(operation: string) {
    super(
      `Due to an internal error, the operation '${operation}' could not be performed at this time. Please try again later.`,
    );
  }
}
