// import { useDispatch } from "react-redux";
// import { useModal } from "../../context/Modal";
// import "./ReviewModal.css";
// import { deleteReview, createReview } from "../../store/reviews"; // Import updateReview
// import { useState } from "react";
// import { IoMdStarOutline, IoMdStar } from "react-icons/io";

// export default function DeleteReviewModal({ id, flag }) {
//   const { closeModal } = useModal();
//   const dispatch = useDispatch();

//   const handleDeletion = async (e) => {
//     e.preventDefault();
//     dispatch(deleteReview(id));
//     flag();
//     closeModal();
//   };
//   return (
//     <>
//       <h2>Confirm Delete</h2>
//       <h5>Are you sure you want to delete this review?</h5>
//       <button onClick={handleDeletion}>Yes (Delete Review)</button>
//       <button onClick={() => closeModal()}>No (Keep Review)</button>
//     </>
//   );
// }

// export function CreateReviewModal({ id }) {
//   const { closeModal } = useModal();
//   const dispatch = useDispatch();
//   const [review, setReview] = useState("");
//   const [stars, setStars] = useState(0);
//   const [activeRating, setActiveRating] = useState(stars);

//   const handleSubmission = async (e) => {
//     e.preventDefault();
//     const payload = {
//       review,
//       stars,
//     };
//     dispatch(createReview(payload, id));
//     closeModal();
//   };

//   const onChange = (num) => setStars(num);

//   return (
//     <>
//       <div className="review-heading">How was your stay?</div>
//       <textarea placeholder="Leave your review here..." onChange={({ target: { value } }) => setReview(value)} className="review-comment"></textarea>

//       <div onMouseLeave={() => setActiveRating(stars)} className="rating-input">
//         <span className={activeRating < 1 ? "empty" : "filled"} onClick={() => onChange(1)} onMouseEnter={() => setActiveRating(1)}>
//           {activeRating < 1 ? <IoMdStarOutline /> : <IoMdStar />}
//         </span>
//         <span className={activeRating < 2 ? "empty" : "filled"} onClick={() => onChange(2)} onMouseEnter={() => setActiveRating(2)}>
//           {activeRating < 2 ? <IoMdStarOutline /> : <IoMdStar />}
//         </span>
//         <span onClick={() => onChange(3)} className={activeRating < 3 ? "empty" : "filled"} onMouseEnter={() => setActiveRating(3)}>
//           {activeRating < 3 ? <IoMdStarOutline /> : <IoMdStar />}
//         </span>
//         <span onClick={() => onChange(4)} className={activeRating < 4 ? "empty" : "filled"} onMouseEnter={() => setActiveRating(4)}>
//           {activeRating < 4 ? <IoMdStarOutline /> : <IoMdStar />}
//         </span>
//         <span onClick={() => onChange(5)} className={activeRating < 5 ? "empty" : "filled"} onMouseEnter={() => setActiveRating(5)}>
//           {activeRating < 5 ? <IoMdStarOutline /> : <IoMdStar />}
//         </span>
//         <span>Stars</span>
//       </div>
//       <button onClick={handleSubmission} disabled={review.length < 10 || stars === 0} className="review-button">
//         Submit Review
//       </button>
//     </>
//   );
// }

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
      <button onClick={handleDeletion}>Yes (Delete Review)</button>
      <button onClick={() => closeModal()}>No (Keep Review)</button>
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
      <div className="review-heading">{existingReview ? "Update your review" : "How was your stay?"}</div>
      <textarea placeholder="Leave your review here..." value={review} onChange={({ target: { value } }) => setReview(value)} className="review-comment" />

      <div onMouseLeave={() => setStars(stars)} className="rating-input">
        {[1, 2, 3, 4, 5].map((num) => (
          <span key={num} className={stars < num ? "empty" : "filled"} onClick={() => onChange(num)} onMouseEnter={() => setStars(num)}>
            {stars < num ? <IoMdStarOutline /> : <IoMdStar />}
          </span>
        ))}
        <span>Stars</span>
      </div>

      <button onClick={handleSubmission} disabled={review.length < 10 || stars === 0} className="review-button">
        {existingReview ? "Update Review" : "Submit Review"}
      </button>
    </>
  );
}
