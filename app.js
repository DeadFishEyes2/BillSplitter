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
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/bill', billRoutes);

let bills = []; // Move this here to ensure global access

io.on('connection', (socket) => {
  socket.on('join bill', (billId) => {
    socket.join(billId);
  });

  socket.on('select item', (data) => {
    const bill = bills.find(b => b.id === data.billId);
    if (bill) {
      const item = bill.items.find(i => i.name === data.itemName);
      if (item) {
        item.selectedBy = data.userColor;
        io.to(data.billId).emit('item selected', data);
      }
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
