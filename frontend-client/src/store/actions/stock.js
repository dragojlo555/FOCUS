import * as actionTypes from './actionTypes';
import axios from '../../axios-conf';


export const getAllStockCollection =(stock,error)=>{
    return{
        type:actionTypes.GET_ALL_STOCK,
        stock:stock
    }
};

export const addCustomStock=()=>{
  return{
      type:actionTypes.ADD_CUSTOM_STOCK
  }
};

export const getAll = () => {
    return dispatch => {
        const data = {};
        let url = "stock/";
        let options = {
            method: 'POST',
            url: url,
            data: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };
        axios(options).then(response => {
                if (response.status === 200) {
                    console.log(response.data);
                }
            }
        ).catch(err => {
                console.log(err.response);
            }
        );

    }
};
