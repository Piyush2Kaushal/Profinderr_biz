// Import Dependencies
import { useReducer } from "react";
import PropTypes from "prop-types";

// Local Imports
import { AddProductFormContextProvider } from "./AddProductFormContext";
import { Delta } from "components/shared/form/TextEditor";

// ----------------------------------------------------------------------
const initialState = {
  formData: {
    general: {
      name: "",
      service_code: "",
      price: null,
      service_category_id: "",
      duration: null, // in minutes or hours
      is_active: true,
    },
    description: {
      short_description: "",
      description: new Delta(),
    },
    images: {
      cover: null, // label is "Logo / Main Image"
      gallery: [],
    },
  },
  stepStatus: {
    general: {
      isDone: false,
    },
    description: {
      isDone: false,
    },
    images: {
      isDone: false,
    },
  },
};
const reducerHandlers = {
  SET_FORM_DATA: (state, action) => {
    return {
      ...state,
      formData: {
        ...state.formData,
        ...action.payload,
      },
    };
  },
  SET_STEP_STATUS: (state, action) => {
    return {
      ...state,
      stepStatus: {
        ...state.stepStatus,
        ...action.payload,
      },
    };
  },
};

const reducer = (state, action) =>
  reducerHandlers[action.type]?.(state, action) || state;

export function AddProductFormProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <AddProductFormContextProvider value={value}>
      {children}
    </AddProductFormContextProvider>
  );
}

AddProductFormProvider.propTypes = {
  children: PropTypes.node,
};
