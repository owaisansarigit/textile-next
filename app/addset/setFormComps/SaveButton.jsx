import React from "react";

const SaveButton = ({ onSave }) => (
  <button
    className="btn btn-primary btn-lg w-100 mt-4 fw-bold"
    onClick={onSave}
  >
    SAVE SET DATA
  </button>
);

export default SaveButton;
