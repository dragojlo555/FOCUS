import socketIOClient from 'socket.io-client';
let socket=null;
const url='http://localhost:5000?token=';

export const init=(token)=>{
    socket=socketIOClient(url+token);
    return socket;
};

export const get=(token)=>{
    console.log(socket);
  if(socket!==null){
      return socket
  }else{
        if(token!==null){
      init(token);}else{
            return null
        }
  }
};

export const close=()=>{
  if(socket!==null){
      socket.disconnect();
  }
};
