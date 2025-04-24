import { createSelector } from "reselect";
import { RootState } from "../store";

export const selectSavedItems = createSelector(
  (state: RootState) => state.savedItems.items,
  (items) => items
);
