import { useEffect, useState } from "react";
import api from "../api";
import "../styles/Home.css";
import ToDoItem from "../components/ToDoItem";

function Home() {
  const [todoItems, setTodoItems] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    getTodoItems();
  }, []);

  const getTodoItems = () => {
    api
      .get("/api/notes/")
      .then((response) => response.data)
      .then((data) => {
        setTodoItems(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteTodoItem = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((response) => {
        if (response.status === 204) {
          console.log("Note deleted");
        } else {
          console.error(response.data);
        }
        getTodoItems();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createTodoItem = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { title, content: content || "", completed: false })
      .then((response) => {
        console.log(response.data);
        if (response.status === 201) {
          console.log("Note created");
        } else {
          console.error(response.data);
        }
        getTodoItems();
        clearForm();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const clearForm = () => {
    setTitle("");
    setContent("");
    setCompleted(false);
  };

  const updateTodoItem = (id) => {
    api
      .patch(`/api/notes/update/${id}/`, { completed: true })
      .then((response) => {
        if (response.status === 200) {
          console.log("Note updated");
        } else {
          console.error(response.data);
        }
        getTodoItems();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>ToDo List</h1>
      {todoItems.length > 0 ? (
        <ul>
          {todoItems.map((note) => (
            <ToDoItem
              key={note.id}
              note={note}
              onDelete={deleteTodoItem}
              onUpdate={updateTodoItem}
            />
          ))}
        </ul>
      ) : (
        <p>You have no ToDo items yet 🙃</p>
      )}
      <form onSubmit={createTodoItem}>
        <h2>Create ToDo</h2>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label htmlFor="content">Content:</label>
        <textarea
          placeholder="Type your note here..."
          value={content}
          name="content"
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default Home;
