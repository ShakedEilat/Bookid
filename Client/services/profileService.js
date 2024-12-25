import api from "./authService";

// Fetch all child profiles
export const getAllProfiles = async () => {
  try {
    const response = await api.get("/child_profiles");
    if (!response || !response.data) {
      throw new Error("Invalid response received when fetching child profiles");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching child profiles:", error);
    throw error;
  }
};

// Create a new child profile
export const createProfile = async (data) => {
  if (!data) {
    throw new Error("Data is required to create a child profile");
  }

  try {
    const response = await api.post("/child_profiles", data);
    if (!response || !response.data) {
      throw new Error("Invalid response received when creating a child profile");
    }
    return response.data;
  } catch (error) {
    console.error("Error creating a new child profile:", error);
    throw error; // Re-throw the error after logging it
  }
};

// Update an existing child profile
export const updateProfile = async (id, data) => {
  if (!id || !data) {
    throw new Error("Missing required parameters for updating a child profile");
  }

  try {
    const response = await api.put(`/child_profiles/${id}`, data);
    if (!response.data) {
      throw new Error("No data received when updating a child profile");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating a child profile:", error);
    throw error;
  }
};
