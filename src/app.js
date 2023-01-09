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
  if (!username || typeof username !== 'string' || !avatar || typeof avatar !== 'string') {
    return res.status(400).send('Todos os campos são obrigatórios!');
  }
	const usuario = req.body;
  usuarios.push(usuario);
  res.send("OK");
});

//recebendo os dados do tweet enviado pela rota /tweets
app.post('/tweets', (req, res) => {
  if (!username || typeof username !== 'string' || !tweet || typeof tweet !== 'string') {
    return res.status(400).send('Todos os campos são obrigatórios!');
  }
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
  const lastTweets = fullBody.reverse();
  lastTweets.slice(0,10);
  res.send(lastTweets);
});



app.listen(5000, () => {
  console.log('Rodando Servidor!')
})