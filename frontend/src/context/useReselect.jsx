import { createSelector } from "reselect";

export default function useReselect(func) {
  const memoizedSelector = createSelector(func, (obj) => Object.values(obj));
  return memoizedSelector();
}
