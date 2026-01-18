import React, { useState } from "react";
import { FolderIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import NewCategoryForm from "./NewCategoryForm";

function Sidebar({ categories = [], onCategoriesChange, selectedCategory = "All", onCategorySelect, onCategoryDelete }) {
  const [showAddNewCategoryModal, setShowAddNewCategoryModal] = useState(false);

  const addNewCategory = () => {
    setShowAddNewCategoryModal(true);
  };

  const handleCloseModal = () => {
    setShowAddNewCategoryModal(false);
  };

  const handleCategoryAdded = (newCategory) => {
    setShowAddNewCategoryModal(false);
    // Refresh the categories list
    if (onCategoriesChange) {
      onCategoriesChange();
    }
  };

  return (
    <>
      <div className="sidebar flex flex-col items-center w-sm p-4">
        <p className="text-2xl font-bold">Sidebar</p>
        <div
          id="sidebar-categories-list"
          className="flex flex-col items-center gap-2 mt-4 w-full"
        >
          {categories.length > 0 ? (
            <>
              {categories.map((category, index) => {
                const isCustomCategory = category !== "All" && category !== "Inbox";
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 w-full rounded cursor-pointer group ${
                      selectedCategory === category
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => onCategorySelect && onCategorySelect(category)}
                  >
                    <FolderIcon className={`size-5 ${selectedCategory === category ? "text-blue-600" : "text-gray-600"}`} />
                    <span className={`flex-1 ${selectedCategory === category ? "text-blue-700 font-medium" : "text-gray-800"}`}>{category}</span>
                    {isCustomCategory && (
                      <button
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCategoryDelete && onCategoryDelete(category);
                        }}
                        title="Delete category"
                      >
                        <TrashIcon className="size-4 text-red-500 hover:text-red-700" />
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                id="add-category-button"
                className="text-gray-500 hover:text-gray-700 flex items-center gap-2 p-2 w-full rounded hover:bg-gray-100 cursor-pointer"
                onClick={addNewCategory}
              >
                <PlusCircleIcon className="size-5 text-gray-600" />
                <span>Add new category</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-gray-500">You have no categories yet</span>
              <button
                id="add-category-button"
                className="text-gray-500 hover:text-gray-700 flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={addNewCategory}
              >
                <PlusCircleIcon className="size-5 text-gray-600" />
                <span>Add new category</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal overlay and form - conditionally rendered */}
      {showAddNewCategoryModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <NewCategoryForm
              setShowAddNewCategoryModal={setShowAddNewCategoryModal}
              onClose={handleCloseModal}
              onCategoryAdded={handleCategoryAdded}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
