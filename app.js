const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const billRoutes = require('./routes/bill');

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/bill', billRoutes);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
