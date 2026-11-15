import { Questionnaires, UserType } from "@infrastructure/orm/entities/questionnaire.entity";
import { QuestionnaireRepository } from "@infrastructure/orm/reposiories/questionnaire.repository";
import { Injectable, Logger } from "@nestjs/common";
import { Command } from "nestjs-command";

@Injectable()
export class SeedCommandService {
  logger = new Logger(SeedCommandService.name)

  constructor(
    private readonly questionnaireRepository: QuestionnaireRepository
  ) { }

  @Command({
    command: 'populate-questionnaire',
    describe: 'populating questionnaires',
  })
  async populate() {
    const questions = [
      // {
      //   title: 'Age',
      //   options: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65 and over'],
      //   user_type: UserType.CONSUMER,
      //   is_optional: true,
      //   is_multi_selected: false,
      //   selection_limit: 1,
      //   sr_no: 1
      // },
      {
        title: 'Gender',
        options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
        user_type: UserType.CONSUMER,
        is_optional: true,
        is_multi_selected: false,
        selection_limit: 1,
        sr_no: 2
      },
      {
        title: 'Ethnicity',
        options: ['Caucasian', 'African American', 'Hispanic or Latino', 'Asian',
          'Native American', 'Pacific Islander', 'Middle Eastern', 'Mixed Race', 'Other', 'Prefer not to say'],
        user_type: UserType.CONSUMER,
        is_optional: true,
        is_multi_selected: true,
        selection_limit: 0,
        sr_no: 3
      },
      {
        title: 'Languages',
        description: 'Choose all that you speak, feel connected to, or would like to see profiles from',
        options: ['English', 'Spanish', 'Mandarin', 'French', 'German', 'Italian', 'Japanese', 'Korean', 'Urdu', 'Hindi', 'Standard Arabic', 'Bengali', 'Portuguese', 'Russian', 'Other'],
        user_type: UserType.CONSUMER,
        is_optional: true,
        is_multi_selected: true,
        selection_limit: 0,
        sr_no: 4
      },
      // {
      //   title: 'Height',
      //   options: [
      //     "Under 5'0'' - 5'4''",
      //     "5'0'' - 5'4''",
      //     "5'5'' - 5'9''",
      //     "5'10'' - 6'0''",
      //     "6'0'' - 6'2''",
      //     "6'3'' - over"
      //   ],
      //   user_type: UserType.CONSUMER,
      //   is_optional: true,
      //   is_multi_selected: false,
      //   selection_limit: 1,
      //   sr_no: 5
      // },
      // {
      //   title: 'Weight Ranges',
      //   options: [
      //     "Under 100 lbs (Under 45 kg)",
      //     "100-120 lbs (45-54 kg)",
      //     "121-140 lbs (55-63 kg)",
      //     "141-160 lbs (64-72 kg)",
      //     "161-180 lbs (73-81 kg)",
      //     "181-200 lbs (82-90 kg)",
      //     "201-220 lbs (91-99 kg)",
      //     "221-240 lbs (100-108 kg)",
      //     "241-260 lbs (109-117 kg)",
      //     "261-280 lbs (118-127 kg)",
      //     "281-300 lbs (128-136 kg)",
      //     "Over 300 lbs (Over 136 kg)",
      //     "Prefer not to say"
      //   ],
      //   user_type: UserType.CONSUMER,
      //   is_optional: true,
      //   is_multi_selected: false,
      //   selection_limit: 1,
      //   sr_no: 6
      // },
      {
        title: 'Hair Color',
        options: ['Blonde', 'Brunette', 'Black', 'Red', 'Grey', 'Bald', 'Dyed (e.g., blue, pink, green)'],
        user_type: UserType.CONSUMER,
        is_optional: true,
        is_multi_selected: false,
        selection_limit: 1,
        sr_no: 7
      },
      {
        title: 'Eye Color',
        options: ['Blue', 'Green', 'Brown', 'Hazel', 'Grey', 'Amber'],
        user_type: UserType.CONSUMER,
        is_optional: true,
        is_multi_selected: false,
        selection_limit: 1,
        sr_no: 8
      },
      {
        title: 'Skin Shade',
        options: ['Fair', 'Light', 'Medium', 'Olive', 'Tan', 'Dark'],
        user_type: UserType.CONSUMER,
        is_optional: true,
        is_multi_selected: true,
        selection_limit: 0,
        sr_no: 9
      },
      {
        title: 'Body Type',
        options: ['🍏 Apple', '🍐 Pear', '⏳ Hourglass', '🔺 Inverted Triangle', '▭ Rectangle-shaped', '🦒 Long Torso', '🐢 Short Torso', '🦵 Long Legs', '🐇 Short Legs'],
        user_type: UserType.CONSUMER,
        is_optional: true,
        is_multi_selected: true,
        selection_limit: 0,
        sr_no: 10
      },
      {
        title: 'Distinctive Features',
        description: "(We ask this to help match you with similar people, but if you'd rather not answer, feel free to skip! Hint: we know not one characteristic defines YOU, rest assured, you’ll be matched based on many other characteristics as well) ",
        options: ['Tattoos', 'Piercings', 'Freckles', 'Person with a disability', 'Person with a prosthetic leg', 'Person who uses a wheelchair', 'Person with mobility challenges', 'Person with a visual impairment'],
        user_type: UserType.CONSUMER,
        is_optional: true,
        is_multi_selected: true,
        selection_limit: 0,
        sr_no: 11
      },
      {
        title: 'Lifestyle',
        description: "(Choose all that apply)",
        options: ['Fitness-Focused', 'Family-Oriented', 'Travel Enthusiast', 'Homebody', 'Career-Driven', 'Social Butterfly', 'Love-to-Host'],
        user_type: UserType.CONSUMER,
        is_optional: true,
        is_multi_selected: true,
        selection_limit: 0,
        sr_no: 12
      },
      {
        title: 'Values and Beliefs',
        description: "",
        options: [
          'Eco-Friendly',
          'Animal Rights Advocate',
          'Social Justice Oriented',
          'Religious',
          'Secular',
          'Philanthropic',
          'Sustainability Focused (e.g., promotes reducing waste, supporting renewable energy)',
          'Diversity and Inclusion Advocate',
          'Gender Equality Advocate',
          'Health Consumerism (e.g., promotes fair trade, ethical sourcing)',
          'LGBTQ + Ally',
          'Body Positivity Advocate',
          'Supporter of Local Businesses (e.g., promotes buying local, supporting small business)',
          'Enviromental Conversation (e.g., promotes wildlife protection, conversation efforts)',
          'Pro-Science and Education',
          'Family-Oriented Values',
          'Human Rights Advocate',
        ],
        user_type: UserType.CONSUMER,
        is_optional: true,
        is_multi_selected: true,
        selection_limit: 0,
        sr_no: 13
      },
      {
        title: 'Hobbies and Interests',
        description: "",
        options: ['Fashion', 'Beauty', 'Fitness', 'Travel', 'Food and Cooking', 'Technology', 'Gaming', 'Reading', 'Art and Design', 'Music', 'Sports'],
        user_type: UserType.CONSUMER,
        is_optional: true,
        is_multi_selected: true,
        selection_limit: 0,
        sr_no: 14
      },
      {
        title: "Budgets",
        description: "We know it can fluctuate with payday, so please check all that apply",
        question: "How would you describe your budget?",
        options: ['Saver', 'Practical Picker', 'Mix & Match', 'Trusted & On-Point', 'Luxury Loyalist'],
        user_type: UserType.CONSUMER,
        is_optional: false,
        is_multi_selected: true,
        selection_limit: 0,
        sr_no: 15
      },
      {
        title: 'Styles',
        description: "We know that “style” can vary by occasion and change over time, so check all boxes that apply",
        question: "How would you describe your style or your desired fashion style?",
        options: ['Vintage Vibes', 'Bold', 'Urban Chic', 'Beachy Vibes', 'Boho', 'Girl Next-Door', 'Classic Elegance', 'Sleek Minimalist', 'Old Money', 'Cowgirl Chic', 'Chameleon Style'],
        question_category: 'Feminine Styles',
        user_type: UserType.CONSUMER,
        is_optional: true,
        is_multi_selected: true,
        selection_limit: 0,
        sr_no: 16
      },
      {
        title: 'Styles',
        description: "We know that “style” can vary by occasion and change over time, so check all boxes that apply",
        question: "How would you describe your style or your desired fashion style?",
        options: ['Simple and Laid Back ("Hot Guy Next Door")', 'Power Player', 'Street Edge', 'Coastal Casual', 'Timeless Classic', 'Modern Minimalist', 'Western Wear', 'Chameleon Style'],
        question_category: 'Masculine Styles',
        user_type: UserType.CONSUMER,
        is_optional: true,
        is_multi_selected: true,
        selection_limit: 0,
        sr_no: 17
      },
      {
        title: 'Styles',
        description: 'We know that “style” can vary by occasion and change over time, so check all boxes that apply',
        question: 'How would you describe your style or your desired fashion style?',
        options: ['Gender Neutral Styles', 'Bold & Daring Styles'],
        question_category: 'Non-binary Styles',
        user_type: UserType.CONSUMER,
        is_optional: true,
        is_multi_selected: true,
        selection_limit: 0,
        sr_no: 31
      },
    ];

    await this.questionnaireRepository.seederQUestionnaire(questions)
    this.logger.log('-------------------questionnaires populated-------------');
  }
}
