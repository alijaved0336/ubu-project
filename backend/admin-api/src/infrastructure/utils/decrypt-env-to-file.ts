const secureEnv = require('secure-env');
const fs = require('fs');

function decryptEnvToFile(secret, inputPath, outputPath) {
  try {
    const env = secureEnv({ secret: secret, path: inputPath });
    const envContent = Object.entries(env)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(outputPath, envContent);
    console.log(`Decrypted environment variables have been written to ${outputPath}`);
  } catch (error) {
    console.error('Failed to decrypt environment variables:', error.message);
  }
}

const secret = process.argv[2];
const inputPath = process.argv[3] || '.env.enc';
const outputPath = process.argv[4] || '.env';

if (!secret) {
  console.error('Usage: node decrypt-env-to-file.js <secret> [inputPath] [outputPath]');
  process.exit(1);
}

decryptEnvToFile(secret, inputPath, outputPath);
