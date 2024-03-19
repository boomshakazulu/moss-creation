import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";
import { ADD_PRODUCT } from "../utils/mutations";
import "./adminAdd.css";

function AdminAdd() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: "",
    photo: [],
    stock: "",
    video: "",
    carousel: "",
  });
  useEffect(() => {
    if (!Auth.isAdmin()) {
      navigate("/");
    }
  }, []);

  const [addProduct] = useMutation(ADD_PRODUCT);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form...");
    try {
      await addProduct({
        variables: {
          input: {
            name: formState.name,
            description: formState.description,
            price: parseFloat(formState.price), // Use parseFloat for price
            photo: formState.photo,
            stock: parseInt(formState.stock), // Use parseInt for stock
            video: formState.video,
            carousel: formState.carousel,
          },
        },
      });
      navigate("/admin");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleAddPhotoField = () => {
    setFormState({
      ...formState,
      photo: [...formState.photo, ""],
    });
  };

  const handleDeletePhotoField = (index) => {
    const updatedPhotos = [...formState.photo];
    updatedPhotos.splice(index, 1); // Remove the photo URL at the given index
    setFormState({
      ...formState,
      photo: updatedPhotos,
    });
  };

  const handlePhotoInputChange = (index, value) => {
    const updatedPhotos = [...formState.photo];
    updatedPhotos[index] = value;
    setFormState({
      ...formState,
      photo: updatedPhotos,
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="form-container">
      <h1 className="add-title">Add a Product</h1>
      <p className="description">
        At minimum add a name, 1 photo, price and stock.<br></br>You can leave
        unwanted boxes blank.<br></br>This can be edited later!<br></br> keep
        carousel images landscape and only supply one if you want it included on
        the carousel
      </p>
      <label htmlFor="productName">Product Name:</label>
      <input
        placeholder="Product Name"
        type="text"
        name="name"
        value={formState.name}
        onChange={handleInputChange}
      />
      <label htmlFor="productDescription">Description:</label>
      <input
        placeholder="Description"
        type="text"
        name="description"
        value={formState.description}
        onChange={handleInputChange}
      />
      <label htmlFor="price">Price:</label>
      <input
        placeholder="20.99"
        type="number"
        name="price"
        value={formState.price}
        onChange={handleInputChange}
      />
      <label htmlFor="photos">Photo URLs:</label>
      <p>(The first one will be displayed on the homepage!)</p>
      {Array.isArray(formState.photo) &&
        formState.photo.map((photo, index) => (
          <div key={index} className="photo-input-container">
            <input
              placeholder="https://..."
              type="text"
              value={photo}
              onChange={(e) => handlePhotoInputChange(index, e.target.value)}
            />
            {/* Delete button */}
            <button
              type="button"
              onClick={() => handleDeletePhotoField(index)}
              className="delete-photo-button"
            >
              Delete
            </button>
          </div>
        ))}
      <button type="button" onClick={handleAddPhotoField}>
        + Add Photo
      </button>

      <label htmlFor="stock">Stock Number:</label>
      <input
        placeholder="2"
        type="number"
        name="stock"
        value={formState.stock}
        onChange={handleInputChange}
      />
      <label htmlFor="video">Video URL:</label>
      <input
        placeholder="https://..."
        type="text"
        name="video"
        value={formState.video}
        onChange={handleInputChange}
      />
      <label htmlFor="carousel">Carousel IMG:</label>
      <input
        placeholder="https://..."
        type="text"
        name="carousel"
        value={formState.carousel}
        onChange={handleInputChange}
      />
      {/* Add more input fields for other form fields */}
      <button type="submit">Submit</button>
    </form>
  );
}

export default AdminAdd;
