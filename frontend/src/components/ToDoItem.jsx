import React from "react";
import { TrashIcon, CheckIcon } from "@heroicons/react/24/outline";

const ToDoItem = ({ note, onDelete, onUpdate }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="note w-3xl flex items-center justify-between gap-2 bg-white p-4 rounded-md">
      <div className="note-content flex items-center justify-between gap-2">
        <input
          type="checkbox"
          name={`note-checkbox-${note.id}`}
          id={`note-checkbox-${note.id}`}
          checked={note.completed}
          onChange={() => onUpdate(note.id)}
          className="hidden peer"
        />
        <label
          htmlFor={`note-checkbox-${note.id}`}
          className="note-checkbox inline-flex items-center justify-center w-5 h-5 border-1 border-gray-300 rounded-sm peer-checked:bg-purple-500 cursor-pointer"
        >
          <CheckIcon className="size-4 text-white stroke-2" />
        </label>
        <h3 className="note-title text-lg font-bold">{note.title}</h3>
        <p className="note-content">{note.content}</p>
        <p className="note-created-at text-gray-500 text-sm">
          {formatDate(note.created_at)}
        </p>
        <p className="note-category text-gray-300 text-sm">
          {note.category || "Inbox"}
        </p>
      </div>

      <button
        className="delete-button text-red-500 cursor-pointer px-1 hover:text-red-700 transition-all duration-300"
        onClick={() => onDelete(note.id)}
      >
        <TrashIcon className="size-5" />
      </button>
    </div>
  );
};

export default ToDoItem;
