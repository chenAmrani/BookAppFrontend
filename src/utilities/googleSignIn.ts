import { User } from '../types';
import { CredentialResponse } from "@react-oauth/google";
import apiClient from './api-client';



export const googleSignin = (credentialResponse: CredentialResponse) => {
    
    return new Promise<User>((resolve, reject) => {
        console.log("googleSignIn ...")
        apiClient.post("/auth/google",credentialResponse).then((response) => {
            console.log("the response" , response)
            resolve(response.data)
            console.log("the image" , response.data.image)
            UserImage(response.data.image);
            console.log("the response" , response.data.image)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}

export const UserImage = (image: File) => {
    return new Promise<string>((resolve, reject) => {
        const formData = new FormData();
        formData.append('avatar', image);
        apiClient.post('/static/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
  }
  

