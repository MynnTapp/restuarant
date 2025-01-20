import { useRef } from "react";
import "./CallOutBox.css";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
export default function CalloutBox({ spot, reviews }) {
  const user = useSelector((state) => state.session.user);
  const isDisabled = useRef(true);
  const setStatus = () => {
    user ? (isDisabled.current = false) : (isDisabled.current = true);
    return isDisabled;
  };

  return (
    <>
      <div className="booking-block" data-testid="spot-callout-box">
        <div className="price_reviews">
          <div data-testid="spot-price">$ {typeof spot?.price === "number" ? spot.price.toFixed(2) : parseFloat(spot?.price)} per plate</div>
          {reviews.length ? (
            <div data-testid="spot-rating">
              <FaStar />
              {spot.avgRating} • {spot.numReviews === 1 ? <span>{spot.numReviews} review</span> : <span>{spot.numReviews} reviews</span>}
            </div>
          ) : (
            <div>
              <FaStar /> New
            </div>
          )}
        </div>
        <button
          data-testid="reserve-button"
          onClick={() => alert("Congrats on making a reservation! We will email you the details shortly!")}
          className={`booking-button ${isDisabled.current ? "" : "enabled"}`}
          disabled={setStatus().current}
        >
          Reserve a table!
        </button>
      </div>
    </>
  );
}
