import {
  TOGGLE_MODAL,
  HANDLE_INTERVAL_CHANGE,
  HANDLE_ERROR,
} from "../actions/actions";

export const timeFrameReducer = (
  state: { isModalOpen: boolean; data: string; isError: boolean },
  action: { type: string; payload?: string }
) => {
  switch (action.type) {
    case TOGGLE_MODAL:
      return {
        ...state,
        isModalOpen: !state.isModalOpen,
      };
    case HANDLE_INTERVAL_CHANGE:
      return {
        ...state,
        data: action.payload,
        isError: false,
      };
    case HANDLE_ERROR:
      return {
        ...state,
        isError: true,
      };
    default:
      throw new Error();
  }
};
