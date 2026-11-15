import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { CategoryRepository } from '@infrastructure/orm/reposiories/category.repository';
import { GenderRepository } from '@infrastructure/orm/reposiories/gender.repository';
import { ProductSizeRepository } from '@infrastructure/orm/reposiories/product-size.repository';
import { ProductRepository } from '@infrastructure/orm/reposiories/product.repository';
import { SizeRepository } from '@infrastructure/orm/reposiories/size.repository';
import { StyleRepository } from '@infrastructure/orm/reposiories/style.repository';
import { SubCategoryRepository } from '@infrastructure/orm/reposiories/sub-category.repository';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { ProductUsecase } from '@use-cases/product.usecase';
import UsecaseProxy, { PRODUCT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function ProductUsecaseProvider() {
  return {
    inject: [
      ProductRepository,
      AwsS3Service,
      BrandRepository,
      ProductSizeRepository,
      CategoryRepository,
      SubCategoryRepository,
      StyleRepository,
      GenderRepository,
      SizeRepository,
    ],
    provide: PRODUCT_USECASE_PROXY,
    useFactory: (
      productRepository: ProductRepository,
      awsService: AwsS3Service,
      brandRepository: BrandRepository,
      productSizeRepository: ProductSizeRepository,
      categoryRepository: CategoryRepository,
      subCategoryRepositoy: SubCategoryRepository,
      styleRepository: StyleRepository,
      genderRepository: GenderRepository,
      sizeRepository: SizeRepository,
    ) =>
      new UsecaseProxy(
        new ProductUsecase(
          productRepository,
          awsService,
          brandRepository,
          productSizeRepository,
          categoryRepository,
          subCategoryRepositoy,
          styleRepository,
          genderRepository,
          sizeRepository,
        ),
      ),
  };
}
