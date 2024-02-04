import { ACCESS_TOKEN_KEY, BASE_URL } from "../constants";

const getReviewsByBookId = async (bookId: string) => {
  const response = await fetch(`${BASE_URL}/review/book/${bookId}`);
  return response;
};

const addNewComment = async (bookId: string, text: string) => {
  const response = await fetch(`${BASE_URL}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
    },
    body: JSON.stringify({ bookId, text }),
  });
  return response;
};

const updateReview = async (reviewId: string, text: string) => {
  const response = await fetch(`${BASE_URL}/review`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
    },
    body: JSON.stringify({ text, id: reviewId }),
  });
  return response;
};

const updateUserProfile = async (formData: FormData) => {
  return await fetch(`${BASE_URL}/user/updateOwnProfile`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
    },
  });
};
const getUserBooks = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/user/books/${userId}`);
  return response;
};

export const api = {
  addNewComment,
  getReviewsByBookId,
  updateReview,
  updateUserProfile,
  getUserBooks,
};
