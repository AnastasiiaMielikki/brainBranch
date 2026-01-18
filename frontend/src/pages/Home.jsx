import { useEffect, useState, useRef } from "react";
import { FolderIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import api from "../api";
import ToDoItem from "../components/ToDoItem.tsx";
import Sidebar from "../components/Sidebar";
import NewCategoryForm from "../components/NewCategoryForm";

function Home() {
  const [todoItems, setTodoItems] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [showAddNewCategoryModal, setShowAddNewCategoryModal] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const dropdownRef = useRef(null);

  useEffect(() => {
    getTodoItems();
    getCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategoryDropdown]);

  const getCategories = () => {
    api
      .get("/api/categories/")
      .then((response) => {
        const categoryNames = response.data.map((cat) => cat.name);
        setCategories(["All", ...categoryNames]);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  // Filter todos based on selected category
  const filteredTodoItems = selectedCategory === "All"
    ? todoItems
    : todoItems.filter((item) => item.category === selectedCategory);

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
      .post("/api/notes/", {
        title,
        content: content || "",
        category: category || "Inbox",
        completed: false,
      })
      .then((response) => {
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
    setCategory("");
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

  const handleCategoryAdded = () => {
    setShowAddNewCategoryModal(false);
    getCategories();
  };

  const deleteCategory = (categoryName) => {
    // First, find the category ID by name
    api
      .get("/api/categories/")
      .then((response) => {
        const categoryToDelete = response.data.find((cat) => cat.name === categoryName);
        if (categoryToDelete) {
          return api.delete(`/api/categories/delete/${categoryToDelete.id}/`);
        } else {
          throw new Error("Category not found");
        }
      })
      .then((response) => {
        if (response.status === 204) {
          console.log("Category deleted");
          // If the deleted category was selected, switch to "All"
          if (selectedCategory === categoryName) {
            setSelectedCategory("All");
          }
          getCategories();
          // Refresh todos to reflect category changes (moved to "Inbox")
          getTodoItems();
        }
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      });
  };

  return (
    <div className="app_container flex">
      <Sidebar
        categories={categories}
        onCategoriesChange={getCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onCategoryDelete={deleteCategory}
      />
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
          <div className="relative" ref={dropdownRef}>
            <button
              id="add-todo-category-button"
              type="button"
              className="text-white"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <FolderIcon className="size-6 cursor-pointer" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                <div className="py-1 max-h-60 overflow-y-auto">
                  {categories.length > 0 ? (
                    categories.map((categoryName, index) => (
                      <label
                        key={index}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={category === categoryName}
                          onChange={() => {
                            setCategory(categoryName);
                            setShowCategoryDropdown(false);
                          }}
                        />
                        <FolderIcon className="size-4 text-gray-600" />
                        <span>{categoryName}</span>
                      </label>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No categories yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>
        <h1 className="text-3xl font-bold mb-4">ToDo List</h1>
        {filteredTodoItems.length > 0 ? (
          <ul className="flex flex-col gap-4 w-3xl items-center justify-center">
            {filteredTodoItems.map((note) => (
              <ToDoItem
                key={note.id}
                note={note}
                onDelete={deleteTodoItem}
                onUpdate={updateTodoItem}
              />
            ))}
          </ul>
        ) : (
          <p>
            {todoItems.length > 0
              ? `No items in ${selectedCategory}`
              : "You have no ToDo items yet 🙃"}
          </p>
        )}
      </div>
      {showAddNewCategoryModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowAddNewCategoryModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <NewCategoryForm
              setShowAddNewCategoryModal={setShowAddNewCategoryModal}
              onClose={() => setShowAddNewCategoryModal(false)}
              onCategoryAdded={handleCategoryAdded}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
