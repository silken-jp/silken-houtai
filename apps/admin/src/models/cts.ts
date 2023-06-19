import { useReducer } from 'react';

interface initialState {
  searchModal: {
    visible: boolean;
  };
}

const initialState = {
  searchModal: {
    visible: false,
  },
};

function reducer(state: initialState, action: any) {
  switch (action.type) {
    case 'handleSearchModal':
      return { ...state, ...action.payload };
    default:
      throw new Error();
  }
}

export default () => useReducer(reducer, initialState);
