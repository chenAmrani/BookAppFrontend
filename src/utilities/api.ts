import { ACCESS_TOKEN_KEY, BASE_URL } from "../constants";
import { Book } from "../types";
import apiClient from './api-client';
import decodeToken from './auth';

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

const getUserBooks = () => {
  return new Promise((resolve, reject) => {
      const token = localStorage.getItem('accessToken'); 
      if (!token) {
          reject(new Error('No token available'));
          return;
      }

      const decodedToken = decodeToken(token);
      console.log("the decoded token" , decodedToken)
      if (!decodedToken || !decodedToken._id) {
          reject(new Error('Unable to extract user ID from token'));
          return;
      }
    
      const userId = decodedToken._id;

      apiClient.get(`/user/ownBooks/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => {
              resolve(response.data);
              console.log("the response" , response)
          })
          .catch((error) => {
              reject(error);
          });
  });
};

const getBookById = (bookId: string) => {
  return new Promise((resolve, reject) => {
      apiClient.get(`/book/${bookId}`)
          .then((response) => {
              resolve(response.data);
          })
          .catch((error) => {
              reject(error);
          });
  });
}

const deleteBook = (bookId: string) => {
  return new Promise((resolve, reject) => {
      apiClient.delete(`/book/${bookId}`, { headers: { Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}` } })
          .then((response) => {
              resolve(response.data);
          })
          .catch((error) => {
              reject(error);
          });
  });
}

const updateBook = (bookId: string, bookData: Book) => {
  return new Promise((resolve, reject) => {
      apiClient.put(`/book/updateOwnBook/${bookId}`, bookData, { headers: { Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}` } })
          .then((response) => {
              resolve(response.data);
          })
          .catch((error) => {
              reject(error);
          });
  });
}

export const api = {
  addNewComment,
  getReviewsByBookId,
  updateReview,
  updateUserProfile,
  getUserBooks,
  getBookById,
  deleteBook,
  updateBook,
};
