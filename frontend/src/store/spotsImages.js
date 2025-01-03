import { csrfFetch } from "./csrf";

const ADD_THE_IMAGES = "spots/addImageToSpot";

// Action creator to add the image to a specific spot
const addImageToSpot = (spotId, image) => {
  return {
    type: ADD_THE_IMAGES,
    spotId,
    image,
  };
};

// Normalizer function (still useful if you need to normalize payload)
const normalizer = (payload) => {
  const res = {};

  payload.forEach((ele) => {
    res[ele.id] = ele;
  });

  return res;
};

// Thunk action to add images to a specific spot
export const addTheImages = (payload, id) => async (dispatch) => {
  const res = [];
  for (let i = 0; i < payload.length; i++) {
    res.push(
      await csrfFetch(`/api/spots/${id}/images`, {
        method: "POST",
        body: JSON.stringify(payload[i]),
      })
    );
  }
  console.log("this is the actual Images array", res);
  // Assuming that the response contains the new images that were added to the spot
  const normalizedImages = normalizer(res);
  // Dispatching the action to add the new images to the specific spot
  normalizedImages.forEach((image) => {
    dispatch(addImageToSpot(id, image));
  });
};

const defaultState = {};

// Reducer to handle the images update for a specific spot
export default function spotImagesReducer(state = defaultState, { type, payload, spotId, image }) {
  switch (type) {
    case ADD_THE_IMAGES: {
      return {
        ...state,
        [spotId]: {
          ...state[spotId], // Preserve existing spot data
          images: state[spotId]?.images ? [...state[spotId].images, image] : [image], // Add new image(s)
        },
      };
    }
    default:
      return state;
  }
}
