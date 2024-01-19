export type Role = "reader" | "author";

export interface Book {
  author: string;
  category: string;
  image: string;
  name: string;
  pages: number;
  price: number;
  rating: number;
  reviews: string[]|undefined;
  summary: string;
  year: number;
  _id: string;
}

export interface UserData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  image: string;
  books: Book[];
  email: string;
  name: string;
  refreshTokens: string[];
  role: Role;
  _id: string;
}

export interface Review {
  BookName: string;
  Date: string;
  text: string;
      
  }
 

export type User = UserData | null;
