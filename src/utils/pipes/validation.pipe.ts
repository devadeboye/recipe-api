import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { ObjectSchema, ArraySchema, StringSchema } from 'joi';

@Injectable()
export class JoiObjectValidationPipe implements PipeTransform {
  public constructor(private readonly schema: ObjectSchema) {}
  public async transform(data: Record<string, unknown>): Promise<unknown> {
    try {
      const value = await this.schema
        .unknown(false)
        .validateAsync(data, { stripUnknown: true });
      return value;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}

@Injectable()
export class JoiArrayValidationPipe implements PipeTransform {
  public constructor(private readonly schema: ArraySchema) {}
  public async transform(data: Array<unknown>): Promise<unknown[]> {
    try {
      const value = await this.schema.validateAsync(data, {
        stripUnknown: true,
      });
      return value;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}

@Injectable()
export class JoiStringValidationPipe implements PipeTransform {
  public constructor(private readonly schema: StringSchema) {}

  public async transform(data: unknown): Promise<string> {
    try {
      const value = await this.schema.validateAsync(data, {
        stripUnknown: true,
      });
      return value;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
