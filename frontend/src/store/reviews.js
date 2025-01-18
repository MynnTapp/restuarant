import { csrfFetch } from "./csrf";
import { getOneSpot } from "./spots";
import { getAllSpots } from "./spots";
const CREATE_REVIEW = "reviews/add";
const DELETE_REVIEW = "reviews/remove";
const GET_ALL_REVIEWS = "reviews/getAllReviews";
const UPDATE_REVIEW = "reviews/update";  // New action type for updating review

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


const update = (review) => {
  return {
    type: UPDATE_REVIEW,
   payload: review, // Return the updated review
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
  const res = await csrfFetch(`/api/restaurants/${id}/reviews`);
  const data = await res.json();
  

  if (data && data.Reviews && Array.isArray(data.Reviews)) {
    dispatch(getAll(normalizer(data.Reviews)));
  }
  return data;
};




// export const createReview = (review, id) => async (dispatch) => {
//   const options = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(review),
//   };
//   const res = await csrfFetch(`/api/spots/${id}/reviews`, options);
//   const data = await res.json();

//   if (res.ok) {
//     dispatch(add(data)); // Add the review directly
//     dispatch(getAllReviews(id)); // Refresh reviews for consistency
//     return data;
//   }
// };




export const createReview = (review, id) => async (dispatch) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  };
  const res = await csrfFetch(`/api/restaurants/${id}/reviews`, options);
  const data = await res.json();

  if (res.ok) {
    dispatch(add(data)); // Add the review directly
    dispatch(getAllReviews(id)); // Refresh reviews for consistency
    dispatch(getOneSpot(id)); // Refresh spot details to update review count
    dispatch(getAllSpots()); // Refresh all spots to update review counts on the landing page
    return data;
  }
};


export const deleteReview = (id) => async (dispatch) => {
  await csrfFetch(`/api/reviews/${id}`, {
    method: "DELETE",
  });

  dispatch(remove(id));
};


export const updateReview = (review, id) => async (dispatch) => {
  const options = {
    method: "PUT", // Use PUT for updating
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  };

  const res = await csrfFetch(`/api/reviews/${id}`, options);
  const data = await res.json();

  if (res.ok) {
    dispatch(update(data)); // Dispatch the updated review
    dispatch(getAllReviews(review.restaurantId)); // Refresh reviews for consistency
    return data;
  }
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
    case UPDATE_REVIEW: {
      return {
        ...state,
        [payload.id]: {
          ...state[payload.id], // Keep the other properties intact if needed
          review: payload.review, // Update the review content
          stars: payload.stars, // Update the stars rating
        },
      };
    }
    case DELETE_REVIEW: {
      const newState = { ...state };
      delete newState[payload];
      return newState;
    }
    default:
      return state;
  }
}
