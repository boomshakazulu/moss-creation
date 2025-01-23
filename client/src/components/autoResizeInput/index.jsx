import React, { useEffect, useRef } from "react";
import { Form } from "react-bootstrap";

const AutoResizeInput = ({ value, ...props }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.style.height = "auto"; // Reset height
      inputElement.style.height = `${inputElement.scrollHeight}px`; // Adjust height
    }
  }, [value]);

  return (
    <Form.Control
      as="textarea"
      ref={inputRef}
      rows={1}
      value={value}
      {...props}
      style={{ width: "100%", resize: "none", overflow: "hidden" }}
    />
  );
};

export default AutoResizeInput;
