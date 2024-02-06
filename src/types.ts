export type Role = "reader" | "author" | "admin";

export interface Book {
  author: string;
  category: string;
  image: string;
  name: string;
  pages: number;
  price: number;
  rating: number;
  reviews: Review[];
  summary: string;
  year: number;
  _id: string;
}

export interface UserData {
  image?: string;
  books: Book[];
  email: string;
  name: string;
  accessToken?: string;
  role: Role;
  _id: string;
  isGoogleSsoUser: boolean;
}

export interface Review {
  _id: string;
  text: string;
  reviewerId: {
    name: string;
    image: string;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type User = UserData | null;
