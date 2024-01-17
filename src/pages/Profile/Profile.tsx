import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../constants";
import { User } from "../../types";

const UserProfile = ({ user }: { user: User }) => {
  const [userData, setUserData] = useState<User | null>(null);


  useEffect(() => {
    if (user?._id) {
      fetch(`${BASE_URL}/user/${user._id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data); // Log the data received from the server
          setUserData(data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [user?._id, user]);
  
  if (!userData) {
    return <div>Loading...</div>;
  }
    return (
        <div>
            <h1>User Profile:</h1>
            <p>Username: {userData.name}</p>
            <p>Email: {userData.email}</p>
            <p>Role: {userData.role}</p>
            <img src={userData.image} alt="User" style={{ width: "200px" }} />
        </div>
    );
};

export default UserProfile;