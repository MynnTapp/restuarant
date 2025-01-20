// import { useSelector } from "react-redux";
// import { FaStar } from "react-icons/fa";
// import "./AllTheSpots.css";
// import { Link, useNavigate } from "react-router-dom";
// import OpenModal from "../OpenModal";
// import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal.jsx";

// export default function AllTheSpots({ isCurrent }) {
//   const navigateTo = useNavigate();
//   const sessionUser = useSelector((state) => state.session.user);
//   const spotsData = useSelector((state) => state.spots);
//   const spots = Object.values(spotsData);

//   return (
//     <div className="content_box" data-testid="spots-list">
//       {isCurrent
//         ? spots
//             ?.filter((restaurant) => restaurant?.ownerId === sessionUser?.id)
//             .map((restaurant, i) => (
//               <div key={i + 1} className="spot-tile" data-testid="spot-tile">
//                 <img src={restaurant?.previewImage} onClick={() => navigateTo(`/restaurants/${restaurant?.id}`)} className="spot-image" alt="Image Not Found"></img>
//                 <div className="spot-details">
//                   <p className="locale-rating">
//                     {restaurant?.city}, {restaurant?.state}
//                     <span className="rating">
//                       <FaStar />
//                       {restaurant?.avgRating ? restaurant?.avgRating : "NEW!"}
//                     </span>
//                   </p>
//                   ${typeof restaurant?.price === "number" ? restaurant.price.toFixed(2) : parseFloat(restaurant?.price)} plate
//                 </div>
//                 <div className="button-box">
//                   <button
//                     onClick={() => {
//                       navigateTo(`/restaurants/${restaurant?.id}/edit`);
//                     }}
//                   >
//                     Update
//                   </button>
//                   <OpenModal buttonText="Delete" modalComponent={<DeleteSpotModal id={restaurant?.id} />} />
//                 </div>
//               </div>
//             ))
//         : spots?.map((restaurant, i) => (
//             <Link key={i + 1} className="spot-tile" data-testid="spot-tile" to={`/restaurants/${restaurant.id}`}>
//               <img src={restaurant?.previewImage} data-testid="spot-thumbnail-image" className="spot-image" alt="Image Not Found"></img>
//               <div className="spot-details">
//                 <p className="locale-rating">
//                   <span data-testid="spot-city">
//                     {restaurant?.city}, {restaurant?.state}
//                   </span>
//                   <span className="rating" data-testid="spot-rating">
//                     <FaStar />
//                     {restaurant?.avgRating ? restaurant?.avgRating : "NEW!"}
//                   </span>
//                 </p>
//                 <span data-testid="spot-price">${typeof restaurant?.price === "number" ? restaurant.price.toFixed(2) : parseFloat(restaurant?.price)} per plate</span>
//               </div>
//             </Link>
//           ))}
//     </div>
//   );
// }

// import { useSelector } from "react-redux";
// import { FaStar } from "react-icons/fa";
// import "./AllTheSpots.css";
// import { Link, useNavigate } from "react-router-dom";
// import OpenModal from "../OpenModal";
// import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal.jsx";

// export default function AllTheSpots({ isCurrent }) {
//   const navigateTo = useNavigate();
//   const sessionUser = useSelector((state) => state.session.user);
//   const spotsData = useSelector((state) => state.spots);
//   const spots = Object.values(spotsData);

//   const renderSpots = (spots) => {
//     return spots?.map((restaurant, i) => {
//       const priceFormatted = typeof restaurant?.price === "number" ? restaurant?.price.toFixed(2) : parseFloat(restaurant?.price);

//       const restaurantImage = restaurant?.previewImage || "/path/to/placeholder-image.jpg"; // Add a placeholder image path here

//       return (
//         <div key={i + 1} className="spot-tile" data-testid="spot-tile">
//           <img src={restaurantImage} onClick={() => navigateTo(`/restaurants/${restaurant?.id}`)} className="spot-image" alt="Image Not Found" />
//           <div className="spot-details">
//             <p className="locale-rating">
//               {restaurant?.city}, {restaurant?.state}
//               <span className="rating">
//                 <FaStar />
//                 {restaurant?.avgRating ? restaurant?.avgRating : "NEW!"}
//               </span>
//             </p>
//             ${priceFormatted} per plate
//           </div>
//           {isCurrent && (
//             <div className="button-box">
//               <button onClick={() => navigateTo(`/restaurants/${restaurant?.id}/edit`)} aria-label="Update Restaurant">
//                 Update
//               </button>
//               <OpenModal buttonText="Delete" modalComponent={<DeleteSpotModal id={restaurant?.id} />} />
//             </div>
//           )}
//         </div>
//       );
//     });
//   };

//   return (
//     <div className="content_box" data-testid="spots-list">
//       {isCurrent
//         ? renderSpots(spots.filter((restaurant) => restaurant?.ownerId === sessionUser?.id))
//         : spots.map((restaurant, i) => (
//             <Link key={i + 1} className="spot-tile" data-testid="spot-tile" to={`/restaurants/${restaurant.id}`}>
//               <img src={restaurant?.previewImage || "/path/to/placeholder-image.jpg"} data-testid="spot-thumbnail-image" className="spot-image" alt="Image Not Found" />
//               <div className="spot-details">
//                 <p className="locale-rating">
//                   <span data-testid="spot-city">
//                     {restaurant?.city}, {restaurant?.state}
//                   </span>
//                   <span className="rating" data-testid="spot-rating">
//                     <FaStar />
//                     {restaurant?.avgRating ? restaurant?.avgRating : "NEW!"}
//                   </span>
//                 </p>
//                 <span data-testid="spot-price">${typeof restaurant?.price === "number" ? restaurant?.price.toFixed(2) : parseFloat(restaurant?.price)} per plate</span>
//               </div>
//             </Link>
//           ))}
//     </div>
//   );
// }

