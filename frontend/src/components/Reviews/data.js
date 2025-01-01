import { createSelector } from "reselect";

export const getCurrUser = createSelector(
  (state) => state.session,
  (session) => session.user
);
