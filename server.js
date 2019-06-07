const express = require('express');
const bodyParser = require('body-parser');
const memsourceApi = require('./lib/memsource');

const app = express();
const port = process.env.PORT || 3000;

// Set as root
app.use(express.static('client'));

// parse data as URL encoded
app.use(bodyParser.urlencoded({
  extended: true,
}));

// parse data as JSON
app.use(bodyParser.json());

// access to node_modules
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// login user
app.post('/api/login', async (req, res) => {
  try {
    console.log(req.body);
    const { userName, password } = req.body;
    const data = await memsourceApi.login(userName, password);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (error) {
    console.log('error');
  }
});

// redirect to index.html
app.use((req, res) => res.sendFile(`${__dirname}/client/index.html`));

//port 3000
app.listen(port, () => {
  console.log('port ', port);
});