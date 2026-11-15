export const imageUrl = `https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets`;

const skinShades = ['Fair', 'Light', 'Medium', 'Olive', 'Tan', 'Dark'];

const skinShadeObjects = skinShades.map((shade) => ({
  question_category: null,
  sr_no: 9,
  title: 'Skin Shade',
  option: shade,
  image_url: `${imageUrl}/${shade.toLowerCase()}.jpg`,
  option_discription: null,
}));

const distinctiveOptions = [
  'Tattoos',
  'Piercings',
  'Freckles',
  'Person with a disability',
  'Person with a prosthetic leg',
  'Person who uses a wheelchair',
  'Person with mobility challenges',
  'Person with a visual impairment',
  'None',
];

const distinctiveOptionsMinor = [
  'Freckles',
  'Person with a disability',
  'Person with a prosthetic leg',
  'Person who uses a wheelchair',
  'Person with mobility challenges',
  'Person with a visual impairment',
  'None',
];

const formatFileName = (option) =>
  option
    .toLowerCase() // convert to lower-case
    .replace(/\s+/g, '_') // replace spaces with underscores
    .replace(/[^\w_]/g, ''); // remove any non-word characters

const distinctiveFeatureObjects = distinctiveOptions.map((option) => ({
  question_category: null,
  sr_no: 11,
  title: 'Distinctive Features',
  option: option,
  image_url: option === 'None' ? null : `${imageUrl}/${formatFileName(option)}.png`,
  option_discription: null,
}));

const distinctiveFeatureObjectsMinor = distinctiveOptionsMinor.map((option) => ({
  question_category: null,
  sr_no: 11,
  title: 'Distinctive Features',
  option: option,
  image_url: option === 'None' ? null : `${imageUrl}/${formatFileName(option)}.png`,
  option_discription: null,
}));

const valuesAndBeliefsOptions = ['Eco-Friendly', 'Animal Rights Advocate', 'Social Justice Oriented', 'Religious', 'Secular', 'Philanthropic', 'None'];
const valuesBeliefsObjects = valuesAndBeliefsOptions.map((option) => ({
  question_category: null,
  sr_no: 13,
  title: 'Values and Beliefs',
  option: option,
  image_url: option === 'None' ? null : `${imageUrl}/${formatFileName(option)}.png`,
  option_discription: null,
}));

const platformOptions = ['Instagram', 'TikTok', 'YouTube', 'Pinterest', "Twitter'X'", 'Facebook', 'Linkedln', 'Snapchat'];
const platformObjects = platformOptions.map((option) => ({
  question_category: null,
  sr_no: 19,
  title: 'Platforms are you most active',
  option: option,
  image_url: `${imageUrl}/${formatFileName(option)}.svg`,
  option_discription: null,
}));

const sportsOptions = [
  'Basketball',
  'Football (American)',
  'Soccer',
  'Baseball',
  'Tennis',
  'Swimming',
  'Running',
  'Martial Arts',
  'Esports/Gaming',
  'None / Not into sports',
  'Other',
];
const sportsObjects = sportsOptions.map((option) => ({
  question_category: null,
  sr_no: 33,
  title: 'Sports:',
  option: option,
  image_url: `${imageUrl}/${formatFileName(option)}.svg`,
  option_discription: null,
}));

const hobbyOptionsMinor = [
  'Drawing or Coloring',
  'Reading Storybooks',
  'Playing with Toys',
  'Watching Cartoons or Movies',
  'Playing Video Games',
  'Listening to Music',
  'Crafting or Building Things',
  'Playing Outside',
  'Other',
];
const hobbyOptionsObjectsMinor = hobbyOptionsMinor.map((option) => ({
  question_category: null,
  sr_no: 32,
  title: 'Hobbies:',
  option: option,
  // image_url: option === 'None' ? null : `${imageUrl}/${formatFileName(option)}.png`,
  option_discription: null,
}));

const sportsOptionsMinor = [
  'Soccer',
  'Basketball',
  'Swimming',
  'Running or Tag',
  'Martial Arts (Karate, Taekwondo, etc.)',
  'Gymnastics or Dance',
  'Cycling or Skating',
  'None / Not into sports',
  'Other',
];
const sportsObjectMinor = sportsOptionsMinor.map((option) => ({
  question_category: null,
  sr_no: 33,
  title: 'Sports',
  option: option,
  option_discription: null,
}));

