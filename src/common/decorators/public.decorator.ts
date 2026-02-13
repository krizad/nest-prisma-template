import { SetMetadata } from '@nestjs/common';
import { appConstants } from '../constant/app.constants';

export const Public = () => SetMetadata(appConstants.IS_PUBLIC_KEY, true);
