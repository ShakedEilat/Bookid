import api from "./authService";
// Fetch all books

export const getAllBooks = async () => {
  try {
    const response = await api.get("/books");
    return response.data;
  } catch (error) {
    console.error("Error fetching all books:", error);
    return [];
  }
};

// Fetch a single book by ID
export const getBookById = async (id) => {
  try {
    const response = await api.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return {};
  }
};
// Create a new book
export const createBook = async (childProfileId, pages) => {
  try {
    const response = await api.post("/books", { childProfileId, pages });
    return response.data;
  } catch (error) {
    console.error("Error creating new book:", error);
    return {};
  }
};

// Update an existing book
export const updateBook = async (id, data) => {
  try {
    const response = await api.put(`/books/${id}`, data);
    if (!response.data) {
      throw new Error("No data received when updating a book");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating a book:", error);
    throw error;
  }
};