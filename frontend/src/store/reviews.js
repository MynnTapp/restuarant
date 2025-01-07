import { csrfFetch } from "./csrf";

const CREATE_REVIEW = "reviews/add";
const DELETE_REVIEW = "reviews/remove";
const GET_ALL_REVIEWS = "reviews/getAllReviews";

const initialState = {};

const add = (review) => {
  return {
    type: CREATE_REVIEW,
    payload: review,
  };
};

const remove = (id) => {
  return {
    type: DELETE_REVIEW,
    payload: id,
  };
};

const getAll = (payload) => {
  return {
    type: GET_ALL_REVIEWS,
    payload,
  };
};

// const normalizer = (data) => {
//   const res = {};
//   console.log(data);
//   data.forEach((ele) => (res[ele.id] = ele));

//   return res;
// };


const normalizer = (data) => {
  if (!Array.isArray(data)) {
    console.error("Data is not an array:", data);
    return {};
  }

  const res = {};
  data.forEach((ele) => (res[ele.id] = ele));

  return res;
};



// export const getAllReviews = (id) => async (dispatch) => {
//   const res = await csrfFetch(`/api/spots/${id}/reviews`);
//   if (!res.errors) {
//     dispatch(getAll(normalizer(res.Reviews)));
//     return res;
//   }
// };



export const getAllReviews = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}/reviews`);
  const data = await res.json();
  

  if (data && data.Reviews && Array.isArray(data.Reviews)) {
    dispatch(getAll(normalizer(data.Reviews)));
  }
  return data;
};




// export const createReview = (review, id) => async (dispatch) => {
//   const options = {
//     method: "POST",
//     body: JSON.stringify(review),
//   };
//   const res = await csrfFetch(`/api/spots/${id}/reviews`, options);
//   if (!res.message) {
//     dispatch(add(res));
//   }
// };


export const createReview = (review, id) => async (dispatch) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  };
  const res = await csrfFetch(`/api/spots/${id}/reviews`, options);
  const data = await res.json();

  if (res.ok) {
    dispatch(add(data)); // Add the review directly
    dispatch(getAllReviews(id)); // Refresh reviews for consistency
    return data;
  }
};


export const deleteReview = (id) => async (dispatch) => {
  await csrfFetch(`/api/reviews/${id}`, {
    method: "DELETE",
  });

  dispatch(remove(id));
};

export default function reviewsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_ALL_REVIEWS: {
      return { ...payload };
    }
    case CREATE_REVIEW:
      return {
        ...state,
        [payload.id]: payload,
      };
    case DELETE_REVIEW: {
      const newState = { ...state };
      delete newState[payload];
      return newState;
    }
    default:
      return state;
  }
}
