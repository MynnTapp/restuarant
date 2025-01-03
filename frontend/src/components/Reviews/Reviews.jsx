import "./Reviews.css";
import { FaStar } from "react-icons/fa";
import DeleteReviewModal from "../ReviewModal";
import { CreateReviewModal } from "../ReviewModal/ReviewModal";
import OpenModal from "../OpenModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviews } from "../../store/reviews";
import { getCurrUser } from "./data"; // Adjust the path as needed

const MONTHS_OF_YEAR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Reviews({ spot }) {
  const [modalFlag, setModalFlag] = useState(false);
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews);
  const user = useSelector(getCurrUser);

  const reviewsArr = Object.values(reviews ? reviews : []);
  const toggle = () => {
    setModalFlag(!modalFlag);
  };

  useEffect(() => {
    if (spot) {
      dispatch(getAllReviews(spot.id));
    }
  }, [dispatch, spot]);

  reviewsArr.forEach((review) => console.log("Review:", review)); // Debugging

  return (
    <>
      {reviewsArr.length > 0 ? (
        <>
          <div>
            <FaStar /> {spot.avgRating} • {spot.numReviews > 1 ? <span>{spot.numReviews} reviews</span> : <span>{spot.numReviews} review</span>}
          </div>
          {reviewsArr.map((review) =>
            review && review.User ? (
              <div key={`${review.id}`} className="review-box">
                {review.User.firstName}
                <div>
                  {MONTHS_OF_YEAR[new Date(review.createdAt).getMonth()]}, {new Date(review.createdAt).getFullYear()}
                </div>
                <p>{review.review}</p>
                {user && review.userId === user.id ? <OpenModal buttonText="Delete" modalComponent={<DeleteReviewModal id={review.id} flag={toggle} />} /> : null}
              </div>
            ) : null
          )}
        </>
      ) : (
        <>
          <div>
            <FaStar />
            <span>New</span>
          </div>
          {user && user.id !== spot.OwnerId && !reviewsArr.length ? (
            <>
              <OpenModal buttonText="Post Your Review" modalComponent={<CreateReviewModal id={spot.id} />} />
              <h5>Be the first to post a review!</h5>
            </>
          ) : null}
        </>
      )}
    </>
  );
}
