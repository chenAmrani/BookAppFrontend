import React, { useEffect, useState } from "react";
import { Book, User } from "../../types";
import "./Profile.css";
import { BASE_URL } from "../../constants";
import { api } from "../../utilities/api";

interface UserProfileProps {
  user: User;
  setUser: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, setUser }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatedName, setUpdatedName] = useState(user?.name || "");
  const [updatedImage, setUpdatedImage] = useState<File | null>(null);
  const [updatedEmail, setUpdatedEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [userBooks, setUserBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchUserBooks = async () => {
      if (user?.role === "author") {
        try {
          const response = await api.getUserBooks(user._id || "");
          const books = await response.json();
          setUserBooks(books);
        } catch (error) {
          console.error("Error fetching user books:", error);
        }
      }
    };

    fetchUserBooks();
  }, [user]);

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
    if (user?.name !== updatedName) {
      formData.append("name", updatedName);
    }

    if (user?.email !== updatedEmail) {
      formData.append("email", updatedEmail);
    }

    if (password) {
      formData.append("password", password);
    }

    if (updatedImage) {
      formData.append("image", updatedImage);
    }

    formData.append("id", user?._id || "");

    const response = await api.updateUserProfile(formData);

    // Handle the response accordingly (display a success message, update the user data, etc.)
    const updatedUser = await response.json();
    console.log("Updated User Data:", updatedUser);

    // Close the update form
    setShowUpdateForm(false);
    setUser(updatedUser);
  };

  return (
    <div className="user-profile-container">
      <h1 style={{ paddingBottom: "40px" }}>My Profile</h1>

      {user ? (
        <>
          <p>
            <img
              src={`${BASE_URL}/static/uploads/${user.image}`}
              alt="User Avatar"
            />
          </p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          {user.role === "author" && userBooks.length > 0 && (
          <div className="user-books-section">
            <h2>Your Books</h2>
            <div className="user-books-list">
              {userBooks.map((book) => (
                <div key={book._id} className="book-item">
                  <img src={book.image} alt={book.name} />
                  <p>{book.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={handleUpdateClick}>Update Details</button>

          {showUpdateForm && (
            <form onSubmit={handleUpdateSubmit}>
              <label style={{ paddingTop: "30px", paddingRight: "200px" }}>
                Name:
                <input
                  style={{ width: "150px", marginLeft: "20px" }}
                  type="text"
                  value={updatedName}
                  onChange={handleNameChange}
                />
              </label>

              <label style={{ paddingTop: "30px", paddingRight: "200px" }}>
                Email:
                <input
                  style={{ width: "150px", marginLeft: "20px" }}
                  type="text"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                />
              </label>

              <label style={{ paddingTop: "30px", paddingRight: "200px" }}>
                New password:
                <input
                  style={{ width: "150px", marginLeft: "20px" }}
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <label style={{ paddingTop: "30px", paddingRight: "120px" }}>
                New Image:
                <input
                  style={{ width: "150px", marginLeft: "30px", color: "white" }}
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
