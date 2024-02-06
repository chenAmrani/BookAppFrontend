import { AxiosResponse } from "axios";
import { ACCESS_TOKEN_KEY, BASE_URL, REFRESH_TOKEN_KEY } from "../constants";
import apiClient from "./api-client";
import decodeToken from "./auth";



const makeRequest = async (request: () => Promise<AxiosResponse>) => {
  const response = await request();

  if (response.status === 401) {
    const error = response.data.error;
    if (error === "jwt expired") {
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
  return response;
};

const getReviewsByBookId = async (bookId: string) => {
  const response = await fetch(`${BASE_URL}/review/book/${bookId}`);
  return response;
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
  //לבדוק מה לשים בתוך הפרומיס
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      reject(new Error("No token available"));
      return;
    }

    const decodedToken = decodeToken(token);
    console.log("the decoded token", decodedToken);
    if (!decodedToken || !decodedToken._id) {
      reject(new Error("Unable to extract user ID from token"));
      return;
    }

    const userId = decodedToken._id;

    apiClient
      .get(`/user/ownBooks/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        resolve(response.data);
        console.log("the response", response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getBookById = (bookId: string) => {
  return new Promise((resolve, reject) => {
    apiClient
      .get(`/book/${bookId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteReview = (bookId: string) => {
  return new Promise((resolve, reject) => {
    apiClient
      .delete(`/review/${bookId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


const updateBook = (bookId: string, bookData: FormData) => {

  console.log("the image", bookData.get("image"))
  const updateBook = {
    name: bookData.get("name"),
    summary: bookData.get("summary"),
    year: bookData.get("year"),
    pages: bookData.get("pages"),
    price: bookData.get("price"),
    rating: bookData.get("rating"),
    category: bookData.get("category"),
    author: bookData.get("author"),
  }
  return new Promise((resolve, reject) => {
    apiClient
      .put(`/book/updateOwnBook/${bookId}`, updateBook, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateUserImage = (image: File) => {
  return new Promise<string>((resolve, reject) => {
    const formData = new FormData();
    formData.append("avatar", image);
    apiClient
      .post("/static/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteBook = (bookId: string) => {
  return new Promise((resolve, reject) => {
    apiClient
      .delete(`/book/${bookId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
    });
  };  





export const api = {
  addNewComment,
  getReviewsByBookId,
  updateReview,
  updateUserProfile,
  getUserBooks,
  getBookById,
  deleteReview,
  updateBook,
  updateUserImage,
  deleteBook
  
};
