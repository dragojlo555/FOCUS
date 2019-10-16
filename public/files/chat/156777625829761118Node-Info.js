npm install --save mysql2 --Za komunikaciju za bazom
npm isntall --save sequelize --za sequelize dodatak (za ovo je potreban mysql2 paket)
npm i -D nodemon ----Za auto osvjezavanje sadrzaja
Nakon toga mozemo koristi  npm run server ---ako se sledeci sadrzaj doda u skriptu
"  "start": "node server.js",
    "server": "nodemon server.js"
	
	
OBAVEZNO OSTALE INSTALACIJE
npm install -i paket


Update u NodeJS vraca broj izmjenjenih redova

/* UserTeam.findAll({where:{userId: req.userId, teamId: idTeamReq},include:[{model:User},{model:Team}]}).then(
     result=>{
             res.status(200).json({msg:'Success',userTeam:result});
     }
 ).catch(err=>{
         res.status(400).json({msg:'Failed',error:err})
 });*/---inner join


Za webSocket-----
https://itnext.io/building-a-node-js-websocket-chat-app-with-socket-io-and-react-473a0686d1e1

