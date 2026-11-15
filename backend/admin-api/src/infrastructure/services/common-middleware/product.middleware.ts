import { ProductRepository } from '@infrastructure/orm/reposiories/product.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { ProductSizeRepository } from '@infrastructure/orm/reposiories/product-size.repository';
import { CategoryRepository } from '@infrastructure/orm/reposiories/category.repository';
import { SubCategoryRepository } from '@infrastructure/orm/reposiories/sub-category.repository';
import { StyleRepository } from '@infrastructure/orm/reposiories/style.repository';
import { GenderRepository } from '@infrastructure/orm/reposiories/gender.repository';
import { SizeRepository } from '@infrastructure/orm/reposiories/size.repository';
import { CreateProductDto } from '@infrastructure/presentation/product/product.dto';
import { Products } from '@infrastructure/orm/entities/product.entity';

@Injectable()
export class ProductMiddleware {
  constructor(
    private productRepository: ProductRepository,
    private awsService: AwsS3Service,
    private brandRepository: BrandRepository,
    private productSizeRepository: ProductSizeRepository,
    private categoryRepositoy: CategoryRepository,
    private subCategoryRepositoy: SubCategoryRepository,
    private styleRepository: StyleRepository,
    private genderRepository: GenderRepository,
    private sizeRepository: SizeRepository,
  ) {}
  async create(createProductDto: CreateProductDto, files: Express.Multer.File[], userId: number, productMedia: any) {
    const { gender_id, category_id, sub_category_id, style_id, measurement, productLink, ...payload } = createProductDto;

    const brand = await this.brandRepository.findOne(userId);
    if (!brand) throw new NotFoundException('Brand not found');
    const category = await this.categoryRepositoy.findById(category_id);
    if (!category) throw new NotFoundException('Category not found');
    const subCategory = await this.subCategoryRepositoy.findById(sub_category_id);
    if (!subCategory) throw new NotFoundException('Sub-Category not found');
    const style = await this.styleRepository.findById(style_id);
    if (!style) throw new NotFoundException('Style not found');
    const gender = await this.genderRepository.findById(gender_id);
    if (!gender) throw new NotFoundException('Gender not found');
    const payloadNew: Partial<Products> = payload;

    if (productMedia) {
      payloadNew.media = productMedia;
    }

    if (files && files.length > 0) {
      const folderName = 'products_new';
      await this.awsService.createFolder(folderName);
      const s3Response = await this.awsService.uploadMultipleFiles(files, folderName);
      payloadNew.media = s3Response;
    }

    payloadNew.category = category;
    payloadNew.sub_category = subCategory;
    payloadNew.styles = style;
    payloadNew.genders = gender;
    payloadNew.brand = brand;
    payloadNew.productLink = productLink;

    const savedProduct = await this.productRepository.create(payloadNew);

    if (measurement.length > 0) {
      const postProducts = await measurement.map(async (data) => {
        let size = await this.sizeRepository.findById(data['size']);
        if (!size) {
          throw new NotFoundException('One or more size not found');
        } else {
          return await this.productSizeRepository.create({
            size: size,
            product: savedProduct,
            dimensions: data.dimensions,
            active: data.active,
          });
        }
      });
    }

    return savedProduct;
  }

  async update(id, payload) {
    return await this.productRepository.update(id, { colors: payload });
  }
}
