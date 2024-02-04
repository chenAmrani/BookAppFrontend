export type Role = "reader" | "author";

export interface Book {
  author: string;
  category: string;
  image: string;
  name: string;
  pages: number;
  price: number;
  rating: number;
  reviews: Review[] | undefined;
  summary: string;
  year: number;
  _id: string;
}

export interface UserData {
  image?: string;
  books: Book[];
  email: string;
  name: string;
  accessToken?: string,
  refreshToken?: string
  role: Role;
  _id: string;

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
