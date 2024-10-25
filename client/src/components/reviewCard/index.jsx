import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { FaPencilAlt, FaSave } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import StarRating from "../starRating/index";
import { UPDATE_REVIEW } from "../../utils/mutations";
import { useParams } from "react-router-dom";

const ReviewCard = ({
  reviewId,
  username,
  createdAt,
  text,
  rating,
  isOwner,
  revItemId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [editedRating, setEditedRating] = useState(rating);
  const [updateReview] = useMutation(UPDATE_REVIEW);
  const { itemId } = useParams();
  const [errorMessage, setErrorMessage] = useState(null);

  const formattedDate = new Date(parseInt(createdAt)).toLocaleDateString();
  const handleSave = async () => {
    try {
      await updateReview({
        variables: {
          itemId: itemId || revItemId,
          reviewId,
          text: editedText,
          rating: editedRating,
        },
      });
      setIsEditing(false);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Unable to update review. Please try again later");
    }
  };

  return (
    <Card className="mb-3 position-relative review-card">
      {isOwner && (
        <Button
          variant="link"
          className="position-absolute top-0 end-0 mt-2 me-2"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <FaSave onClick={() => handleSave()} />
          ) : (
            <FaPencilAlt />
          )}
        </Button>
      )}
      <Card.Body>
        <Card.Title className="review-card-title">{username}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Date: {formattedDate}
        </Card.Subtitle>
        {isEditing ? (
          <>
            <StarRating
              averageRating={editedRating}
              setAverageRating={setEditedRating}
              editable
            />
            <Form.Control
              as="textarea"
              rows={3}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
          </>
        ) : (
          <>
            <StarRating averageRating={rating} />
            <Card.Text>{text}</Card.Text>
          </>
        )}
      </Card.Body>
      {errorMessage ? (
        <div>
          <p className="error-text">{errorMessage}</p>
        </div>
      ) : null}
    </Card>
  );
};

export default ReviewCard;