const interestOptions = [
  'Fashion',
  'Beauty',
  'Fitness',
  'Travel',
  'Technology',
  'Gaming',
  'Food & Cooking',
  'Parenting',
  'Lifestyle',
  'Health & Wellness',
  'Sports',
  'Other',
];
const interestOptionsMinor = [
  'Clothes & Style',
  'Fun with Makeup or Skincare',
  'Playing Sports & Being Active',
  'Cool Places & Travel Adventures',
  'Gadgets & Tech Stuff',
  'Video Games',
  'Yummy Food & Cooking Fun',
  'Family & Home Life',
  'Everyday Life & Hobbies',
  'Feeling Good & Staying Healthy',
  'Other',
];

const interestObjects = interestOptions.map((option) => ({
  question_category: null,
  sr_no: 20,
  title: 'Content niches do you primarily focus on',
  option: option,
  image_url: option === 'Other' ? null : `${imageUrl}/${formatFileName(option)}.png`,
  ...(option == 'Other' && {
    input_field: {
      fieldName: 'otherContent',
      placeholder: 'Enter Other Content',
    },
  }),
  option_discription: null,
}));

const interestObjectsMinor = interestOptionsMinor.map((option, index) => ({
  question_category: null,
  sr_no: 20,
  title: 'Content niches do you primarily focus on',
  option: option,
  image_url: option === 'Other' ? null : `${imageUrl}/${formatFileName(interestOptions[index])}.png`,
  ...(option === 'Other' && {
    input_field: {
      fieldName: 'otherContent',
      placeholder: 'Enter Other Content',
    },
  }),
  option_discription: null,
}));

const languageOptions = [
  'English',
  'Spanish',
  'Mandarin',
  'French',
  'German',
  'Italian',
  'Japanese',
  'Korean',
  'Urdu',
  'Hindi',
  'Standard Arabic',
  'Bengali',
  'Portuguese',
  'Russian',
  'Other',
];
const languagesObjects = languageOptions.map((option) => ({
  question_category: null,
  sr_no: 4,
  title: 'Languages',
  option: option,
  image_url: option === 'Other' ? null : `${imageUrl}/${formatFileName(option)}.png`,
  ...(option == 'Other' && {
    input_field: {
      fieldName: 'otherLanguage',
      placeholder: 'Enter Other Language',
    },
  }),
  option_discription: null,
}));

const interactionOptions = [
  'Low interaction (e.g., rare replies)',
  'Medium interaction (e.g., occasional replies)',
  'High interaction (e.g., frequent, meaningful replies)',
  'It varies',
];

const formatBracketFileName = (option) =>
  option
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // Remove text within parentheses
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^\w_]/g, '') // Remove non-alphanumeric and non-underscore characters
    .replace(/_+/g, '_') // Replace multiple underscores with a single underscore
    .replace(/^_+|_+$/g, ''); // Trim underscores from start and end
const interactionObjects = interactionOptions.map((option) => ({
  question_category: null,
  sr_no: 23,
  question: 'How frequently do you interact with your audience?',
  option: option,
  image_url: `${imageUrl}/${formatBracketFileName(option)}.png`,
  option_discription: null,
}));

const aestheticOptions = [
  'Professional (Polished, high-quality content with a focus on refined and well-produced visuals)',
  'Authentic (Real - life, relatable content that feels genuine)',
  'Unfiltered (Candid, unedited style where you talk directly to the camera in an everyday, unscripted manner)',
];
const aestheticObjects = aestheticOptions.map((option) => ({
  question_category: null,
  sr_no: 25,
  question: 'How would you describe your content’s aesthetic?',
  option: option,
  image_url: `${imageUrl}/${formatBracketFileName(option)}.png`,
  option_discription: null,
}));

const contentTypes = ['Video', 'Photography', 'Blog Posts', 'Reels/Short-form Video', 'Stories', 'Live Streams'];
const contentTypesObjects = contentTypes.map((option) => ({
  question_category: null,
  sr_no: 26,
  question: 'What content types do you primarily create?',
  option: option,
  image_url: `${imageUrl}/${formatFileName(option)}.png`,
  option_discription: null,
}));

