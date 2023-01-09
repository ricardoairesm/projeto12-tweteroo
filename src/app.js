import express from 'express';
import cors from 'cors';

//criando app
const app = express();
const PORT = 5000;
app.use(express.json());
app.use(cors());


//criando o armazenamento global para os usuarios e tweets
const usuarios = [];
const tweets = [];
const fullBody = [];

// dividindo os tweets para a paginação
function displayPagina(arr, pagina) {
  const lastTweets = [...arr].reverse();
  lastTweets.slice((pagina - 1) * 10, pagina * 10);
  return lastTweets;
}

// recebendo os dados do post pela rota /sign-up
app.post('/sign-up', (req, res) => {
  const usuario = req.body;
  //checando tipagem e se os campos estão vazios
  if (!usuario.username || !usuario.avatar || !(typeof usuario.username === "string") || !(typeof usuario.avatar === "string")) {
    return res.status(400).send("Todos os campos são obrigatórios!")
  }
  usuarios.push(usuario);
  res.status(201).send("OK");
});

//recebendo os dados do tweet enviado pela rota /tweets
app.post('/tweets', (req, res) => {
  const tweet = req.body;
  const { user } = req.headers
  //checando tipagem e se os campos estão vazios
  if (!tweet.tweet || !(typeof tweet.tweet === "string")) {
    return res.status(400).send('Todos os campos são obrigatórios!');
  }

  //checando se pertence a um usuario existente
  for (let i = 0; i < usuarios.length; i++) {
    if (user === usuarios[i].username) {
      tweets.push(tweet);
      res.status(201).send("OK");
      fullBody.push({
        username: `${user}`,
        avatar: `${usuarios[i].avatar}`,
        tweet: `${tweet.tweet}`
      })
      //retorno antecipado para impedir a mensagem "UNAUTHORIZED"
      return;
    }
  }
  res.status(401).send("UNAUTHORIZED");
});

app.get('/tweets', (req, res) => {
  const tweetListDisplay = fullBody.reverse().slice(0,10);
  //pegando a pagina que nos encontramos
  const page = Number(req.query.page);
  if (page) {
    if (page <= 0) { res.status(400).send('Informe uma página válida!'); }
    else { tweetListDisplay = displayPagina(fullBody, page); }
  }
  res.send(tweetListDisplay);
});

app.get('/tweets/:username', (req, res) => {
  const userTweets = fullBody.filter(tweet => tweet.username === req.params.username);
  res.send(userTweets);
})

app.listen(PORT, () => {
  console.log('Rodando Servidor!')
})