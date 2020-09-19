import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
    stock: ['Drago','Petar'],
    selected: null
};

const addCustomStock=(state,action)=>{
    let newStock= state.stock.slice();

    newStock.push("Jos jedan");
    console.log(newStock);
    return updateObject(state,{stock:newStock});
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_CUSTOM_STOCK:
        return addCustomStock(state,action);
        default:
            return state
    }


};


export default reducer;
