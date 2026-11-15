export const convertStringsToArrays = (obj) => {
  const result = {};
  for (const key in obj) {
    result[key] = { ...obj[key] };
    if (typeof obj[key].answer === "string") {
      result[key].answer = [obj[key].answer];
    }
  }
  return result;
};

export const EXTRACT_VALUES = (value) => {
  return value.replace(/[^a-zA-Z0-9\s\-_'"()+.,%]/g, "").trim();
};

export const EXTRACTGEOLOCATION = (data) => {
  const regionCountryCity = {};

  Object.values(data).forEach((arr) => {
    arr.forEach((item) => {
      if (item.includes(":")) {
        const [prefix, value] = item.split(":");
        regionCountryCity[prefix] = value;
      }
    });
  });

  const {
    Region: Region = null,
    Country: Country = null,
    City: City = null,
  } = regionCountryCity;
  if (Region) data["Region"] = Region;
  if (Country) data["Country"] = Country;
  if (City) data["City"] = City;

  for (const key in data) {
    for (const item of data[key]) {
      if (item.startsWith("Region:")) {
        data[key].push("Other Regions");
      }
      if (item.startsWith("Country:")) {
        data[key].push("Specific Countries (Please specify)");
      }
      if (item.startsWith("City:")) {
        data[key].push("Specific Cities / Regions (Please specify)");
      }
    }
  }
  return data;
};

export const FLATTEN =(data) =>{return  data && Object.values(data).flat()};

export const getInitials = (name) => {
  const words = name.trim().split(" ").slice(0, 2);
  return words.map((word) => word.charAt(0).toUpperCase()).join("");
};

export const extractTextFromPTags = (htmlString) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  const textContents = Array.from(tempDiv.querySelectorAll("p")).map((pTag) => {
    return pTag.textContent.trim();
  });

  return textContents.join(" ");
};

export const extractFirstImageSrc = (htmlString) => {
  const imgSrcRegex = /<img[^>]+src="([^">]+)"/i; 
  const match = htmlString.match(imgSrcRegex);
  return match ? match[1] : null;
};

export const hasInvalidFontSizes = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const paragraphs = doc.querySelectorAll("p");

  for (const p of paragraphs) {
    const childNodes = Array.from(p.childNodes);
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "SPAN") {
        const hasTextBefore =
          i > 0 &&
          childNodes[i - 1].nodeType === Node.TEXT_NODE &&
          childNodes[i - 1].nodeValue.trim() !== "";

        const hasTextAfter =
          i < childNodes.length - 1 &&
          childNodes[i + 1].nodeType === Node.TEXT_NODE &&
          childNodes[i + 1].nodeValue.trim() !== "";

        if (hasTextBefore || hasTextAfter) {
          return true;
        }
      }
    }
  }
  return false;
};