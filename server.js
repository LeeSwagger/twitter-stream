const app = new (require('express'))();
const Twitter = require('twitter');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = 3000;

server.listen(port);

app.get('/', (request, response) => response.sendFile(`${__dirname}/public/index.html`));

const client = new Twitter({
    consumer_key: 'xtK02bcJhHBhQ8rHvbABfUlOd',
    consumer_secret: 'WRGfIHv9oHEEMGJnWP3UGPKX8kWJET7XUvEUOEXsoLE5Jl7Nmf',
    access_token_key: '628575674-M71UkXrjvcgMHyhZiGQ0wAHYwxSjfhNFNT2MB5D6',
    access_token_secret: 'FDJOkk6xY35fMVQdTYImAmk51u1hwY3ubkLMW1bsu6phm'
});

const stream = client.stream('statuses/filter', {
    track: 'javascript, frontend, football'
})
    .on('data', tweet => io.emit('receive_tweet', tweet))
    .on('error', error => console.error(error));
