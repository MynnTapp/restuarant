import { useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";
import "./AllTheSpots.css";
import { Link, useNavigate } from "react-router-dom";
import OpenModal from "../OpenModal";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal.jsx";

export default function AllTheSpots({ isCurrent }) {
  const navigateTo = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const spotsData = useSelector((state) => state.spots);
  const spots = Object.values(spotsData);

  return (
    <div className="content_box" data-testid="spots-list">
      {isCurrent
        ? spots
            ?.filter((spot) => spot?.ownerId === sessionUser?.id)
            .map((spot, i) => (
              <div key={i + 1} className="spot-tile" data-testid="spot-tile">
                <img src={spot?.previewImage} onClick={() => navigateTo(`/spots/${spot?.id}`)} className="spot-image" alt="Image Not Found"></img>
                <div className="spot-details">
                  <p className="locale-rating">
                    {spot?.city}, {spot?.state}
                    <span className="rating">
                      <FaStar />
                      {spot?.avgRating ? spot?.avgRating : "NEW!"}
                    </span>
                  </p>
                  ${typeof spot?.price === "number" ? spot.price.toFixed(2) : parseFloat(spot?.price)} night
                </div>
                <div className="button-box">
                  <button
                    onClick={() => {
                      navigateTo(`/spots/${spot?.id}/edit`);
                    }}
                  >
                    Update
                  </button>
                  <OpenModal buttonText="Delete" modalComponent={<DeleteSpotModal id={spot?.id} />} />
                </div>
              </div>
            ))
        : spots?.map((spot, i) => (
            <Link key={i + 1} className="spot-tile" data-testid="spot-tile" to={`/spots/${spot.id}`}>
              <img src={spot?.previewImage} data-testid="spot-thumbnail-image" className="spot-image" alt="Image Not Found"></img>
              <div className="spot-details">
                <p className="locale-rating">
                  <span data-testid="spot-city">
                    {spot?.city}, {spot?.state}
                  </span>
                  <span className="rating" data-testid="spot-rating">
                    <FaStar />
                    {spot?.avgRating ? spot?.avgRating : "NEW!"}
                  </span>
                </p>
                <span data-testid="spot-price">${typeof spot?.price === "number" ? spot.price.toFixed(2) : parseFloat(spot?.price)} night</span>
              </div>
            </Link>
          ))}
    </div>
  );
}
