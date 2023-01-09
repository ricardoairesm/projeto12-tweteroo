import express from 'express';
import cors from 'cors';

//criando app
const app = express();
app.use(express.json());
app.use(cors());

//criando o armazenamento global para os usuarios e tweets
const usuarios = [];
const tweets = [];
const fullBody = [];

// recebendo os dados do post pela rota /sign-up
app.post('/sign-up', (req, res) => {
	const usuario = req.body;
  usuarios.push(usuario);
  res.send("OK");
});

//recebendo os dados do tweet enviado pela rota /tweets
app.post('/tweets', (req, res) => {
	const tweet = req.body;

  //checando se pertence a um usuario existente
  for(let i = 0;i<usuarios.length;i++){
    if(tweet.username === usuarios[i].username){
      tweets.push(tweet);
      res.send("OK");
      fullBody.push({
        username: `${tweet.username}`,
        avatar: `${usuarios[i].avatar}`,
        tweet: `${tweet.tweet}`
      })
      //retorno antecipado para impedir a mensagem "UNAUTHORIZED"
      return;
    }   
  }
  res.send("UNAUTHORIZED");
});

app.get('/tweets', (req, res) => {
  res.send(fullBody);
});



app.listen(5000, () => {
  console.log('Rodando Servidor!')
})