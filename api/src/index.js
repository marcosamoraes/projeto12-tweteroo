import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());

new class User {
  username
  avatar
}

new class Tweet {
  username
  tweet
}

app.get('/', (req, res) => {

});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
}