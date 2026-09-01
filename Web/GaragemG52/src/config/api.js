const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_BACK_URL || "http://localhost:8080";
  return baseUrl.replace(/\/$/, "");
};

const getRoboBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_ROBO_URL || "http://localhost:5000";
  return baseUrl.replace(/\/$/, "");
};

export { getApiBaseUrl, getRoboBaseUrl };
