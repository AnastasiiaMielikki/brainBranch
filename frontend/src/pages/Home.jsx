import { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import api from "../api";
import ToDoItem from "../components/ToDoItem";
import Sidebar from "../components/Sidebar";

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
    const todoItem = todoItems.find((item) => item.id === id);

    // Toggle the completed state
    api
      .patch(`/api/notes/update/${id}/`, { completed: !todoItem.completed })
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
    <div className="app_container flex">
      <Sidebar />
      <div className="min-h-screen flex flex-col items-center grow p-8 bg-gradient-to-br from-blue-400 via-purple-600 to-orange-400">
        <form
          onSubmit={createTodoItem}
          className="flex w-3xl items-center gap-4 mb-4"
        >
          <button type="submit" className="text-white">
            <PlusCircleIcon className="size-6 cursor-pointer" />
          </button>
          <label htmlFor="title" className="text-white">
            Title:
          </label>
          <input
            type="text"
            placeholder="Add task to ToDo List, click on the button to add"
            value={title}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white w-full border-2 border-gray-300 rounded-md p-2 outline-none"
            required
          />
          <div className="flex flex-col hidden">
            <label htmlFor="content">Content:</label>
            <textarea
              placeholder="Type your note here..."
              value={content}
              name="content"
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </form>
        <h1 className="text-3xl font-bold mb-4">ToDo List</h1>
        {todoItems.length > 0 ? (
          <ul className="flex flex-col gap-4 w-3xl items-center justify-center">
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
      </div>
    </div>
  );
}

export default Home;
