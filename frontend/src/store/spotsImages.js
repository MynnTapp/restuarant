// import { csrfFetch } from "./csrf";

// const ADD_THE_IMAGES = "spots/addImageToSpot";

// // Action creator to add the image to a specific spot
// const addImageToSpot = (spotId, image) => {
//   return {
//     type: ADD_THE_IMAGES,
//     spotId,
//     image,
//   };
// };

// // Normalizer function (still useful if you need to normalize payload)
// const normalizer = (payload) => {
//   const res = {};

//   payload.forEach((ele) => {
//     res[ele.id] = ele;
//   });

//   return res;
// };

// // Thunk action to add images to a specific spot
// export const addTheImages = (payload, id) => async (dispatch) => {
//   const res = [];
//   for (let i = 0; i < payload.length; i++) {
//     res.push(
//       await csrfFetch(`/api/spots/${id}/images`, {
//         method: "POST",
//         body: JSON.stringify(payload[i]),
//       })
//     );
//   }
//   console.log("this is the actual Images array", res);
//   // Assuming that the response contains the new images that were added to the spot
//   const normalizedImages = normalizer(res);
//   // Dispatching the action to add the new images to the specific spot
//   normalizedImages.forEach((image) => {
//     dispatch(addImageToSpot(id, image));
//   });
// };

// const defaultState = {};

// // Reducer to handle the images update for a specific spot
// export default function spotImagesReducer(state = defaultState, { type, payload, spotId, image }) {
//   switch (type) {
//     case ADD_THE_IMAGES: {
//       return {
//         ...state,
//         [spotId]: {
//           ...state[spotId], // Preserve existing spot data
//           images: state[spotId]?.images ? [...state[spotId].images, image] : [image], // Add new image(s)
//         },
//       };
//     }
//     default:
//       return state;
//   }
// }



import { csrfFetch } from "./csrf";

const ADD_THE_IMAGES = "spots/addImageToSpot";
const UPDATE_IMAGES = "spots/updateImages";

// Action creator to add the image to a specific spot
const addImageToSpot = (spotId, image) => {
  return {
    type: ADD_THE_IMAGES,
    spotId,
    image,
  };
};

const updateImagesForSpot = (spotId, images) => {
  return {
    type: UPDATE_IMAGES,
    spotId,
    images,
  };
};



// // Thunk action to add images to a specific spot
// export const addTheImages = (payload, id) => async (dispatch) => {
//   const res = await Promise.all(
//     payload.map(
//       (imageData) =>
//         csrfFetch(`/api/spots/${id}/images`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(imageData),
//         }).then((response) => response.json()) // Ensure the response is parsed to JSON
//     )
//   );


//   // Dispatch the action to add each new image to the specific spot
//   res.forEach((image) => {
//     dispatch(addImageToSpot(id, image));
//   });
// };



import { useNavigate } from "react-router-dom"; // Updated import

export const addTheImages = (payload, id) => async (dispatch) => {
  try {
    const res = await Promise.all(
      payload.map((imageData) =>
        csrfFetch(`/api/restaurants/${id}/images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(imageData),
        }).then((response) => response.json())
      )
    );

    // Dispatch the action to add each new image to the specific spot
    res.forEach((image) => {
      dispatch(addImageToSpot(id, image));
    });

    // Assuming you're using `useNavigate` from react-router v6+
    const navigate = useNavigate();
    navigate(`/restaurants/${id}`); // Navigate to the spot page after successful image upload
  } catch (error) {
    console.error("Error while adding images:", error);
  }
};




export const updateImages = (images, restaurantId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/restaurantss/${restaurantId}/images`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(images),
    });

    if (response.ok) {
      const updatedImages = await response.json();
      dispatch(updateImagesForSpot(restaurantId, updatedImages));
    } else {
      const error = await response.json();
      console.error("Error updating images:", error);
    }
  } catch (err) {
    console.error("Network error while updating images:", err);
  }
};


// Reducer to handle the images update for a specific spot
const defaultState = {};

const spotsImagesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_THE_IMAGES:
      return {
        ...state,
        [action.spotId]: [...(state[action.spotId] || []), action.image],
      };
    case UPDATE_IMAGES:
      return {
        ...state,
        [action.spotId]: action.images,
      };
    default:
      return state;
  }
};


export default spotsImagesReducer;