export type Role = "reader" | "author";

export interface Book {
  author: string;
  category: string;
  image: string;
  name: string;
  pages: number;
  price: number;
  rating: number;
  reviews: null;
  summary: string;
  year: number;
  _id: string;
}

export interface UserData {
  image: string;
  books: Book[];
  email: string;
  name: string;
  refreshTokens: string[];
  role: Role;
  _id: string;
}

export type User = UserData | null;
