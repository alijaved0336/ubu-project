import { Products } from '@infrastructure/orm/entities/product.entity';
import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { CategoryRepository } from '@infrastructure/orm/reposiories/category.repository';
import { GenderRepository } from '@infrastructure/orm/reposiories/gender.repository';
import { ProductSizeRepository } from '@infrastructure/orm/reposiories/product-size.repository';
import { ProductRepository } from '@infrastructure/orm/reposiories/product.repository';
import { SizeRepository } from '@infrastructure/orm/reposiories/size.repository';
import { StyleRepository } from '@infrastructure/orm/reposiories/style.repository';
import { SubCategoryRepository } from '@infrastructure/orm/reposiories/sub-category.repository';
import { CreateProductDto, MediaDto, MediaDtoWithLocationIndex, UpdateProductDto } from '@infrastructure/presentation/product/product.dto';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

export class ProductUsecase {
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
  async findAll(userId: number, page: number, limit: number, search?: string) {
    const brand = await this.brandRepository.findByUserId(userId);
    if (!brand) throw new NotFoundException('Brand not found');
    return this.productRepository.findAll(brand.id, page, limit, search);
  }

  async findOne(id: number): Promise<Products | any> {
    const product = await this.productRepository.findByIdWithRelation(+id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto, files: Express.Multer.File[], userId: number) {
    const { gender_id, category_id, sub_category_id, style_id, measurement, ...payload } = createProductDto;

    const brand = await this.brandRepository.findByUserId(userId);
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

    payloadNew.category = category;
    payloadNew.sub_category = subCategory;
    payloadNew.styles = style;
    payloadNew.genders = gender;
    payloadNew.brand = brand;

    let savedProduct = await this.productRepository.create(payloadNew);

    if (files) {
      const folderName = `products_new/${savedProduct.id}`;
      await this.awsService.createFolder(folderName);
      const s3Response = await this.awsService.uploadMultipleFiles(files, folderName);
      savedProduct.media = s3Response;
    }

    savedProduct = await this.productRepository.saveProduct(savedProduct);

    if (measurement && measurement.length > 0) {
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

  async update(id: number, updateProductDto: UpdateProductDto, fileRecords: Express.Multer.File[]): Promise<Products | any> {
    const { gender_id, category_id, sub_category_id, style_id, measurement, files, urls, ...payload } = updateProductDto;

    const product = await this.productRepository.findById(id);
    const category = await this.categoryRepositoy.findById(category_id);
    if (!category) throw new NotFoundException('Category not found');
    const subCategory = await this.subCategoryRepositoy.findById(sub_category_id);
    if (!subCategory) throw new NotFoundException('Sub-Category not found');
    const style = await this.styleRepository.findById(style_id);
    if (!style) throw new NotFoundException('Style not found');
    const gender = await this.genderRepository.findById(gender_id);
    if (!gender) throw new NotFoundException('Gender not found');

    const payloadNew: Partial<Products> = payload;
    const folderName = `products_new/${id}`;
    if (fileRecords && fileRecords.length > 0) {
      let s3Response: MediaDto[] = [];
      if (fileRecords.length > 0) {
        // first Delete already Uploaded Files With Same Names
        await this.awsService.deleteConflictingFilesInFolder(folderName, fileRecords);
        // Upload the Files
        s3Response = await this.awsService.uploadMultipleFiles(fileRecords, folderName);
        payloadNew.media = s3Response;
      }
      let urlData: MediaDto[] = [];
      if (urls && urls.length > 0) {
        urlData = await this.getUrlsInMediaDto(urls);
        urlData = await this.mergeUrlData(urlData, s3Response);
        // Delete Those Files That User has crossed from frontend
        await this.awsService.deleteUnwantedUploadedFiles(folderName, urlData);
        payloadNew.media = urlData;
      } else {
        if (!s3Response.length) {
          // If the User has crossed all the images from frontend and has not uploaded any new image then
          // delete all the uploaded files and reset the media
          await this.awsService.deleteAllFilesInFolder(folderName);
          payloadNew.media = [];
        }
      }
    }

    payloadNew.category = category;
    payloadNew.sub_category = subCategory;
    payloadNew.styles = style;
    payloadNew.genders = gender;

    const isUpdated = await this.productRepository.update(id, payloadNew);

    if (isUpdated.affected == 1) {
      const savedProduct = await this.productRepository.findByIdWithRelation(id);
      if (savedProduct) {
        if (measurement && measurement.length > 0) {
          await this.productSizeRepository.deleteByProductId(savedProduct.id);
          const productSizes = await measurement.map(async (data) => {
            let size = await this.sizeRepository.findById(data.size);
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
      } else {
        throw new Error('Could not update Product');
      }
    } else {
      throw new Error('Could not update Product');
    }
  }

  async remove(id: number): Promise<void | any> {
    return this.productRepository.delete(id);
  }

  async getProductsByBrand(brandId: number) {
    return await this.brandRepository.brandProducts(brandId);
  }

  async getUrlsInMediaDto(urls: any): Promise<MediaDto[]> {
    return await urls.map((data) => {
      const mediaDto = new MediaDtoWithLocationIndex();
      mediaDto.url = data.url;
      mediaDto.extension = data.extension;
      mediaDto.type = data.type;
      mediaDto.size = data.size ?? 0;
      mediaDto.locationIndex = data.locationIndex;
      return mediaDto;
    });
  }

  async mergeUrlData(urlData: (MediaDto | MediaDtoWithLocationIndex)[], s3Response: MediaDto[]): Promise<MediaDtoWithLocationIndex[]> {
    if (!urlData.length) {
      return s3Response.map((item, index) => ({
        ...item,
        locationIndex: index.toString(),
      }));
    }

    const mergedData: MediaDtoWithLocationIndex[] = [];
    let s3Index = 0;

    const firstItem = urlData[0] as MediaDtoWithLocationIndex;
    const firstIndex = firstItem.locationIndex ? parseInt(firstItem.locationIndex) : 0;

    while (s3Index < s3Response.length && s3Index < firstIndex) {
      mergedData.push({
        ...s3Response[s3Index],
        locationIndex: s3Index.toString(),
      });
      s3Index++;
    }

    for (let i = 0; i < urlData.length; i++) {
      const currentItem = urlData[i] as MediaDtoWithLocationIndex;
      const currentIndex = currentItem.locationIndex ? parseInt(currentItem.locationIndex) : i;

      mergedData.push({
        ...currentItem,
        locationIndex: currentIndex.toString(),
      });

      if (i < urlData.length - 1) {
        const nextItem = urlData[i + 1] as MediaDtoWithLocationIndex;
        const nextIndex = nextItem.locationIndex ? parseInt(nextItem.locationIndex) : currentIndex + 1;

        // If the gap is greater than 1, add missing items from s3Response
        let gapSize = nextIndex - currentIndex - 1;
        while (s3Index < s3Response.length && gapSize > 0) {
          const newIndex = (currentIndex + 1).toString();
          mergedData.push({ ...s3Response[s3Index], locationIndex: newIndex });
          s3Index++;
          gapSize--;
        }
      }
    }

    // Append remaining items from s3Response
    while (s3Index < s3Response.length) {
      const lastIndex = mergedData.length ? parseInt(mergedData[mergedData.length - 1].locationIndex) : 0;
      const newIndex = (lastIndex + 1).toString();
      mergedData.push({ ...s3Response[s3Index], locationIndex: newIndex });
      s3Index++;
    }
    return mergedData;
  }
}
