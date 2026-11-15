const amazonRegex = /^(https?:\/\/)?(www\.)?(amazon\.[a-z.]{2,}|a\.co)(\/.*)?$/i;
// const amazonRegex =
//   /^(https?:\/\/)?(www\.)?(amazon\.[a-z]{2,})(\/.*)?\/dp\/[A-Z0-9]{10}(\/.*)?$/;
const amazonShortRegex = /^(https?:\/\/)?(www\.)?(a\.co)\/d\/[A-Za-z0-9]+$/;

export const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w./-]*)?(\?[^\s]*)?(#[^\s]*)?$/;

export const validateAmazonLink = (url) => {
  return amazonRegex.test(url);
};

export const validateShortAmazonLink = (url) => {
  return amazonShortRegex.test(url);
};

export const validateValidUrlLink = (url) => {
    return urlRegex.test(url);
  };
