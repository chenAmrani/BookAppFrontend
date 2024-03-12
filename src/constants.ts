export const BASE_URL = process.env.NODE_ENV === 'production' ? "https://node56.cs.colman.ac.il": "http://localhost:6969";
export const STATIC_ASSETS_URL = BASE_URL + "/static/uploads/";
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
