// export const updateUsers = () => {
//     return { type: 'UPDATE_USERS' };
// };

import { getUsers, getFiles } from '../utils/firebase';

export const updateUsers = (args) => async (dispatch) => {
    try {
        getUsers((users) => {
            dispatch({
                type: 'UPDATE_USERS',
                users,
            });
        });
    } catch (error) {
        console.log(error);
    }
};

export const updateFiles = (args) => async (dispatch) => {
    try {
        getFiles((files) => {
            dispatch({
                type: 'UPDATE_FILES',
                files,
            });
        });
    } catch (error) {
        console.log(error);
    }
};
