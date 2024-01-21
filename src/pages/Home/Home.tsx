import { useEffect, useState } from "react";
import { BASE_URL } from "../../constants";
import { Book, /*Review*/ } from "../../types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import Card from "react-bootstrap/Card";
import "./Home.css";
import StarRating from "../../components/Navbar/starsRating";

export const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/book`)
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCommentSubmit = (newComment: string) => {
    // Handle submitting a new comment here, e.g., update the state or make an API call
    console.log("New Comment:", newComment);
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
                  <FontAwesomeIcon icon={faComments} /> {book.reviews?.length} Comments
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} className="custom-modal">
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
              <p>Rating: <StarRating rating={selectedBook?.rating || 0} className="star-rating" /></p>
              <p>Category: {selectedBook?.category}</p>
              <p>Summary: {selectedBook?.summary}</p>
              {/* <h4>Comments</h4>
              {selectedBook?.reviews?.map((review: Review) => (
                <div key={review._id} className="comment-panel">
                  <p>Name: {review.author}</p>
                  <div className="comment-details">
                    <p>Date: {review.date}</p>
                    <p>text: {review.text}</p>
                  </div>
                </div>
              ))} */}
              <div className="comment-input-form">
                <textarea
                  placeholder="Add your comment..."
                  rows={3}
                  // You can use state to handle the new comment input
                />
                <Button
                  variant="primary"
                  onClick={() => handleCommentSubmit("New comment text")}
                >
                  Comment
                </Button>
              </div>
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
