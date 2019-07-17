const express=require('express');
const sequelize = require('./util/database');
const bodyParser=require('body-parser');
const teams_route=require('./routes/api/teams');
const users_route=require('./routes/api/users');
const chat_route=require('./routes/api/chat');
const socketIO=require('./util/socket');
const socketAuth=require('./middleware/is-auth-socket');
const ChatController=require('./Controller/chat-socket');
const UserController=require('./Controller/users');


const app=express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();

});
app.use('/public',express.static('public'));



app.get('/', (req, res) => res.send('Hello World'));
app.use('/api/users',users_route);
app.use('/api/team',teams_route);
app.use('/api/chat',chat_route);

const port=process.env.PORT || 5000;


sequelize
    .sync({})
    .then(result => {
     const server =app.listen(port);
        const io=socketIO.init(server);
        io.use((socket, next) => {
            console.log('Pokusaj konekcije');
            let token = socket.handshake.query.token;
          const userId=socketAuth.checkAuth(token);
            if (userId!==null) {
                return next();
            }
            return next(new Error('authentication error'));
        });
        io.on('connection', socket => {
            console.log('Client connected');
            const userId=socket.handshake.query.id;
            UserController.SocketConnected(userId);

            socket.on('user-message',payload=>{
             ChatController.receiveUserMessage(payload).then(data=>{
                 if(data.receivedUserId!==data.senderUserId){
                 io.sockets.emit('user-message-cl-'+data.receivedUserId,data);
                 io.sockets.emit('user-message-cl-'+data.senderUserId,data);}else{
                     io.sockets.emit('user-message-cl-'+data.receivedUserId,data);
                 }
                 }
             ).catch(err=>{
                 io.sockets.emit('user-message-cl','null');}
             );
            });
            socket.on('team-message',payload=>{
             ChatController.receiveTeamMessage(payload).then(data=>{
                 console.log(data.teamid);
                 io.sockets.emit('team-message-cl-'+data.teamid,data);
             }).catch(err=>{
                 io.sockets.emit('team-message-cl','null');
             })
            });
            socket.on("disconnect", () => {
                console.log("user disconnected");
               UserController.SocketDisconnect(userId);
            });
        });
    })
    .catch(err => {
        console.log(err);
    });




