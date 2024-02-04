import { User } from '../types';
// import { BASE_URL } from './../constants';
import { CredentialResponse } from "@react-oauth/google";
import apiClient from './api-client';


// export const googleSignin = (credentialResponse: CredentialResponse) => {
//     return fetch(`${BASE_URL}/auth/google`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(credentialResponse),
//     }); 
// }

export const googleSignin = (credentialResponse: CredentialResponse) => {
    
    return new Promise<User>((resolve, reject) => {
        console.log("googleSignIn ...")
        apiClient.post("/auth/google",credentialResponse).then((response) => {
            console.log("the response" , response)
            resolve(response.data)
            apiClient.post("/static/upload", {
                method: "POST",
                body: response.data.image
            });
            console.log("the response" , response.data.image)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
    
}