export const questions_options = [
  // BUDGETS
  {
    question_category: null,
    sr_no: 15,
    option: 'Saver',
    image_url: `${imageUrl}/saver.png`,
    option_discription:
      'Loves a good deal, lives for discounts, and shops at places like Walmart. If it’s on sale, they’re all in—bargain bins are their playground.',
  },
  {
    question_category: null,
    sr_no: 15,
    option: 'Practical Picker',
    image_url: `${imageUrl}/practical_picker.png`,
    option_discription:
      'Loves a good deal but doesn’t dig through clearance racks. Shops at stores like Kohl’s and Target, with an eye for quality at a fair price.',
  },
  {
    question_category: null,
    sr_no: 15,
    option: 'Mix & Match',
    image_url: `${imageUrl}/mix_match.png`,
    option_discription: 'Balances high and low—picks up a tee at Target but pairs it with a designer handbag or belt from Louis Vuitton or YSL.',
  },
  {
    question_category: null,
    sr_no: 15,
    option: 'Trusted & On-Point',
    image_url: `${imageUrl}/trusted_on_point.png`,
    option_discription:
      'Shops at Nordstrom and J-Crew, where quality and on-trend fashion are a given. Their price points are typically higher but worth not having to hunt for what you want. You also wear luxury items, but not exclusively.',
  },
  {
    question_category: null,
    sr_no: 15,
    option: 'Luxury Loyalist',
    image_url: `${imageUrl}/luxury_loyalist.png`,
    option_discription: 'All about the high-end life, only shops high-end retail. Quality and brand names are non-negotiable—luxury is a must.',
  },
  // STYLES
  // Feminine Styles
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Vintage Vibes',
    option_discription:
      'You love blending retro pieces with modern fashion for a unique, timeless look. To a dinner party, you might wear a retro-inspired dress with modern accessories and classic pumps',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Bold',
    option_discription:
      'Your style exudes confidence with bold, polished outfits that make a statement. A tailored blazer over a sleek pencil dress with pointed - toe heels and a structured handbag.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Urban Chic',
    option_discription:
      'You bring urban flair to your everyday style, mixing edgy and casual elements effortlessly. A leather jacket over a graphic tee, distressed skinny jeans, and high top sneakers.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Beachy Vibes',
    option_discription:
      'Your wardrobe is relaxed and breezy, perfect for easygoing, sunny-day vibes. A flowy maxi dress with a light cardigan and strappy sandals, accessorized with a sunhat.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Boho',
    option_discription:
      'Your look is carefree and eclectic, with a love for flowy fabrics, earthy tones, and whimsical details. A floral print maxi skirt with a peasant blouse, layered necklaces, and ankle boots.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Girl Next-Door',
    option_discription:
      'Your style is sweet, approachable, and effortlessly charming, with a focus on simple, classic pieces that are both comfortable and cute. Think of a soft, fitted cardigan over a casual top, paired with well-fitted jeans or a simple skirt, and finished with ballet flats or low-key sneakers.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Classic Elegance',
    option_discription:
      'Your style focuses on enduring pieces that transcend trends, always looking sophisticated and elegant.A little black dress with a tailored trench coat and classic pumps.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Sleek Minimalist',
    option_discription:
      'You prefer clean, simple lines with a love for streamlined, contemporary designs.A monochrome jumpsuit with minimalist sandals and a sleek crossbody bag.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Old Money',
    option_discription:
      'Your style reflects timeless elegance with classic, well-tailored pieces and subtle sophistication, often opting for a neutral monochrome look. A cashmere sweater over high-waisted trousers, paired with loafers and pearl earrings.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Cowgirl Chic',
    option_discription:
      'You blend rugged Western influences with modern fashion for a tough yet trendy look. A fitted long sleeve shirt with tight jeans, a fur vest, cowboy boots, and a wide-brim hat.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Chameleon Style',
    option_discription:
      "Your style varies widely depending on where you're going and who you're with, effortlessly shifting from sexy to conservative or boho for different occasions. A sleek bodycon dress for a night out, a boho maxi dress for a festival, or a tailored blazer and jeans for a casual day out.",
  },
  // STYLES
  // Masculine
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Simple and Laid Back ("Hot Guy Next Door")',
    option_discription:
      'You prefer understated, well-fitting clothing without logos or prints, focusing on quality and fit. A perfect white V-neck tee with well-fitted jeans, a baseball hat worn backwards, and classic sneakers.',
  },
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Power Player',
    option_discription:
      'Your style is all about confidence with sharp, polished outfits that command attention. A sharp navy suit with a crisp white shirt, a silk tie, and polished oxford shoes.',
  },
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Street Edge',
    option_discription:
      'You infuse urban style into your wardrobe, effortlessly combining edgy and casual elements. A bomber jacket over a graphic tee, ripped jeans, and high-top sneakers.',
  },
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Coastal Casual',
    option_discription:
      'Your wardrobe is laid-back and breezy, ideal for relaxed, sunny-day outings. Chino shorts with a lightweight linen shirt, boat shoes, and aviator sunglasses.',
  },
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Timeless Classic',
    option_discription:
      'Your style is rooted in classic, enduring pieces that never go out of fashion. A well- fitted navy blazer over a white dress shirt, khaki chinos, and loafers.',
  },
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Modern Minimalist',
    option_discription:
      'You favor clean, simple lines and contemporary designs that exude understated sophistication. A slim-fit black turtleneck with tailored trousers and minimalist leather sneakers.',
  },
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Western Wear',
    option_discription:
      'You embrace the rugged, classic look of the American West, blending durability with style. A classic denim jacket over a plaid shirt, boot-cut jeans, and cowboy boots with a belt featuring a silver buckle.',
  },
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Chameleon Style',
    option_discription:
      "Your style varies widely depending on where you're going and who you're with, effortlessly shifting from laid back jeans and tee-shirts for home depot trips, to polished suits for the courtroom, and even an edgy graphic tee and bomber jacket for a date.",
  },
  // STYLES
  // Non-binary
  {
    question_category: 'Non-binary Styles',
    sr_no: 36,
    option: 'Gender Neutral Styles',
    option_discription:
      'A blend of masculine and feminine elements that transcends traditional gender boundaries. Focused on comfort, simplicity, and versatility, these styles often feature clean lines and minimalistic designs suitable for all genders.',
  },
  {
    question_category: 'Non-binary Styles',
    sr_no: 36,
    option: 'Bold & Daring Styles',
    option_discription:
      'Daring, expressive, and eye-catching, this style embraces vibrant colors, dramatic patterns, and statement pieces. It’s all about making a statement through fashion with confidence and creativity.',
  },

  //  Hair COlor

  {
    question_category: null,
    sr_no: 7,
    title: 'Hair Color',
    option: 'Blonde',
    image_url: `${imageUrl}/blonde.png`,
    option_discription: null,
  },
  {
    question_category: null,
    sr_no: 7,
    title: 'Hair Color',
    option: 'Brunette',
    image_url: `${imageUrl}/brunette.png`,
    option_discription: null,
  },
  {
    question_category: null,
    sr_no: 7,
    title: 'Hair Color',
    option: 'Black',
    image_url: `${imageUrl}/black.png`,
    option_discription: null,
  },
  {
    question_category: null,
    sr_no: 7,
    title: 'Hair Color',
    option: 'Red',
    image_url: `${imageUrl}/red.png`,
    option_discription: null,
  },
  {
    question_category: null,
    sr_no: 7,
    title: 'Hair Color',
    option: 'Grey',
    image_url: `${imageUrl}/grey.png`,
    option_discription: null,
  },
  {
    question_category: null,
    sr_no: 7,
    title: 'Hair Color',
    option: 'Bald',
    image_url: `${imageUrl}/bald.png`,
    option_discription: null,
  },
  {
    question_category: null,
    sr_no: 7,
    title: 'Hair Color',
    option: 'Dyed (e.g., blue, pink, green)',
    image_url: `${imageUrl}/dayed.png`,
    option_discription: null,
  },

  // Skin Shade

  ...skinShadeObjects,
  // Distinctive Features
  ...distinctiveFeatureObjects,
  // Values and Beliefs
  ...valuesBeliefsObjects,
  // Languages
  ...languagesObjects,
  // Platforms are you most active
  ...platformObjects,
  // Content niches do you primarily focus on
  ...interestObjects,
  // How frequently do you interact with your audience?
  ...interactionObjects,
  // How would you describe your content’s aesthetic?
  ...aestheticObjects,
  // What content types do you primarily create?
  ...contentTypesObjects,
  // Body Type::
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Apple',
    image_url: `${imageUrl}/apple.png`,
    option_discription: 'You carry most of your weight around your midsection, with a fuller bust and slimmer hips.',
  },
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Pear',
    image_url: `${imageUrl}/pear.png`,
    option_discription: 'Your hips are wider than your shoulders, with a smaller waist and a more defined lower body.',
  },
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Hourglass',
    image_url: `${imageUrl}/hourglass.png`,
    option_discription: 'You have a balanced bust and hips with a well-defined, narrow waist.',
  },
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Inverted Triangle',
    image_url: `${imageUrl}/inverted_triangle.png`,
    option_discription: 'Your shoulders are broader than your hips, creating a more athletic upper body shape.',
  },
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Rectangle-shaped',
    image_url: `${imageUrl}/rectangle_shaped.png`,
    option_discription: 'Your waist, hips, and shoulders are similar in width, giving you a straight, balanced silhouette.',
  },
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Long Torso',
    image_url: `${imageUrl}/long_torso.png`,
    option_discription: 'Your torso is proportionally longer than your legs, giving you an elongated midsection.',
  },
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Short Torso',
    image_url: `${imageUrl}/short_torso.png`,
    option_discription: 'Your torso is shorter in comparison to your legs, resulting in a more compact upper body.',
  },
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Long Legs',
    image_url: `${imageUrl}/long_legs.png`,
    option_discription: 'Your legs are longer in proportion to your torso, giving you an elongated lower body.',
  },
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Short Legs',
    image_url: `${imageUrl}/short_legs.png`,
    option_discription: 'Your legs are shorter compared to your torso, creating a more compact lower body.',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '8M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '8.5M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '9M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '9.5M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '10M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '10.5M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '11M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '11.5M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '12M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '12.5M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '13M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '13.5M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '14M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '14.5M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '15M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '15.5M',
    heading: 'Men',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '5W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '5.5W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '6W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '6.5W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '7W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '7.5W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '8W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '8.5W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '9W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '9.5W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '10W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '10.5W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '11W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '11.5W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '12W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '12.5W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '13W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '13.5W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '14W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '14.5W',
    heading: 'Women',
  },
  {
    question_category: null,
    sr_no: 3,
    title: 'Ethnicity',
    option: 'Other',
    input_field: {
      fieldName: 'otherEthnicity',
      placeholder: 'Enter Other Ethnicity',
    },
  },
  {
    question_category: null,
    sr_no: 30,
    option: 'Other Regions',
    input_field: {
      fieldName: 'otherRegions',
      placeholder: 'Enter Other Regions',
    },
  },
  {
    question_category: null,
    sr_no: 33,
    option: 'Other',
    input_field: {
      fieldName: 'otherSports',
      placeholder: 'Enter Other Sports',
    },
  },
  {
    question_category: null,
    sr_no: 32,
    option: 'Other',
    input_field: {
      fieldName: 'otherHobbies',
      placeholder: 'Enter Other Hobbies',
    },
  },
  {
    question_category: null,
    sr_no: 30,
    option: 'Other Countries',
    input_field: {
      fieldName: 'otherCountries',
      placeholder: 'Enter Other Countries',
    },
  },
  {
    question_category: null,
    sr_no: 30,
    option: 'Other Cities',
    input_field: {
      fieldName: 'otherCities',
      placeholder: 'Enter Other Cities',
    },
  },
];

