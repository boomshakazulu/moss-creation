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
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [editedRating, setEditedRating] = useState(rating);
  const [updateReview] = useMutation(UPDATE_REVIEW);
  const { itemId } = useParams();

  const formattedDate = new Date(parseInt(createdAt)).toLocaleDateString();
  console.log(editedRating);
  const handleSave = async () => {
    try {
      await updateReview({
        variables: {
          itemId,
          reviewId,
          text: editedText,
          rating: editedRating,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating review:", error.message);
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
        <Card.Title>{username}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Date: {formattedDate}
        </Card.Subtitle>
        {isEditing ? (
          <>
            <Form.Control
              as="textarea"
              rows={3}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <StarRating
              averageRating={editedRating}
              setAverageRating={setEditedRating}
              editable
            />
          </>
        ) : (
          <>
            <StarRating averageRating={rating} />
            <Card.Text>{text}</Card.Text>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;
