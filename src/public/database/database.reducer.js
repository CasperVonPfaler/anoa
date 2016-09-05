export const database = (state = {}, action) => {
  switch (action.type) {
    case 'DATABASE_SET':
      return action.payload;
    default:
      return state;
  }
};
