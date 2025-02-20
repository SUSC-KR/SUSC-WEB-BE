import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AppConfig } from 'src/config';
import { USE_MANAGER_TOKEN_METADATA } from './use-manager-token';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKeyHeader = request.header('x-api-key');

    if (!apiKeyHeader) {
      return false;
    }

    if (this.needCheckManagerToken(context)) {
      return this.checkManagerToken(apiKeyHeader);
    } else {
      return this.checkDefaultApiKey(apiKeyHeader);
    }
  }

  private checkDefaultApiKey(apiKeyHeader: string): boolean {
    const apiKey = this.configService.get<AppConfig['apiKey']>('apiKey');

    if (!apiKey) {
      return true;
    }

    return apiKey === apiKeyHeader;
  }

  private checkManagerToken(apiKeyHeader: string): boolean {
    const managerToken =
      this.configService.get<AppConfig['managerToken']>('managerToken');

    if (!managerToken) {
      return true;
    }

    return managerToken === apiKeyHeader;
  }

  private needCheckManagerToken(context: ExecutionContext): boolean {
    return !!Reflect.getMetadata(
      USE_MANAGER_TOKEN_METADATA,
      context.getHandler(),
    );
  }
}
