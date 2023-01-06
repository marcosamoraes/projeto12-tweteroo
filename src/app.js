import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

class User {
  constructor (username, avatar) {
    this.username = username;
    this.avatar = avatar;
  }
}

class Tweet {
  constructor (user, tweet) {
    this.user = user;
    this.tweet = tweet;
  }
}

const users = []
const tweets = []

function paginate(array, pageNumber) {
  const pageSize = 10;
  const newArray = [...array].reverse()
  return newArray.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

app.post('/sign-up', (req, res) => {
  const username = req.body.username;
  const avatar = req.body.avatar;

  if (!username || !avatar || typeof username !== 'string' || typeof avatar !== 'string') {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  users.push(new User(username, avatar));
  res.status(201).send('OK');
});

app.post('/tweets', (req, res) => {
  const username = req.headers.user;
  const tweet = req.body.tweet;

  if (!username || !tweet || typeof username !== 'string' || typeof tweet !== 'string') {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  const user = users.find(user => user.username === username);

  if (!user) {
    return res.sendStatus(401);
  }

  tweets.push(new Tweet(user, tweet));
  res.status(201).send('OK');
});

app.get('/tweets', (req, res) => {
  let lastTweets = [];
  if (req.query.page) {
    const page = req.query.page;

    if (page < 1) return res.status(400).send('Informe uma página válida.');

    lastTweets = paginate(tweets, page);
  } else {
    lastTweets = tweets.slice(-10);
  }

  const response = [];
  lastTweets.map(tweet => {
    response.push({
      username: tweet.user.username,
      avatar: tweet.user.avatar,
      tweet: tweet.tweet,
    });
  });

  res.send(response);
});

app.get('/tweets/:username', (req, res) => {
  const userTweets = tweets.filter(tweet => tweet.user.username === req.params.username);

  const response = [];
  userTweets.map(tweet => {
    response.push({
      username: tweet.user.username,
      avatar: tweet.user.avatar,
      tweet: tweet.tweet,
    });
  });

  res.send(response);
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});