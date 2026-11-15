// src/modules/subscription/decorators/requires-plan.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const RequiresPlan = (...plans: string[]) => SetMetadata('plans', plans);
