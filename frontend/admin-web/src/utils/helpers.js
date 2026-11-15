import moment from "moment";
import imageCompression from "browser-image-compression";

export function getPrice({
  amount,
  currency = "usd",
  decimalPlaces = 2,
  isStripePrice = false,
}) {
  let amountInNumber = Number(amount);

  if (isNaN(amountInNumber)) {
    return amountInNumber;
  }

  const currenciesWithoutDecimals = ["jpy", "krw", "vnd"]; // Currencies without fractional units
  const hasDecimal = !currenciesWithoutDecimals.includes(
    currency.toLowerCase()
  );

  const realAmount =
    hasDecimal && isStripePrice ? amountInNumber / 100 : amountInNumber;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.toUpperCase(),
    minimumFractionDigits: hasDecimal ? decimalPlaces : 0,
  }).format(realAmount);
}

export function roundToTwoDecimalPlaces(value) {
  let valueInNumber = Number(value);

  if (isNaN(valueInNumber)) {
    return value; // Return the original amount if it's not a valid number
  }

  const numberInString = parseFloat(valueInNumber.toString()).toFixed(2);

  const parts = numberInString.split(".");
  const integerPart = +(parts?.[0] ?? 0);
  const decimalPart = parts?.[1] ?? "";

  return `${integerPart}.${decimalPart}`;
}

export function formattedAmount(amount) {
  const roundedValue = roundToTwoDecimalPlaces(amount);
  const [integerPart, decimalPart = ""] = roundedValue?.split(".") || [];
  // Format the integer part for thousand separators
  const formatedIntegerPart = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "usd",
    maximumFractionDigits: 0,
  }).format(integerPart);

  return `${formatedIntegerPart}.${decimalPart}`;
}

export function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getFormattedDate(date, format = "DD/MM/YYYY, h:mm A") {
  if (!moment(date).isValid()) return date;
  return moment(date).format(format);
}

export const getTypeByExtension = (extension) => {
  const extensionMap = {
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
    mp4: "video",
    mov: "video",
    avi: "video",
    mp3: "audio",
    wav: "audio",
    pdf: "document",
    docx: "document",
    xlsx: "document",
  };

  return extensionMap[extension] || "unknown";
};

export const resizeImage = async (file) => {
  const type = file?.type?.split("/")?.[1];
  const options = {
    maxSizeMB: 1.0, // ~80 KB target
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    maxIteration: 15,
    initialQuality: 1,
    fileType: "image/webp", // important for reducing size
    alwaysKeepResolution: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);

    const fileName = compressedFile?.name?.split(".")?.[0] ?? "compressed";

    const convertToFile = new File([compressedFile], `${fileName}.webp`, {
      type: `${compressedFile?.type}`,
    });

    console.log({ compressedFile, convertToFile });

    return convertToFile;
  } catch (error) {
    console.error("Compression error:", error);
    return file;
  }
};

export const convertHeightToFeetInches = (heightMM) => {
  if (typeof heightMM !== "number") return 0;

  const totalInches = heightMM / 25.4;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};

export const convertFeetInchesToMM = (feet, inches) => {
  if (feet == null || inches == null) return 0;
  const mm = feet * 304.8 + inches * 25.4;
  return Math.round(mm);
};

export const convertWeightToLbs = (grams) => {
  if (typeof grams !== "number") return 0;
  return Math.round(grams * 0.00220462);
};

export const convertLbsToGrams = (lbs) => {
  if (typeof lbs !== "number") return 0;
  return Math.round(lbs / 0.00220462);
};

export const convertMMToCM = (mm) => {
  if (typeof mm !== "number") return 0;
  return +(mm / 10).toFixed(2);
};

export const convertCMToMM = (cm) => {
  if (typeof cm !== "number") return 0;
  return Math.round(cm * 10);
};
