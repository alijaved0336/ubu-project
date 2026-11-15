export const getRandomColor = () => {
  const letters = "89ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};

export const getUserType = (user) => {
  if (user.is_brand) {
    return "brand";
  } else if (user.is_influencer) {
    return "influencer";
  } else if (user.is_consumer) {
    return "consumer";
  } else {
    return "";
  }
};

export const getTotalWithdrawnAmount = (withdrawalsResponse) => {
  console.log("withdrawalsResponse", withdrawalsResponse);
  const data = withdrawalsResponse?.data ?? [];

  if (!Array.isArray(data)) return 0;

  return data.reduce((total, item) => {
    const amount = parseFloat(item?.amount || "0");

    const isSucceeded = item?.status === "succeeded";
    return total + (isSucceeded && !isNaN(amount) ? amount : 0);
  }, 0);
};
