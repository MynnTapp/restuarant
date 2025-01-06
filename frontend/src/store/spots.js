import { csrfFetch } from "./csrf";

const CREATE_SPOT = "spots/CREATE";
const DELETE_SPOT = "spots/DELETE";
const GET_ALL_SPOTS = "spots/getAllSpots";
const GET_ONE_SPOT = "spots/getOneSpot";

const add = (payload) => {
  return {
    type: CREATE_SPOT,
    payload,
  };
};

const getSpot = (payload) => {
  return {
    type: GET_ONE_SPOT,
    payload,
  };
};

const remove = () => {
  return {
    type: DELETE_SPOT,
  };
};

const allSpots = (payload) => {
  return {
    type: GET_ALL_SPOTS,
    payload,
  };
};

// const normalizer = (payload) => {
//   const res = {};

//   payload.forEach((ele) => (res[ele.id] = ele));

//   return res;
// };



// const normalizer = (payload) => {
//   if (!Array.isArray(payload)) {
//     console.error("Payload is not an array:", payload);
//     return {};
//   }

//   const res = {};

//   payload.forEach((ele) => (res[ele.id] = ele));

//   return res;
// };
/////////////////////////////////////////////////////////////////////
// const normalizer = (payload) => {
//   const normalizedData = {};
//   payload.forEach((spot) => {
//     normalizedData[spot.id] = spot;
//   });
//   return normalizedData;
// };
//////////////////////////////////////////////////////////////////////////////



// export const getAllSpots = () => async (dispatch) => {
//   const res = await csrfFetch("/api/spots");
//   const data = await res.json();
//   console.log("Parsed API Response:", data);

//   if (data && data.Spots && Array.isArray(data.Spots)) {
//     console.log("Spots array:", data.Spots);
//     const spots = [];
//     for (let i = 0; i < data.Spots.length; i++) {
//       if (data.Spots[i].SpotImages) {
//         spots.push(normalizer(data.Spots[i].SpotImages));
//         console.log(`Normalized SpotImages for spot ${i}:`, spots[i]);
//       }
//     }
//     for (let i = 0; i < data.Spots.length; i++) {
//       data.Spots[i].SpotImages = spots[i] || {};
//     }
//     console.log("All Spots after normalization:", data.Spots);
//     dispatch(allSpots(normalizer(data.Spots)));
//   }
//   return data;
// };




// export const getOneSpot = (id) => async (dispatch) => {
//   const res = await csrfFetch(`/api/spots/${id}`);
//   console.log("this is the spot ===> ", res);
//   const SpotImages = normalizer(res.SpotImages);
//   res.SpotImages = SpotImages;
//   dispatch(getSpot(res));
// };

///////////////////////////////////////////////////////////////////////////////////////////////////


// export const getAllSpots = () => async (dispatch) => {
//   const res = await csrfFetch("/api/spots");
//   const data = await res.json();
//   console.log("Parsed API Response:", data);

//   if (data && data.Spots && Array.isArray(data.Spots)) {
//     console.log("Spots array:", data.Spots);
//     const spots = [];
//     for (let i = 0; i < data.Spots.length; i++) {
//       if (data.Spots[i].SpotImages) {
//         spots.push(normalizer(data.Spots[i].SpotImages));
//         console.log(`Normalized SpotImages for spot ${i}:`, spots[i]);
//       }
//     }
//     for (let i = 0; i < data.Spots.length; i++) {
//       data.Spots[i].SpotImages = spots[i] || {};
//     }
//     console.log("All Spots after normalization:", data.Spots);
//     dispatch(allSpots(normalizer(data.Spots)));
//   }
//   return data;
// };

// export const getOneSpot = (id) => async (dispatch) => {
//   const res = await csrfFetch(`/api/spots/${id}`);
//   const data = await res.json();
//   console.log("Parsed Spot API Response:", data);

//   if (data && data.SpotImages) {
//     const SpotImages = normalizer(data.SpotImages);
//     data.SpotImages = SpotImages;
//   }
//   dispatch(getSpot(data));
// };





// // export const addASpot = (spot) => async (dispatch) => {
// //   const res = await csrfFetch("/api/spots", {
// //     method: "POST",
// //     body: JSON.stringify(spot),
// //   });
// //   if (!res.errors) {
// //     dispatch(add(res));
// //     return res;
// //   }
// //   return res;
// // };



// export const addASpot = (spot) => async (dispatch) => {
//   const res = await csrfFetch("/api/spots", {
//     method: "POST",
//     body: JSON.stringify(spot),
//   });

//   if (res.ok) {
//     const newSpot = await res.json(); // Parse the response
//     dispatch(add(newSpot)); // Dispatch the parsed data
//     return newSpot;
//   } else {
//     const error = await res.json();
//     console.error("Error creating spot:", error);
//     return error;
//   }
// };


// export const removeSpot = (id) => async (dispatch) => {
//   const res = await csrfFetch(`/api/spots/${id}`, {
//     method: "DELETE",
//   });

//   if (!res.errors) {
//     dispatch(remove());
//   }
// };

// const initialState = {};

// export default function spotsReducer(state = initialState, { type, payload }) {
//   switch (type) {
//     case GET_ALL_SPOTS:
//       return normalizer(payload);
//     case CREATE_SPOT:
//       return { ...state, [payload.id]: payload };
//     case DELETE_SPOT: {
//       const newState = { ...state };
//       delete newState[payload];
//       return newState;
//     }
//     case GET_ONE_SPOT: {
//       const newState = {
//         ...state,
//         [payload.id]: {
//           ...payload,
//           SpotImages: { ...payload.SpotImages },
//           Owner: { ...payload.Owner },
//         },
//       };
//       return newState;
//     }
//     default:
//       return state;
//   }
// }



// Normalizer function
const normalizer = (array) => {
  const normalizedData = {};
  array.forEach((item) => {
    normalizedData[item.id] = item;
  });
  return normalizedData;
};

// Thunks
export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const data = await res.json();

  if (data && Array.isArray(data.Spots)) {
    const normalizedSpots = normalizer(data.Spots);
    dispatch(allSpots(normalizedSpots)); // Dispatch normalized spots
  }
  return data;
};

export const getOneSpot = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`);
  const data = await res.json();

  if (data && Array.isArray(data.SpotImages)) {
    data.SpotImages = normalizer(data.SpotImages);
  }

  dispatch(getSpot(data));
};

export const addASpot = (spot) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const newSpot = await res.json();
    dispatch(add(newSpot));
    return newSpot;
  } else {
    const error = await res.json();
    console.error("Error creating spot:", error);
    return error;
  }
};

export const removeSpot = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(remove(id)); // Pass the ID to the reducer
  }
};

// Reducer
const initialState = {};

export default function spotsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_ALL_SPOTS:
      return { ...payload }; // Replace state with normalized spots
    case CREATE_SPOT:
      return { ...state, [payload.id]: payload };
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState[payload];
      return newState;
    }
    case GET_ONE_SPOT: {
      return {
        ...state,
        [payload.id]: {
          ...payload,
          SpotImages: { ...payload.SpotImages },
          Owner: { ...payload.Owner },
        },
      };
    }
    default:
      return state;
  }
}