export const questions_options_minor = [
  // BUDGETS
  {
    question_category: null,
    sr_no: 15,
    option: 'Saver',
    image_url: `${imageUrl}/saver.png`,
    option_discription:
      'Loves a good deal, lives for discounts, and shops at places like Walmart. If it’s on sale, they’re all in—bargain bins are their playground.',
  },
  {
    question_category: null,
    sr_no: 15,
    option: 'Practical Picker',
    image_url: `${imageUrl}/practical_picker.png`,
    option_discription:
      'Loves a good deal but doesn’t dig through clearance racks. Shops at stores like Kohl’s and Target, with an eye for quality at a fair price.',
  },
  {
    question_category: null,
    sr_no: 15,
    option: 'Mix & Match',
    image_url: `${imageUrl}/mix_match.png`,
    option_discription: 'Balances high and low—picks up a tee at Target but pairs it with a designer handbag or belt from Louis Vuitton or YSL.',
  },
  {
    question_category: null,
    sr_no: 15,
    option: 'Trusted & On-Point',
    image_url: `${imageUrl}/trusted_on_point.png`,
    option_discription:
      'Shops at Nordstrom and J-Crew, where quality and on-trend fashion are a given. Their price points are typically higher but worth not having to hunt for what you want. You also wear luxury items, but not exclusively.',
  },
  {
    question_category: null,
    sr_no: 15,
    option: 'Luxury Loyalist',
    image_url: `${imageUrl}/luxury_loyalist.png`,
    option_discription: 'All about the high-end life, only shops high-end retail. Quality and brand names are non-negotiable—luxury is a must.',
  },

  // STYLES
  // Feminine Styles
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Retro Fun',
    option_discription: 'You love clothes that look like they’re from the past, like your favorite movie characters or old cartoons!',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Super Bold',
    option_discription: 'You like bright colors, fun patterns, and standing out in the crowd!',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Cool City Kid',
    option_discription: 'You like stylish, comfy clothes that are great for walking around town or hanging out with friends.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Beach Day Style',
    option_discription: 'You love flip-flops, fun prints, and outfits that feel like a summer vacation!',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Adventure Explorer',
    option_discription: 'You like clothes that are free, fun, and a little bit artsy or nature-inspired.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Boho',
    option_discription: 'You like clothes that are free, fun, and a little bit artsy or nature-inspired.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Friendly & Fun',
    option_discription: 'You wear cute and comfy clothes, like your favorite t-shirt and jeans—easy and always fun!',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Fancy & Neat',
    option_discription: 'You like to dress up nice and look a little fancy, like for a party or special occasion.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Simple & Cool',
    option_discription: 'You like things clean and neat—nothing too wild, just nice and easy outfits.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Classic Kid',
    option_discription: 'You dress like a kid in a storybook—polished, neat, and a little grown-up in a cool way.',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Cowgirl Chic',
    option_discription: 'You love boots, hats, and clothes that look like you’re ready for a rodeo!',
  },
  {
    question_category: 'Feminine Styles',
    sr_no: 16,
    option: 'Mix & Match Master',
    option_discription: ' You like changing your look all the time—every day is something new!',
  },
  // STYLES
  // Masculine
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Easygoing & Chill',
    option_discription: 'You like comfy clothes like hoodies, t-shirts, and sneakers—simple and cool!',
  },
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Big Boss Vibes',
    option_discription: 'You like dressing sharp, like a leader—button-ups, nice shoes, and looking ready for anything!',
  },
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'City Cool',
    option_discription: 'You wear trendy, edgy stuff—like jackets, hats, and sneakers that make you feel super stylish.',
  },
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Beach Day Chill',
    option_discription: 'You like light, fun clothes like shorts, sandals, and anything that feels sunny and fun!',
  },
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Always in Style',
    option_discription: 'You like outfits that never go out of fashion—classic and clean, like in the movies!',
  },
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Neat & Simple',
    option_discription: 'You like clothes that are plain but perfect—clean lines, cool colors, and no fuss.',
  },
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Cowboy Style',
    option_discription: 'You love boots, denim, and clothes that make you feel ready for a western adventure!',
  },
  {
    question_category: 'Masculine Styles',
    sr_no: 17,
    option: 'Mix It Up',
    option_discription: 'You wear something different every day—sporty one day, dressy the next—you like to try it all!',
  },
  //  Hair COlor

  {
    question_category: null,
    sr_no: 7,
    title: 'Hair Color',
    option: 'Blonde',
    image_url: `${imageUrl}/blonde.png`,
    option_discription: null,
  },
  {
    question_category: null,
    sr_no: 7,
    title: 'Hair Color',
    option: 'Brunette',
    image_url: `${imageUrl}/brunette.png`,
    option_discription: null,
  },
  {
    question_category: null,
    sr_no: 7,
    title: 'Hair Color',
    option: 'Black',
    image_url: `${imageUrl}/black.png`,
    option_discription: null,
  },
  {
    question_category: null,
    sr_no: 7,
    title: 'Hair Color',
    option: 'Red',
    image_url: `${imageUrl}/red.png`,
    option_discription: null,
  },
  {
    question_category: null,
    sr_no: 7,
    title: 'Hair Color',
    option: 'Grey',
    image_url: `${imageUrl}/grey.png`,
    option_discription: null,
  },
  {
    question_category: null,
    sr_no: 7,
    title: 'Hair Color',
    option: 'Bald',
    image_url: `${imageUrl}/bald.png`,
    option_discription: null,
  },
  {
    question_category: null,
    sr_no: 7,
    title: 'Hair Color',
    option: 'Dyed (e.g., blue, pink, green)',
    image_url: `${imageUrl}/dayed.png`,
    option_discription: null,
  },

  // Skin Shade

  ...skinShadeObjects,
  // Distinctive Features
  ...distinctiveFeatureObjectsMinor,
  // Languages
  ...languagesObjects,
  // Platforms are you most active
  ...platformObjects,
  //hobby objects
  ...hobbyOptionsObjectsMinor,
  //sports objects
  ...sportsObjectMinor,
  // Content niches do you primarily focus on
  ...interestObjectsMinor,
  // How frequently do you interact with your audience?
  ...interactionObjects,
  // How would you describe your content’s aesthetic?
  ...aestheticObjects,
  // What content types do you primarily create?
  ...contentTypesObjects,
  // Body Type::
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Slim',
    image_url: null,
    option_discription: 'You have a slender and lean body composition.',
  },
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Average build',
    image_url: null,
    option_discription: 'Your body has balanced proportions, neither particularly slender nor large.',
  },
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Solid build',
    image_url: null,
    option_discription: 'You have a sturdy and well-built physique, often with good muscle mass.',
  },
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Sturdy',
    image_url: null,
    option_discription: 'You have a strong and robust body, suggesting durability and resilience.',
  },
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Athletic',
    image_url: null,
    option_discription: 'Your body is toned and well-developed, characteristic of someone engaged in physical activity.',
  },
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Small frame',
    image_url: null,
    option_discription: 'You have a delicate bone structure, making you appear more petite.',
  },
  {
    question_category: null,
    sr_no: 10,
    title: 'Body Type',
    option: 'Big frame',
    image_url: null,
    option_discription: 'You have a larger bone structure, giving you a naturally broader appearance.',
  },
  // Shoe Size
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '1K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '1.5K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '2K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '2.5K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '3K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '3.5K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '4K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '4.5K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '5K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '5.5K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '6K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '6.5K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '7K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '7.5K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '8K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '8.5K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '9K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '9.5K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '10K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '10.5K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '11K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '11.5K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '12K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '12.5K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '13K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '13.5K',
    heading: 'Little Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '1Y',
    heading: 'Big Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '1.5Y',
    heading: 'Big Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '2Y',
    heading: 'Big Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '2.5Y',
    heading: 'Big Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '3Y',
    heading: 'Big Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '3.5Y',
    heading: 'Big Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '4Y',
    heading: 'Big Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '4.5Y',
    heading: 'Big Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '5Y',
    heading: 'Big Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '5.5Y',
    heading: 'Big Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '6Y',
    heading: 'Big Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '6.5Y',
    heading: 'Big Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '7Y',
    heading: 'Big Kids',
  },
  {
    question_category: null,
    sr_no: 36,
    title: 'Shoe Size',
    option: '7.5Y',
    heading: 'Big Kids',
  },
  {
    question_category: null,
    sr_no: 3,
    title: 'Ethnicity',
    option: 'Other',
    input_field: {
      fieldName: 'otherEthnicity',
      placeholder: 'Enter Other Ethnicity',
    },
  },
  {
    question_category: null,
    sr_no: 30,
    option: 'Other Regions',
    input_field: {
      fieldName: 'otherRegions',
      placeholder: 'Enter Other Regions',
    },
  },
  {
    question_category: null,
    sr_no: 30,
    option: 'Other Countries',
    input_field: {
      fieldName: 'otherCountries',
      placeholder: 'Enter Other Countries',
    },
  },
  {
    question_category: null,
    sr_no: 32,
    option: 'Other',
    input_field: {
      fieldName: 'otherHobbies',
      placeholder: 'Enter Other Hobbies',
    },
  },
  {
    question_category: null,
    sr_no: 33,
    option: 'Other',
    input_field: {
      fieldName: 'otherSports',
      placeholder: 'Enter Other Sports',
    },
  },
  {
    question_category: null,
    sr_no: 30,
    option: 'Other Cities',
    input_field: {
      fieldName: 'otherCities',
      placeholder: 'Enter Other Cities',
    },
  },
];
