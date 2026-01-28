const API_BASE_URL = "http://localhost:3001";

export const fetchActiveService = async () => {
  const response = await fetch(`${API_BASE_URL}/activeService`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchRecentServices = async () => {
  const response = await fetch(`${API_BASE_URL}/recentServices`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchNearbyMechanics = async () => {
  const response = await fetch(`${API_BASE_URL}/nearbyMechanics`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
