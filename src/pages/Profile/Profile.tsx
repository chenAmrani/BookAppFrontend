import React, { useState } from "react";
import { Book, User } from "../../types";
import "./Profile.css";
import { BASE_URL } from "../../constants";

interface UserProfileProps {
  userData: User;
  setUser: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatedName, setUpdatedName] = useState(userData?.name || "");
  const [updatedImage, setUpdatedImage] = useState<File | null>(null);

  const handleUpdateClick = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedName(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setUpdatedImage(file);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", updatedName);
    formData.append("image", updatedImage? updatedImage :" ");

    
    const response = await fetch(`${BASE_URL}/api/update-profile`, {
      method: "POST",
      body: formData,
    });

    // Handle the response accordingly (display a success message, update the user data, etc.)
    const updatedUserData = await response.json();
    console.log("Updated User Data:", updatedUserData);

    // Close the update form
    setShowUpdateForm(false);
  };

  return (
    <div className="user-profile-container">
      <h1 style={{ paddingBottom: "40px" }}>My Profile</h1>

      {userData ? (
        <>
          {/* <p>
            <img
              src={`${BASE_URL}/static/${userData.userData.image}`}
              alt="User Avatar"
            />
          </p> */}
          <p>Name: {userData.userData.name}</p>
          <p>Email: {userData.userData.email}</p>
          {userData.userData.role === "author" && (
            <p>Books: {userData.userData.books?.map((book: Book) => book.name).join(", ")}</p>
          )}
          <button onClick={handleUpdateClick}>Update Details</button>

          {showUpdateForm && (
            <form onSubmit={handleUpdateSubmit}>
              <label style={{paddingTop:"30px" , paddingRight:"200px"}}>
                New Name:
                <input
                style={{width:"150px", marginLeft:"20px"}}
                  type="text"
                  value={updatedName}
                  onChange={handleNameChange}
                />
              </label>

              <label style={{paddingTop:"30px" , paddingRight:"120px"}}>
                New Image:
                <input
                style={{width:"150px", marginLeft:"30px", color:"white"}}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
