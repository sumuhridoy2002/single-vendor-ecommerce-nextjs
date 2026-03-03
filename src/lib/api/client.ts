const getBaseUrl = () => {
  const url = "https://admin.beautycareskin.com/api/v1";
  return url.replace(/\/$/, "");
};

export { getBaseUrl };
