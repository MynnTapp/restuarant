import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./ReviewModal.css";
import { deleteReview, createReview, updateReview } from "../../store/reviews";
import { useState, useEffect } from "react";
import { IoMdStarOutline, IoMdStar } from "react-icons/io";

export default function DeleteReviewModal({ id, flag }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleDeletion = async (e) => {
    e.preventDefault();
    dispatch(deleteReview(id));
    flag(); // Assuming this is a function to refresh or update the view.
    closeModal();
  };

  return (
    <>
      <h2>Confirm Delete</h2>
      <h5>Are you sure you want to delete this review?</h5>
      <button onClick={handleDeletion}>Yes</button>
      <button onClick={() => closeModal()}>No</button>
    </>
  );
}

export function CreateReviewModal({ id, existingReview }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const [review, setReview] = useState(existingReview ? existingReview.review : "");
  const [stars, setStars] = useState(existingReview ? existingReview.stars : 0);

  useEffect(() => {
    if (existingReview) {
      setReview(existingReview.review);
      setStars(existingReview.stars);
    }
  }, [existingReview]);

  const handleSubmission = async (e) => {
    e.preventDefault();
    const payload = {
      review,
      stars,
    };

    if (existingReview) {
      // Update the review
      dispatch(updateReview(payload, existingReview.id));
    } else {
      // Create a new review
      dispatch(createReview(payload, id));
    }

    closeModal();
  };

  const onChange = (num) => setStars(num);

  return (
    <>
      <div className="review-heading">{existingReview ? "Update your entry?" : "How was the experience?"}</div>
      <textarea placeholder="Write your entry here..." value={review} onChange={({ target: { value } }) => setReview(value)} className="review-comment" />

      <div onMouseLeave={() => setStars(stars)} className="rating-input">
        {[1, 2, 3, 4, 5].map((num) => (
          <span key={num} className={stars < num ? "empty" : "filled"} onClick={() => onChange(num)} onMouseEnter={() => setStars(num)}>
            {stars < num ? <IoMdStarOutline /> : <IoMdStar />}
          </span>
        ))}
        <span>Stars</span>
      </div>

      <button onClick={handleSubmission} disabled={review.length < 10 || stars === 0} className="review-button">
        {existingReview ? "Update Entry" : "Submit Entry"}
      </button>
    </>
  );
}
