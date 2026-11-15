import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { UserType } from '@infrastructure/orm/entities/questionnaire.entity';

export async function getUserAgeAndType(userRepository: UserRepository, userId: number) {
    const getUser = await userRepository.findById(userId);
    const birthDate = new Date(getUser?.dob ?? new Date());
    const today = new Date();
  
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
  
    const isBeforeBirthday = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0);
    const isAdult = isBeforeBirthday ? age - 1 >= 18 : age >= 18;
  
    let userType = UserType.CONSUMER;
    if (!isAdult && getUser?.dob) {
      userType = UserType.MINORCONSUMER;
    }
  
    return {
      getUser,
      age: isBeforeBirthday ? age - 1 : age,
      isAdult,
      userType
    };
  }