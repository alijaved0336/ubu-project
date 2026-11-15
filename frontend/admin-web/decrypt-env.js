import secureEnv from "secure-env";
import fs from "fs";


function decryptEnvToFile(secret) {
  try {
    const env = secureEnv({ secret: secret});
    const envContent = Object.entries(env)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync('.env', envContent);
    console.log(
      `Decrypted environment variables have been written to .env`,
    );
  } catch (error) {
    console.error('Failed to decrypt environment variables:', error.message);
  }
}

const secret = process.argv[2];

if (!secret) {
  console.error(
    'Usage: node decrypt-env-to-file.js <secret>',
  );
  process.exit(1);
}

decryptEnvToFile(secret);