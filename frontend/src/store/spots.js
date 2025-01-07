import { csrfFetch } from "./csrf";
import {updateImages} from "./spotsImages"

const CREATE_SPOT = "spots/CREATE";
const DELETE_SPOT = "spots/DELETE";
const GET_ALL_SPOTS = "spots/getAllSpots";
const GET_ONE_SPOT = "spots/getOneSpot";
const GET_CURRENT_USER_SPOTS = "spots/getCurrentUserSpots"
const UPDATE_SPOT = "spots/UPDATE";

const currentUserSpots = (payload) => {
  return {
    type: GET_CURRENT_USER_SPOTS,
    payload,
  };
};

const update = (payload) => {
  return {
    type: UPDATE_SPOT,
    payload,
  };
};

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





// Normalizer function
const normalizer = (array) => {
  const normalizedData = {};
  array.forEach((item) => {
    normalizedData[item.id] = item;
  });
  return normalizedData;
};



export const getCurrentUserSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");
  const data = await res.json();

  if (data && Array.isArray(data.Spots)) {
    const normalizedSpots = normalizer(data.Spots);
    dispatch(currentUserSpots(normalizedSpots));
  }
  return data;
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

export const updateSpot = (id, spotData, imagesPayload) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spotData),
  });

  if (response.ok) {
    const updatedSpot = await response.json();
    dispatch(update(updatedSpot));

    // Dispatch updateImages action to update the images
    if (imagesPayload && imagesPayload.length > 0) {
      await dispatch(updateImages({ images: imagesPayload }, id));
    }

    return updatedSpot;
  } else {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
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
    case GET_CURRENT_USER_SPOTS:
      return { ...state, ...payload };
    case UPDATE_SPOT:
      return { ...state, [payload.id]: payload };
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
