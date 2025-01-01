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

const normalizer = (payload) => {
  const res = {};

  payload.forEach((ele) => (res[ele.id] = ele));

  return res;
};

// export const getAllSpots = () => async (dispatch) => {
//   const res = await csrfFetch("/api/spots");
//   const spots = [];
//   for (let i = 0; i < res.Spots.length; i++) {
//     spots.push(normalizer(res.Spots[i].SpotImages));
//   }
//   for (let i = 0; i < res.Spots.length; i++) {
//     res.Spots[i].SpotImages = spots[i];
//   }
//   dispatch(allSpots(normalizer(res.Spots)));
//   return res;
// };



export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const data = await res.json();
  console.log("Parsed API Response:", data);

  if (data && data.Spots && Array.isArray(data.Spots)) {
    console.log("Spots array:", data.Spots);
    const spots = [];
    for (let i = 0; i < data.Spots.length; i++) {
      if (data.Spots[i].SpotImages) {
        spots.push(normalizer(data.Spots[i].SpotImages));
        console.log(`Normalized SpotImages for spot ${i}:`, spots[i]);
      }
    }
    for (let i = 0; i < data.Spots.length; i++) {
      data.Spots[i].SpotImages = spots[i] || {};
    }
    console.log("All Spots after normalization:", data.Spots);
    dispatch(allSpots(normalizer(data.Spots)));
  }
  return data;
};




export const getOneSpot = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`);
  console.log("this is the spot ===> ", res);
  const SpotImages = normalizer(res.SpotImages);
  res.SpotImages = SpotImages;
  dispatch(getSpot(res));
};

export const addASpot = (spot) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify(spot),
  });
  if (!res.errors) {
    dispatch(add(res));
    return res;
  }
  return res;
};

export const removeSpot = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`, {
    method: "DELETE",
  });

  if (!res.errors) {
    dispatch(remove());
  }
};

const initialState = {};

export default function spotsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_ALL_SPOTS:
      return { ...state, ...payload };
    case CREATE_SPOT:
      return { ...state, [payload.id]: payload };
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState[payload];
      return newState;
    }
    case GET_ONE_SPOT: {
      const newState = {
        ...state,
        [payload.id]: {
          ...payload,
          SpotImages: { ...payload.SpotImages },
          Owner: { ...payload.Owner },
        },
      };
      return newState;
    }
    default:
      return state;
  }
}
