// import { useParams } from "react-router-dom";
// import "./SpotDetailPage.css";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { getAllReviews } from "../../store/reviews";
// import CalloutBox from "./CallOutBox";
// import Reviews from "../Reviews";
// import { getOneSpot } from "../../store/spots";

// export default function SpotDetailPage() {
//   const dispatch = useDispatch();
//   const { id } = useParams();
//   const spot = useSelector((state) => state.spots[id]);
//   const reviews = useSelector((state) => state.reviews);
//   const images = useSelector((state) => state.spots[id]?.SpotImages);

//   useEffect(() => {
//     dispatch(getOneSpot(id));
//     dispatch(getAllReviews(id));
//   }, [dispatch, id]);

//   if (!spot || !reviews) return <h1>Loading...</h1>;

//   const reviewsArr = Object.values(reviews ? reviews : []);
//   const imagesArr = Object.values(images ? images : []);

//   return (
//     <div className="the-page">
//       <div className="main-spot-content">
//         <div className="headers" data-testid="spot-name">
//           {spot.name}
//         </div>
//         <h4 data-testid="spot-location">
//           Location: {spot.city}, {spot.state}, {spot.country}
//         </h4>
//         <div style={{ display: "flex" }}>
//           {/* <img src={`${imagesArr[0]?.url}`} alt="Image not found" data-testid="spot-large-image" className="preview" /> */}
//           <img src={imagesArr[0]?.url} alt="Image not found" data-testid="spot-large-image" className="preview" />
//           <div style={{ display: "flex", flexWrap: "wrap" }}>
//             {imagesArr
//               .filter((image) => image?.preview !== true)
//               .map(({ url }, i) => {
//                 return i < 5 ? <img src={url} data-testid="spot-small-image" key={+i + 1} alt="Image Not Found" style={{ width: "48%" }} /> : null;
//               })}
//           </div>
//         </div>
//         <div className="details">
//           <div>
//             <h3 data-testid="spot-host">
//               Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
//             </h3>
//             <p data-testid="spot-description">{spot.description}</p>
//           </div>

//           <CalloutBox spot={spot} reviews={reviewsArr.length ? reviewsArr : []} />
//         </div>
//         <div className="divider"></div>
//         <Reviews spot={spot} />
//       </div>
//     </div>
//   );
// }

// import { useParams } from "react-router-dom";
// import "./SpotDetailPage.css";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { getAllReviews } from "../../store/reviews";
// import CalloutBox from "./CallOutBox";
// import Reviews from "../Reviews";
// import { getOneSpot } from "../../store/spots";

// export default function SpotDetailPage() {
//   const dispatch = useDispatch();
//   const { id } = useParams();

//   // Select spot and images from Redux store
//   const spot = useSelector((state) => state.spots[id]);
//   const reviews = useSelector((state) => state.reviews);
//   const images = useSelector((state) => state.spots[id]?.SpotImages);

//   useEffect(() => {
//     dispatch(getOneSpot(id));
//     dispatch(getAllReviews(id));
//   }, [dispatch, id]);

//   // Wait for spot and reviews to be loaded
//   if (!spot || !reviews) return <h1>Loading...</h1>;

//   const reviewsArr = Object.values(reviews || []);
//   const imagesArr = Object.values(images || []);
//   console.log(imagesArr); // Log images array to check what's being returned

//   return (
//     <div className="the-page">
//       <div className="main-spot-content">
//         <div className="headers" data-testid="spot-name">
//           {spot.name}
//         </div>
//         <h4 data-testid="spot-location">
//           Location: {spot.city}, {spot.state}, {spot.country}
//         </h4>

//         {/* Render images only if available */}
//         {imagesArr.length > 0 && (
//           <div style={{ display: "flex" }}>
//             {/* Large preview image */}
//             <img src={imagesArr[0]?.url} alt="Image not found" data-testid="spot-large-image" className="preview" />
//             <div style={{ display: "flex", flexWrap: "wrap" }}>
//               {/* Smaller images */}
//               {imagesArr
//                 .filter((image) => image?.preview !== true)
//                 .map(({ url }, i) => {
//                   return i < 5 ? <img src={url} data-testid="spot-small-image" key={i + 1} alt="Image Not Found" style={{ width: "48%" }} /> : null;
//                 })}
//             </div>
//           </div>
//         )}

//         <div className="details">
//           <div>
//             <h3 data-testid="spot-host">
//               Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
//             </h3>
//             <p data-testid="spot-description">{spot.description}</p>
//           </div>

//           {/* CalloutBox Component */}
//           <CalloutBox spot={spot} reviews={reviewsArr.length ? reviewsArr : []} />
//         </div>

//         <div className="divider"></div>

//         {/* Reviews Component */}
//         <Reviews spot={spot} />
//       </div>
//     </div>
//   );
// }

import { useParams } from "react-router-dom";
import "./SpotDetailPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllReviews } from "../../store/reviews";
import CalloutBox from "./CallOutBox";
import Reviews from "../Reviews";
import { getOneSpot } from "../../store/spots";

export default function SpotDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams();

  // Select spot and reviews from Redux store
  const spot = useSelector((state) => state.spots[id]);
  const reviews = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(getOneSpot(id));
    dispatch(getAllReviews(id));
  }, [dispatch, id]);

  // Wait for spot and reviews to be loaded
  if (!spot || !reviews) return <h1>Loading...</h1>;

  const reviewsArr = Object.values(reviews || []);

  return (
    <div className="the-page">
      <div className="main-spot-content">
        <div className="headers" data-testid="spot-name">
          {spot.name}
        </div>
        <h4 data-testid="spot-location">
          Location: {spot.city}, {spot.state}, {spot.country}
        </h4>

        {/* Removed Image Section */}

        <div className="details">
          <div>
            <h3 data-testid="spot-host">
              Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
            </h3>
            <p data-testid="spot-description">{spot.description}</p>
          </div>

          {/* CalloutBox Component */}
          <CalloutBox spot={spot} reviews={reviewsArr.length ? reviewsArr : []} />
        </div>

        <div className="divider"></div>

        {/* Reviews Component */}
        <Reviews spot={spot} />
      </div>
    </div>
  );
}
