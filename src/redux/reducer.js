const initState = {
    users: {},
    files: {},
};

export const storeData = (state = initState, action) => {
    switch (action.type) {
        case 'UPDATE_USERS': {
            return { ...state, users: action.users };
        }
        case 'UPDATE_FILES': {
            return { ...state, files: action.files };
        }
        default: {
            return state;
        }
    }
};
