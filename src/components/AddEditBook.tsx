import { Button, Form, Modal } from "react-bootstrap";
import { Book, User } from "../types";
import { useRef, useState } from "react";
import apiClient from "../utilities/api-client";
import decodeToken from "../utilities/auth";
import { api } from "../utilities/api";

export const AddEditBook = ({
  onClose,
  show,
  selectedBook,
  user,
}: {
  onClose: () => void;
  show: boolean;
  user: User | null;
  selectedBook?: Book;
}) => {
  const isEditing = Boolean(selectedBook);
  console.log("selectedBook handel", selectedBook);

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

    // if adiing a new book, check if all fields are filled
    if (!isEditing) {
      if (
        !name.trim() ||
        !year.toString().trim() ||
        !(pages.toString().trim()) ||
        !price.toString().trim() ||
        !rating.toString().trim() ||
        !category.trim() ||
        !summary.trim()
      ) {
        return alert("Please fill in all fields");
      }
    }

    const yearNumber = Number(year);
    if (yearNumber < 0 || yearNumber > 2024 && name.trim() !== "") {
      return alert("Please enter a valid year between 0 and 2024.");
    }
  
   
    if (typeof pages === 'string' && Number(pages) <= 0 && pages.trim() !== "") {
      return alert("Please enter a valid number of pages.");
    }

    if (typeof price === 'string' && Number(price) <= 0 && price.trim() !== "") {
      return alert("Please enter a price greater than 0.");
    }
  
    const ratingNumber = Number(rating);
    if (ratingNumber < 0 || ratingNumber > 5 && String(rating).trim() !== "") {
      return alert("Please enter a valid rating between 0 and 5.");
    }

    if (!isEditing && !imageRef.current?.files?.length) {
      return alert("Please add an image");
    }

    const image = imageRef.current!.files![0];
    console.log("image", image);
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("year", year.toString());
    formData.append("pages", pages.toString());
    formData.append("price", price.toString());
    formData.append("rating", rating.toString());
    formData.append("category", category);
    formData.append("summary", summary);
    if (image) {
      formData.append("image", image);
    }
    console.log("image update book", image);
    formData.append("author", decodeToken(token!)._id);

    if (!selectedBook) {
      if (user?.role === "author") {
        const response = await apiClient.post("/book", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 201) {
          return alert("Failed to add book");
        }
      } else if (user?.role === "admin") {
        const response = await apiClient.post("/book/admin", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status !== 201) {
          return alert("Failed to add book");
        }
      }
    } else {
      if (user?.role === "author") {
        await api.updateBookByAuthor(selectedBook._id, formData);
      } else if (user?.role === "admin") {
        await api.updateBookByAdmin(selectedBook._id, formData);
      }
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
