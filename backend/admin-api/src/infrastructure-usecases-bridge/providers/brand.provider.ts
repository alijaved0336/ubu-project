import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { BrandUsecase } from '@use-cases/brand.usecase';
import UsecaseProxy, { BRAND_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function BrandUsecaseProvider() {
  return {
    inject: [BrandRepository],
    provide: BRAND_USECASE_PROXY,
    useFactory: (brandRepository: BrandRepository) => new UsecaseProxy(new BrandUsecase(brandRepository)),
  };
}
