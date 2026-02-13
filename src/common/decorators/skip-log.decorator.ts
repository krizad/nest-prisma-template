import { SetMetadata } from '@nestjs/common';

export const SKIP_LOG_KEY = 'skipLog';
export const SkipLog = () => SetMetadata(SKIP_LOG_KEY, true);
