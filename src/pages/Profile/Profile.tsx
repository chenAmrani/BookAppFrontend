import React, {useEffect, useState } from "react";
import { Book, User } from "../../types";
import "./Profile.css";
import { BASE_URL } from "../../constants";
import { api } from "../../utilities/api";
// import { getUserBooks , getBookById} from "../../utilities/books";
// import { ObjectId } from "mongoose";
// import { getUserBooks } from "../../utilities/books";
interface UserProfileProps {
  user: User;
  setUser: (user: User) => void;
}

// const res = await getUserBooks();
// console.log("the profile books", res.myBooks);

const UserProfile: React.FC<UserProfileProps> = ({ user, setUser }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatedName, setUpdatedName] = useState(user?.name || "");
  const [updatedImage, setUpdatedImage] = useState<File | null>(null);
  const [updatedEmail, setUpdatedEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [profileBooks, setProfileBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchProfileBooks = async () => {
      try {
        const res = await api.getUserBooks();
        console.log("the profile books", res.myBooks);
       

        const bookPromises = res.myBooks.map(async (bookId: string) => {
          try{
          const book = await api.getBookById(bookId);
          console.log("the book", book);
          return book;
          }
          catch (error) {
          console.error("Error fetching book:", error);
          return null;
        }});

        const books = await Promise.all(bookPromises);
        console.log("the books", books);
        setProfileBooks(books);
      } catch (error) {
        console.error("Error fetching profile books:", error);
      }
    };

    fetchProfileBooks();
  }, []); 



 
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

    const updatedUser = await response.json();
    console.log("Updated User Data:", updatedUser);


    setShowUpdateForm(false);
    setUser(updatedUser);
  };
  const handleBookEdit = (bookId: string) => {
    // Redirect to book editing page or open a modal for book editing
    console.log("Edit book with ID:", bookId);
  };

  const handleBookDelete = async (bookId: string) => {
    try {
      await api.deleteBook(bookId);
      const updatedBooks = profileBooks.filter((book) => book._id !== bookId);
      setProfileBooks(updatedBooks);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
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
          {user.role === "author" && profileBooks.length > 0 && (
            <div className="user-books-section">
              <h2>Your Books</h2>
              <div className="books-container">
                {profileBooks.map((book) => (
                  <div key={book._id} className="book-item">
                    <img
                      src={`${BASE_URL}/static/books/${book.image}`}
                      alt="Book Cover"
                      style={{ width: "150px", height: "200px", borderRadius: "4px" }}
                      className="book-image"
                      onClick={() => handleBookEdit(book._id)}
                    />
                    <button onClick={() => handleBookEdit(book._id)}>Edit</button>
                    <button onClick={() => handleBookDelete(book._id)}>Delete</button>
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