// import { useSelector } from "react-redux";
// import { FaStar } from "react-icons/fa";
// import "./AllTheSpots.css";
// import { Link, useNavigate } from "react-router-dom";
// import OpenModal from "../OpenModal";
// import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal.jsx";

// export default function AllTheSpots({ isCurrent }) {
//   const navigateTo = useNavigate();
//   const sessionUser = useSelector((state) => state.session.user);
//   const spotsData = useSelector((state) => state.spots);
//   const spots = Object.values(spotsData);

//   const renderSpots = (spots) => {
//     return spots?.map((restaurant, i) => {
//       const priceFormatted = typeof restaurant?.price === "number" ? restaurant?.price.toFixed(2) : parseFloat(restaurant?.price);

//       return (
//         <div key={i + 1} className="spot-tile" data-testid="spot-tile" onClick={() => navigateTo(`/restaurants/${restaurant?.id}`)}>
//           <div className="spot-details">
//             <p className="locale-rating">
//               {restaurant?.city}, {restaurant?.state}
//               <span className="rating">
//                 <FaStar />
//                 {restaurant?.avgRating ? restaurant?.avgRating : "NEW!"}
//               </span>
//             </p>
//             ${priceFormatted} per plate
//           </div>
//           {isCurrent && (
//             <div className="button-box">
//               <button onClick={() => navigateTo(`/restaurants/${restaurant?.id}/edit`)} aria-label="Update Restaurant">
//                 Update
//               </button>
//               <OpenModal buttonText="Delete" modalComponent={<DeleteSpotModal id={restaurant?.id} />} />
//             </div>
//           )}
//         </div>
//       );
//     });
//   };

//   return (
//     <div className="content_box" data-testid="spots-list">
//       {isCurrent
//         ? renderSpots(spots.filter((restaurant) => restaurant?.ownerId === sessionUser?.id))
//         : spots.map((restaurant, i) => (
//             <Link key={i + 1} className="spot-tile" data-testid="spot-tile" to={`/restaurants/${restaurant.id}`}>
//               <div className="spot-details">
//                 <p className="locale-rating">
//                   <span data-testid="spot-city">
//                     {restaurant?.city}, {restaurant?.state}
//                   </span>
//                   <span className="rating" data-testid="spot-rating">
//                     <FaStar />
//                     {restaurant?.avgRating ? restaurant?.avgRating : "NEW!"}
//                   </span>
//                 </p>
//                 <span data-testid="spot-price">${typeof restaurant?.price === "number" ? restaurant?.price.toFixed(2) : parseFloat(restaurant?.price)} per plate</span>
//               </div>
//             </Link>
//           ))}
//     </div>
//   );
// }

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

  const renderSpots = (spots) => {
    return spots?.map((restaurant, i) => {
      const priceFormatted = typeof restaurant?.price === "number" ? restaurant?.price.toFixed(2) : parseFloat(restaurant?.price);

      return (
        <div key={i + 1} className="spot-tile" data-testid="spot-tile" onClick={() => navigateTo(`/restaurants/${restaurant?.id}`)}>
          <div className="spot-details">
            <p className="locale-rating">
              {restaurant?.city}, {restaurant?.state}
              <span className="rating">
                <FaStar />
                {restaurant?.avgRating ? restaurant?.avgRating : "NEW!"}
              </span>
            </p>
            ${priceFormatted} per plate
          </div>
          {isCurrent && (
            <div className="button-box">
              <button onClick={() => navigateTo(`/restaurants/${restaurant?.id}/edit`)} aria-label="Update Restaurant">
                Update
              </button>
              <OpenModal buttonText="Delete" modalComponent={<DeleteSpotModal id={restaurant?.id} />} />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="container">
      {/* Restaurant experience blog header */}
      <h1 className="blog-header">Welcome to the Restaurant Experience Blog! Share your favorite moments and reviews from your dining adventures.</h1>

      <div className="content_box" data-testid="spots-list">
        {isCurrent
          ? renderSpots(spots.filter((restaurant) => restaurant?.ownerId === sessionUser?.id))
          : spots.map((restaurant, i) => (
              <Link key={i + 1} className="spot-tile" data-testid="spot-tile" to={`/restaurants/${restaurant.id}`}>
                <div className="spot-details">
                  <p className="locale-rating">
                    <span data-testid="spot-city">
                      {restaurant?.city}, {restaurant?.state}
                    </span>
                    <span className="rating" data-testid="spot-rating">
                      <FaStar />
                      {restaurant?.avgRating ? restaurant?.avgRating : "NEW!"}
                    </span>
                  </p>
                  <span data-testid="spot-price">${typeof restaurant?.price === "number" ? restaurant?.price.toFixed(2) : parseFloat(restaurant?.price)} per plate</span>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
