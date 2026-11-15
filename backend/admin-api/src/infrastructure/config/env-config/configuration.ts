import { registerAs } from '@nestjs/config';

const DatabaseConfig = registerAs('database', () => {
  return {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    type: process.env.DATABASE_TYPE as 'postgres',
  };
});

const JwtConfig = registerAs('jwtConfig', () => ({
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  signOptions: { expiresIn: '24h' },
}));

const googleConfig = registerAs('googleConfig', () => ({
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  signOptions: { expiresIn: '24h' },
  googleVerifyUrl: process.env.VERIFY_GOOGLE_URL,
}));

const AwsConfig = registerAs('awsConfig', () => ({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
}));

const MyConfig = registerAs('myConfig', () => ({
  userApiToken: process.env.USER_API_TOKEN,
}));

export default [DatabaseConfig, JwtConfig, AwsConfig, googleConfig, MyConfig];
