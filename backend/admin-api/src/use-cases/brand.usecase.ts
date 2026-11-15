import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';

export class BrandUsecase {
  constructor(private brandRepository: BrandRepository) {}

  async create(payload) {
    return await this.brandRepository.create(payload);
  }

  async findOne(id) {
    return await this.brandRepository.findOne(id);
  }

  async findAllWithAnswers(page: number, limit: number, search?: string) {
    const questionMap = { 16: 'Followers', 17: 'Region', 21: 'Category' };
    const brandWithAnswers = await this.brandRepository.findAllWithAnswers(page, limit, search);
    const result = await Promise.all(
      brandWithAnswers.brands.map(async (brand) => {
        let user = brand.user;
        if (user) {
          const userAnswersMap: Record<string, any> = {};
          user.user_answer?.forEach((answer) => {
            const questionName = questionMap[answer?.question?.id];

            if (questionName) {
              userAnswersMap[questionName] = answer?.selected_options;
            }
          });
          let newUser = await this.giveUserResponse(user);

          return {
            ...brand,
            user: {
              ...newUser,
              user_answer: userAnswersMap,
            },
          };
        }
      }),
    );

    return { result, total: brandWithAnswers.total };
  }

  async giveUserResponse(user) {
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      avatar: user.brand.avatar,
      isAdmin: user.is_admin,
    };
  }

  async getFilteredData(payload) {
    const questionMap = { 16: 'Followers', 17: 'Region', 21: 'Category' };

    const brandWithAnswers = await this.brandRepository.findFilteredWithAnswers(payload);
    const result = await Promise.all(
      brandWithAnswers.map(async (brand) => {
        let user = brand.user;
        const userAnswersMap: Record<string, any> = {};
        user.user_answer.forEach((answer) => {
          const questionName = questionMap[answer.question?.id];

          if (questionName) {
            userAnswersMap[questionName] = answer.selected_options;
          }
        });
        let newUser = await this.giveUserResponse(user);

        return {
          ...brand,
          user: {
            ...newUser,
            user_answer: userAnswersMap,
          },
        };
      }),
    );

    return result;
  }
}
