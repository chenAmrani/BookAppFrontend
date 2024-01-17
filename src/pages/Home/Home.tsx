import { useEffect, useState } from "react";
import { BASE_URL } from "../../constants";
import { Book } from "../../types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

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

  return (
    <div>
      <h1 style={{ marginBottom: "50px" }}>Home Page</h1>

      <div className="row row-cols-3">
        {books.map((book) => (
          <div key={book._id} className="col" onClick={() => handleBookClick(book)}>
            <div>
              <img
                src={`${book.image}`}
                alt={book.name}
                style={{ width: "200px", height: "300px", borderRadius: "4px" }}
              />
            </div>
            <h2 style={{ marginTop: "10px" }}>{book.name}</h2>
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
        <p>Year: {selectedBook?.year}</p>
        <p>Pages: {selectedBook?.pages}</p>
        <p>Price: {selectedBook?.price}</p>
        <p>Rating: {selectedBook?.rating}</p>
        <p>Category: {selectedBook?.category}</p>
        <p>Summary: {selectedBook?.summary}</p>
        <p>Reviews: {selectedBook?.reviews}</p>
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