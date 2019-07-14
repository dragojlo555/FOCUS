import socketIOClient from 'socket.io-client';
let socket=null;
const url='http://localhost:5000?token=';

export const init=(token,userId)=>{
    socket=socketIOClient(url+token+'&id='+userId);
    return socket;
};

export const get=(token,userId)=>{
  if(socket!==null){
      return socket
  }else{
        if(token!==null){
      init(token,userId);}else{
            return null
        }
  }
};

export const close=()=>{
  if(socket!==null){
      socket.disconnect();
  }
};
