// import { FETCH_FAILURE, FETCH_INIT, FETCH_SUCCESS } from "../actions/actions";

export const dataFetchReducer = (
  state: any,
  action: { type: any; payload?: any }
) => {
  switch (action.type) {
    case "TOGGLE_MODAL":
      return {
        ...state,
        isModalOpen: true,
      };
    case 2:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 3:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};
