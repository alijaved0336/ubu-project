import { registerAs } from '@nestjs/config'
// const secureEnv = require('secure-env');

// process.env = secureEnv({ secret: 'ubu-user-api' });
const DatabaseConfig = registerAs('database', () => {
  return {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    type: process.env.DATABASE_TYPE as 'postgres'
  }
})

const JwtConfig = registerAs('jwtConfig', () => ({
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  signOptions: { expiresIn: '30d' }
}))

const googleConfig = registerAs('googleConfig', () => ({
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  signOptions: { expiresIn: '30d' },
  googleVerifyUrl: process.env.VERIFY_GOOGLE_URL,
}))

const IsntagramConfig = registerAs('instagramConfig', () => ({
  clientId: process.env.INSTA_CLIENT_ID,
  clientSecret: process.env.INSTA_CLIENT_SECRET,
  redirectUri: process.env.INSTA_REDIRECT_URI
}))

const AdminAPI = registerAs('AdminAPI', () => ({
  adminAPI: process.env.ADMIN_API,
  userApiToken: process.env.USER_API_TOKEN,
}))


export default [
  DatabaseConfig,
  JwtConfig,
  googleConfig,
  IsntagramConfig,
  AdminAPI
]
