import { User } from '../types';
import { CredentialResponse } from "@react-oauth/google";
import apiClient from './api-client';
import axios from 'axios';
import fs from 'fs';



export const googleSignin = (credentialResponse: CredentialResponse) => {
    
    return new Promise<User>((resolve, reject) => {
        console.log("googleSignIn ...")
        apiClient.post("/auth/google",credentialResponse).then((response) => {
            console.log("the response" , response)
            resolve(response.data)
            console.log("the response" , response.data.image)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}

export const uploadImage = (image: string) => {
    return new Promise<string>((resolve, reject) => {
        const formData = new FormData();
        formData.append('image', image);
        apiClient.post('/static/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export async function saveProfilePhoto(photoUrl: string) {
    try {
        // Download the photo from the URL
        const response = await axios.get(photoUrl, { responseType: 'arraybuffer' });

        // Save the photo to a file
        const photoFileName = `avatar.jpg`; // You can use userId or any unique identifier
        const photoPath = `static/uploads/${photoFileName}`; // Update with your server's directory
        fs.writeFileSync(photoPath, response.data);

        // Return the path to the saved photo
        return photoPath;
    } catch (error) {
        console.error('Error saving profile photo:', error);
        throw error;
    }
  }
  

