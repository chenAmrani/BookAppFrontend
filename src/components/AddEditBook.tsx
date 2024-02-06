import { Button, Form, Modal } from "react-bootstrap";
import { Book } from "../types";
import { useRef, useState } from "react";
import apiClient from "../utilities/api-client";

export const AddEditBook = ({
  onClose,
  show,
  selectedBook,
}: {
  onClose: () => void;
  show: boolean;
  selectedBook?: Book;
}) => {
  const isEditing = Boolean(selectedBook);

  const [name, setName] = useState(selectedBook?.name || "");
  const [year, setYear] = useState(selectedBook?.year || "");
  const imageRef = useRef<HTMLInputElement>(null);
  const [pages, setPages] = useState(selectedBook?.pages || "");
  const [price, setPrice] = useState(selectedBook?.price || "");
  const [rating, setRating] = useState(selectedBook?.rating || "");
  const [category, setCategory] = useState(selectedBook?.category || "");
  const [summary, setSummary] = useState(selectedBook?.summary || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isEditing && !imageRef.current?.files?.length) {
      return alert("Please add an image");
    }

    const image = imageRef.current!.files![0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("year", year.toString());
    formData.append("pages", pages.toString());
    formData.append("price", price.toString());
    formData.append("rating", rating.toString());
    formData.append("category", category);
    formData.append("summary", summary);
    formData.append("image", image);

    const token = localStorage.getItem("accessToken");

    const response = await apiClient.post("/book", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status !== 201) {
      return alert("Failed to add book");
    }

    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} className="custom-modal">
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>{isEditing ? "Edit" : "Add"} book</Modal.Title>
      </Modal.Header>

      <form onSubmit={handleSubmit}>
        <Modal.Body className="bg-dark text-white">
          <div className="row p-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="number"
              placeholder="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <Form.Label>Upload image</Form.Label>
            <Form.Control type="file" ref={imageRef} />
            <Form.Label>Pages amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Pages"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
            />
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              placeholder="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <Form.Label>Summary</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-dark text-white">
          <Button variant="primary" type="submit">
            Save
          </Button>

          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
