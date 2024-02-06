import { User } from "../types";
import { CredentialResponse } from "@react-oauth/google";
import apiClient from "./api-client";

export const googleSignin = (credentialResponse: CredentialResponse) => {
  return new Promise<{
    userData: User;
    refreshToken: string;
    accessToken: string;
  }>((resolve, reject) => {
    console.log("googleSignIn ...");
    apiClient
      .post("/auth/google", credentialResponse)
      .then((response) => {
        console.log("the response", response);
        resolve(response.data);
        console.log("the image", response.data.image);
        // UserImage(response.data.image);
        console.log("the response", response.data.image);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

