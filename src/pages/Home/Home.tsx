import { useEffect, useState } from "react";
import { BASE_URL } from "../../constants";
import { Book } from "../../types";

export const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/book`)
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  return (
    <div>
      <h1>Home</h1>

      <div>
        {books.map((book) => (
          <div key={book._id}>
            <h2>{book.name}</h2>
            <div>
              <img
                src={`${book.image}`}
                alt={book.name}
                style={{ width: "200px" }}
              />
            </div>
            <p>{book.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
