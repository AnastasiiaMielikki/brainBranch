import React from "react";
import "../styles/Note.css";

const ToDoItem = ({ note, onDelete, onUpdate }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="note">
      <label htmlFor="note-checkbox" className="note-checkbox">
        <input
          type="checkbox"
          name="note-checkbox"
          id="note-checkbox"
          checked={note.completed}
          onChange={() => onUpdate(note.id)}
        />
        <h3 className="note-title">{note.title}</h3>
        <p className="note-content">{note.content}</p>
        <p className="note-created-at">{formatDate(note.created_at)}</p>
        <button className="delete-button" onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </label>
    </div>
  );
};

export default ToDoItem;
