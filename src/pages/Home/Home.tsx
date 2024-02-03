import /*React*/ { useEffect, useState } from "react";
import { BASE_URL, STATIC_ASSETS_URL } from "../../constants";
import { Book /*Review*/, Review, User } from "../../types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import Card from "react-bootstrap/Card";
import "./Home.css";
import StarRating from "../../components/Navbar/starsRating";
import { api } from "../../utilities/api";

export const Home = ({ user }: { user: User }) => {
  console.log("user", user);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedBookReviews, setSelectedBookReviews] = useState<Review[]>([]);
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editedReview, setEditedReview] = useState<Review | null>(null);

  function fetchBooks() {
    fetch(`${BASE_URL}/book`)
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchReviewByBookId(id: string) {
    const response = await api.getReviewsByBookId(id);
    const reviews = await response.json();
    setSelectedBookReviews(reviews);
  }

  const handleBookClick = async (book: Book) => {
    setSelectedBook(book);
    setShowModal(true);
    await fetchReviewByBookId(book._id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleReviewSubmit = async () => {
    console.log("comment", comment);
    if (!selectedBook?._id) return;
    await api.addNewComment(selectedBook._id, comment);
    fetchBooks();
    await fetchReviewByBookId(selectedBook._id);
  };

  const handleUpdateReview = async () => {
    if (!editedReview?._id) return;
    await api.updateReview(editedReview._id, editedReview.text);
    fetchBooks();
    await fetchReviewByBookId(selectedBook!._id);
    setEditedReview(null);
  };

  return (
    <div className="home-container" style={{ marginTop: "-100px" }}>
      <div className="row row-cols-3" style={{ marginTop: "80px" }}>
        {books.map((book) => (
          <div key={book._id} className="col">
            <Card
              onClick={() => handleBookClick(book)}
              style={{
                backgroundColor: "",
                boxShadow: "0 5px 2px rgba(0, 0, 0, 5.1)",
                borderRadius: "6px",
              }}
            >
              <Card.Img
                variant="top"
                src={book.image}
                alt={book.name}
                style={{ width: "200px", height: "300px", borderRadius: "4px" }}
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
                src={selectedBook?.image}
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
                {selectedBookReviews.map((review) => {
                  console.log("review", review);
                  return (
                    <div key={review._id} className="reviews-panel">
                      <div className="review-image">
                        <img
                          src={STATIC_ASSETS_URL + review.reviewerId.image}
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
                        {user?._id === review.reviewerId._id && (
                          <Button onClick={() => setEditedReview(review)}>
                            Edit
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
                    // You can use state to handle the new comment input
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
                    // You can use state to handle the new comment input
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
