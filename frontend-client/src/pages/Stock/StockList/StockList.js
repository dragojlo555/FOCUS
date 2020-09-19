import React,{Component} from "react";
import {connect,useDispatch,useSelector} from 'react-redux';
import {Button} from "antd";
import {addCustomStock} from "../../../store/actions/stock";


const StockList=(props)=>{
    const dispatch = useDispatch();
    const store=useSelector(state=>state.stock);

        return(
            <>
                <div>
                    {store.stock}'
                </div>
                <Button onClick={()=>{console.log("Pericaaa")}}>Drugi klik</Button>
                <Button onClick={()=>{dispatch(addCustomStock())}}>Please click</Button>
            </>
        )

}



export default StockList;
