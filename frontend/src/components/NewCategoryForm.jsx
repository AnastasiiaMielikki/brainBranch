import React, { useState } from "react";
import api from "../api";

function NewCategoryForm({
  setShowAddNewCategoryModal,
  onClose,
  onCategoryAdded,
}) {
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await api.post("/api/categories/", {
        name: categoryName,
      });

      const newCategory = response.data;

      onCategoryAdded(newCategory.name);
      setCategoryName("");
      onClose();
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!setShowAddNewCategoryModal) return null;

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Add new category</h2>
      <input
        type="text"
        name="category"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="Type the name of the category"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        autoFocus
        disabled={isSubmitting}
      />
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Category"}
        </button>
      </div>
    </form>
  );
}

export default NewCategoryForm;
