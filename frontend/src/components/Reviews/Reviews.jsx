import "./Reviews.css";
import { FaStar } from "react-icons/fa";
import DeleteReviewModal from "../ReviewModal";
import { CreateReviewModal } from "../ReviewModal/ReviewModal";
import OpenModal from "../OpenModal";
import { useEffect, useState } from "react";
import { getCurrUser } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviews } from "../../store/reviews";

const MONTHS_OF_YEAR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Reviews({ spot }) {
  const [modalFlag, setModalFlag] = useState(false);
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews);
  const user = getCurrUser(useSelector((state) => state));

  const reviewsArr = Object.values(reviews ? reviews : []);
  const toggle = () => {
    setModalFlag(!modalFlag);
  };

  useEffect(() => {
    if (spot) {
      dispatch(getAllReviews(spot.id));
    }
  }, [dispatch, spot]);

  return (
    <>
      {reviewsArr.length > 0 ? (
        <>
          <div>
            <FaStar /> {spot.avgRating} • {spot.numReviews > 1 ? <span>{spot.numReviews} reviews</span> : <span>{spot.numReviews} review</span>}
          </div>
          {reviewsArr.map((review) => {
            return (
              <div key={`${review.id}`} className="review-box">
                {review.User.firstName}
                <div>
                  {MONTHS_OF_YEAR[new Date(review.createdAt).getMonth()]}, {new Date(review.createdAt).getFullYear()}
                </div>
                <p>{review.review}</p>
                {review.User.id === user?.id ? <OpenModal buttonText="Delete" modalComponent={<DeleteReviewModal id={review.id} flag={toggle} />} /> : null}
              </div>
            );
          })}
        </>
      ) : (
        <>
          <div>
            <FaStar />
            <span>New</span>
          </div>
          {user && user.id !== spot.Owner.id && !reviewsArr.length ? (
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
