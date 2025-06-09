import pb from "../services/pocketbase";
import { useState } from "react";
import useToast from '../hooks/useToast';

function ConfirmDelete({ isOpen, onClose, handleDelete }) {
  const showToast = useToast();

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Delete</h3>
        <p className="py-4">Are you sure you want to delete this submission.?</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={() => {handleDelete(); onClose();}}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDelete;
