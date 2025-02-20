import { SetMetadata } from '@nestjs/common';

export const USE_MANAGER_TOKEN_METADATA = 'use-manager-token';

export const UseManagerToken = () =>
  SetMetadata(USE_MANAGER_TOKEN_METADATA, true);
