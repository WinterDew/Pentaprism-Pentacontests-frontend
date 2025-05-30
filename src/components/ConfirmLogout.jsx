import pb from "../services/pocketbase";
import { useState } from "react";
import useToast from '../hooks/useToast';

function ConfirmLogout({ isOpen, onClose }) {
  const showToast = useToast();
  const handleLogout = () => {
    pb.authStore.clear();
    showToast("Logout Successful", "success");
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Logout</h3>
        <p className="py-4">Are you sure you want to log out?</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={handleLogout}>
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmLogout;
