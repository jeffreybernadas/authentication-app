import { NavigateFunction } from "react-router-dom";

export let navigate: NavigateFunction = () => {};
/**
 * This function is used to set the navigate function from react-router-dom to be used in functions that are not components.
 * @param fn
 */
export const setNavigate = (fn: NavigateFunction) => {
  navigate = fn;
};
