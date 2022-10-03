// export const initialState = false;
// export const userInitData = [];
export const reducer = (state, action) => {
    if(action.type==="USER"){
        return action.payload;
    }
    if(action.type==="USERINFO"){
        return action.payload;
    }
    if(action.type==="DEPT"){
        return action.payload;
    }
    return state;
}