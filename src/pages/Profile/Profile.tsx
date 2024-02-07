import React, { useEffect, useState } from "react";
import { Book, User } from "../../types";
import "./Profile.css";
import { BASE_URL } from "../../constants";
import { api } from "../../utilities/api";
import { getUserImage } from "../../utilities/auth";

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
  const [profileBooks, setProfileBooks] = useState<Book[]>([]);
  const [profileUsers, setProfileUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchProfileBooks = async () => {
      try {
        const res = await api.getUserBooks() as { myBooks: string[] };
        const bookPromises = res.myBooks.map(async (bookId: string) => {
          try {
            const book = await api.getBookById(bookId);
            console.log("the book", book);
            return book;
          } catch (error) {
            console.error("Error fetching book:", error);
            return null;
          }
        });

        const books = await Promise.all(bookPromises);
        console.log("the books", books);
        setProfileBooks(books as Book[]);
      } catch (error) {
        console.error("Error fetching profile books:", error);
      }
    };

    fetchProfileBooks();
  }, []);


  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await api.getAllUsers() as { users: User[] }; 
        console.log("the res!!", res);
        
        // Create an object to map users by their IDs
        const usersById: { [key: string]: User } = {};
        res.users.forEach(user => {
          usersById[user!._id] = user;
        });

        const usersArray = Object.values(usersById);
        setProfileUsers(usersArray);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };
  
    fetchAllUsers();
  }, []);
  
  const handleDeleteUserByAdmin = async (userId: string | undefined) => {
    if (userId) {
      const response = await api.deleteUserByAdmin(userId);
      console.log("Delete User Response:", response);
      const updatedUsers = profileUsers.filter(user => user?._id !== userId);
      setProfileUsers(updatedUsers);
    }
  };
const handleDeleteAccount = async (userId: string) => {
  const response = await api.deleteUser(userId);
  console.log("Delete User Response:", response);
  setUser(null);
}

  const handleUpdateClick = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedName(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      console.log("the file", file);
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
      console.log("Updated Image:", updatedImage);
      formData.append("image", updatedImage);
    }

    formData.append("id", user?._id || "");
    const response = await api.updateUserProfile(formData);

    const updatedUser = await response.json();
    console.log("Updated User Data:", updatedUser);

    setShowUpdateForm(false);
    setUser(updatedUser);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="user-profile-container">
      <h1 style={{ paddingBottom: "40px" }}>My Profile</h1>
      <>
        <p>
          <img src={getUserImage(user)} alt="User Avatar" />
        </p>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        {user.role === "author" && profileBooks.length > 0 && (
          <div className="user-books-section">
            <h2>Your Books</h2>
            <div className="books-container">
              {profileBooks.map((book) => (
                <div key={book._id} className="book-item">
                  <img
                    src={`${BASE_URL}/static/books/${book.image}`}
                    alt="Book Cover"
                    style={{
                      width: "150px",
                      height: "200px",
                      borderRadius: "4px",
                    }}
                    className="book-image"
                  />
                </div>
              ))}
            </div>
          </div>
          
        )}
           <div>
              <button onClick={()=> handleDeleteAccount(user?._id)}>Delete my account</button>
        </div>

{(user.role === "admin" && profileUsers.length > 0) && (
  <div className="user-user-section">
    <h2>All Users</h2>
    <table className="user-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Image</th>
          <th>Action</th> {/* New column for delete button */}
        </tr>
      </thead>
      <tbody>
        {profileUsers.map((user) => (
          <tr key={user?._id}>
            <td>{user?.name}</td>
            <td>{user?.email}</td>
            <td>{user?.role}</td>
            <td>
              <img
                src={getUserImage(user!)} alt="User Avatar"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "4px",
                }}
                className="user-image"
              />
            </td>
            <td>
              <button onClick={() => handleDeleteUserByAdmin(user?._id)}>Delete</button>
           
            </td>
          </tr>
          
        ))}
      </tbody>
    </table>
  </div>
)}
        <div>
        <button onClick={handleUpdateClick}>Update Details</button>
        </div>
        

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
      
    </div>
  );
};

export default UserProfile;
