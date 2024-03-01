import { AxiosError, AxiosResponse } from "axios";
import { ACCESS_TOKEN_KEY, BASE_URL, REFRESH_TOKEN_KEY } from "../constants";
import apiClient from "./api-client";

const makeRequest = async (request: () => Promise<AxiosResponse>) => {
  console.log(1);
  try {
    const response = await request();
    return response;
  } catch (axiosError: unknown) {
    if (axiosError instanceof AxiosError && axiosError.response) {
      console.log("error!!", axiosError);
      console.log(2);

      if (axiosError.response.status === 401) {
        const error = axiosError.response.data.error;
        if (error === "Token is expired") {
          const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
          if (!refreshToken) {
            throw new Error("Authentication expired, please login again");
          }

          const refreshResponse = await apiClient.post(`/auth/refresh`, {
            refreshToken,
          });

          if (refreshResponse.status === 200) {
            localStorage.setItem(
              ACCESS_TOKEN_KEY,
              refreshResponse.data.accessToken
            );
            return request();
          }
        }
      }
    }
  }
};

const getReviewsByBookId = async (bookId: string) => {
  const request = () => {
    return apiClient.get(`/review/book/${bookId}`);
  };
  return makeRequest(request);
};

const addNewComment = async (bookId: string, text: string) => {
  const request = () => {
    return apiClient.post(
      `${BASE_URL}/review`,
      { bookId, text },
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
      }
    );
  };

  const response = await makeRequest(request);
  return response;
};

const updateReview = async (reviewId: string, text: string) => {
  const request = () => {
    return apiClient.put(
      `${BASE_URL}/review`,
      { text, id: reviewId },
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
      }
    );
  };

  return makeRequest(request);
};

const updateUserProfile = async (formData: FormData) => {
  const request = () => {
    return apiClient.put("/user/updateOwnProfile", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      },
    });
  };
  return makeRequest(request);
};

const getUserBooks = (userId: string) => {
  const request = () => {
    return apiClient.get(`/user/ownBooks/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      },
    });
  };
  return makeRequest(request);
};

const getBookById = (bookId: string) => {
  const request = () => {
    return apiClient.get(`/book/${bookId}`);
  };
  return makeRequest(request);
};

const deleteReview = (bookId: string) => {
  const request = () => {
    return apiClient.delete(`/review/${bookId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      },
    });
  };
  return makeRequest(request);
};

const updateBookByAuthor = (bookId: string, bookData: FormData) => {
  console.log("bookData", bookData);
  const request = () => {
    return apiClient.put(`/book/updateOwnBook/${bookId}`, bookData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      },
    });
  };
  return makeRequest(request);
};

const updateBookByAdmin = (bookId: string, bookData: FormData) => {
  const request = () => {
    return apiClient.put(`/book/admin/update/${bookId}`, bookData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      },
    });
  };

  return makeRequest(request);
};

const updateUserImage = (image: File) => {
  const request = () => {
    const formData = new FormData();
    formData.append("avatar", image);
    return apiClient.post("/static/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  return makeRequest(request);
};

const deleteBook = (bookId: string) => {
  const request = () => {
    return apiClient.delete(`/book/${bookId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      },
    });
  };
  return makeRequest(request);
};

const getUserById = (userId: string) => {
  const request = () => {
    return apiClient.get(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      },
    });
  };
  return makeRequest(request);
};

const getAllUsers = () => {
  const request = () => {
    return apiClient.get(`/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      },
    });
  };
  return makeRequest(request);
};

const deleteUserByAdmin = (userId: string) => {
  const request = () => {
    return apiClient.delete(`/user/delete/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      },
    });
  };
  return makeRequest(request);
};

const deleteUser = (userId: string) => {
  const request = () => {
    return apiClient.delete(`/user/deleteMyOwnUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
      },
    });
  };
  return makeRequest(request);
};

export const api = {
  addNewComment,
  getReviewsByBookId,
  updateReview,
  updateUserProfile,
  getUserBooks,
  getBookById,
  deleteReview,
  updateBookByAdmin,
  updateBookByAuthor,
  updateUserImage,
  deleteBook,
  getUserById,
  getAllUsers,
  deleteUserByAdmin,
  deleteUser,
};
