import { /*React*/ useEffect, useState } from "react";
import { BASE_URL } from "../../constants";
import { Book, Review, User, UserData } from "../../types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import Card from "react-bootstrap/Card";
import "./Home.css";
import StarRating from "../../components/Navbar/starsRating";
import { api } from "../../utilities/api";
import { AddEditBook } from "../../components/AddEditBook";
import { getUserImage } from "../../utilities/auth";

export const Home = ({ user }: { user: User }) => {
  const isAuthor = user?.role === "author";
  const isAdmin = user?.role === "admin";

  const [books, setBooks] = useState<Book[]>([]);
  const [reviews, setReview] = useState<Review[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(
    null
  );
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editedReview, setEditedReview] = useState<Review | null>(null);
  const [showAddEditBook, setShowAddEditBook] = useState(false);
  const [deleteReview, setDeleteReview] = useState(false);

  const closeAddEditBook = () => {
    fetchBooks();
    setShowAddEditBook(false);
  };

  function fetchBooks() {
    fetch(`${BASE_URL}/book`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
      });
  }

  function fetchReviews() {
    fetch(`${BASE_URL}/review`)
      .then((res) => res.json())
      .then((data) => {
        setReview(data);
      });
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBookClick = async (book: Book) => {
    setSelectedBookId(book._id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchBooks();
  };

  const handleReviewSubmit = async () => {
    if (!selectedBookId) return;
    await api.addNewComment(selectedBookId, comment);
    fetchBooks();
  };

  const handleUpdateReview = async () => {
    if (!editedReview?._id) return;
    await api.updateReview(editedReview._id, editedReview.text);
    fetchBooks();
    setEditedReview(null);
  };

  const handleEditBook = async (book: Book) => {
    setSelectedBookId(book._id);
    setShowAddEditBook(true);
  };

  const handleAddBook = async () => {
    setSelectedBookId(null);
    setShowAddEditBook(true);
  };

  const handleDeleteReview = async (review: Review) => {
    setSelectedReviewId(review._id);
    console.log("review", review);
    const response = await api.deleteReview(review._id);
    console.log("response", response);
    setDeleteReview(false);
    fetchBooks();
    fetchReviews();
  };

  const handleDeleteBook = async (book: Book) => {
    console.log("book", book);
    setSelectedBookId(book._id);
    await api.deleteBook(book._id);

    setShowModal(false);
    fetchBooks();
  };

  const selectedBook = books.find((book) => book._id === selectedBookId);

  const selectedReview = reviews.find((review) => review._id === selectedReviewId);
  console.log("selectedReview", selectedReview);

  return (
    <div className="home-container">
      <div>
        {(isAuthor || isAdmin) && (
          <Button onClick={handleAddBook}>Add a book</Button>
        )}
      </div>
      <div className="book-grid-container"
      style={{
        display:"grid",
         gridTemplateColumns: "repeat(3, 1fr)",
          gridRowGap: "40px",
          gridColumnGap: "40px",
         gap: "40px",
        
      }}
      >
        {books.map((book) => (
          <div key={book._id} className="book-grid-item"
          style={{
            display:"grid",
             gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
             msGridColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          }}
          >
          
            <Card
             className="book-card"
              onClick={() => handleBookClick(book)}
              style={{
                backgroundColor: "white",
                boxShadow: "0 5px 2px rgba(0, 0, 0, 5.1)",
                borderRadius: "6px",
                
              }}
            >
              <Card.Img className="book-image"
                variant="top"
                src={`${BASE_URL}/static/books/${book.image}`}
                alt={book.name}
                style={{
                  width: "220px",
                  height: "270px",
                  borderRadius: "2px",
                }}
              />
              <Card.Body style={{ boxShadow: "revert" }}>
                <Card.Title>{book.name}</Card.Title>
                <Card.Text>
                  <FontAwesomeIcon icon={faComments} /> {book.reviews?.length}{" "}
                  Comments
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="custom-modal"
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>{selectedBook?.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-dark text-white">
          <div className="row">
            <div className="col-md-6">
              <img
                src={`${BASE_URL}/static/books/${selectedBook?.image}`}
                alt={selectedBook?.name}
                style={{ width: "100%", height: "auto", borderRadius: "4px" }}
              />
            </div>
            <div className="col-md-6">
              <h4>Details</h4>
              <p>Year: {selectedBook?.year}</p>
              <p>Pages: {selectedBook?.pages}</p>
              <p>Price: {selectedBook?.price}</p>
              <p>
                Rating: <StarRating rating={selectedBook?.rating || 0} />
              </p>
              <p>Category: {selectedBook?.category}</p>
              <p>Summary: {selectedBook?.summary}</p>
            </div>

            <div className="comment-input-form">
              <h4>Comments</h4>
              <div className="reviews-container">
                {selectedBook?.reviews.map((review) => {
                  const reviewingUser = review.reviewerId;

                  return (
                    <div key={review._id} className="reviews-panel">
                      <div className="review-image">
                        <img
                          src={getUserImage(reviewingUser as UserData)}
                          alt="avatar"
                        />
                      </div>
                      <div>
                        <div className="comment-details">
                          <p className="name">{review.reviewerId.name}</p>
                          <p className="review"> {review.text}</p>
                          <p className="date"> {review.updatedAt}</p>
                        </div>
                      </div>
                      <div style={{ flex: 1 }}></div>
                      <div>
                        {(user?._id === review.reviewerId._id || isAdmin) && (
                          <Button onClick={() => setEditedReview(review)}>
                            Edit
                          </Button>
                        )}
                      </div>
                      <div>
                        {(user?._id === review.reviewerId._id || isAdmin) && (
                          <Button onClick={() => setDeleteReview(true)}>
                            Delete
                            <Modal
                              show={deleteReview}
                              onHide={() => setDeleteReview(false)}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Delete Review</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure you want to delete this review?
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={() => setDeleteReview(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="primary"
                                  onClick={() => handleDeleteReview(review!)}
                                >
                                  Delete
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {editedReview ? (
                <>
                  <textarea
                    rows={3}
                    value={editedReview.text}
                    onChange={(e) =>
                      setEditedReview((prev) => ({
                        ...(prev as Review),
                        text: e.target.value,
                      }))
                    }
                  />
                  <Button variant="primary" onClick={handleUpdateReview}>
                    Update
                  </Button>
                </>
              ) : (
                <>
                  <textarea
                    placeholder="Add your comment..."
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button variant="primary" onClick={handleReviewSubmit}>
                    Comment
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-dark text-white">
          <div>
            {(user?._id === selectedBook?.author || isAdmin) && (
              <Button onClick={() => handleEditBook(selectedBook!)}>
                Edit
              </Button>
            )}
          </div>
          <div>
            {(isAuthor || isAdmin) && (
              <Button onClick={() => handleDeleteBook(selectedBook!)}>
                Delete
              </Button>
            )}
          </div>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <AddEditBook
        onClose={closeAddEditBook}
        show={showAddEditBook}
        selectedBook={selectedBook}
      />
    </div>
  );
};
