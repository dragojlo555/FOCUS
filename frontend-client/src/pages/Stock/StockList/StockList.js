import React,{Component} from "react";
import {connect} from 'react-redux';


class StockList extends Component{


    render(){
        return(
            <>
                <div>
                    Drago Vrban
                </div>
            </>
        )
    }

}
const mapStateToProps = state =>{
  return{
      stock:state.stock.stock,
      selected:state.stock.selected
  }
};

const mapDispatchToProps = dispatch =>{
    return{

    }
};


export default connect(mapStateToProps,mapDispatchToProps)(StockList);