const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');

let bills = [];
let participants = {};

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

router.get('/create', (req, res) => {
  res.render('bill-creator');
});

router.post('/create', (req, res) => {
  const { name, items } = req.body;
  const id = generateId();
  const newBill = { id, name, items: items.split(',').map(item => ({ name: item.trim(), selectedBy: [] })) };
  bills.push(newBill);
  participants[id] = [];
  res.redirect(`/bill/qr-lobby/${id}`);
});

router.get('/qr-lobby/:id', async (req, res) => {
  const billId = req.params.id;
  const bill = bills.find(b => b.id === billId);
  if (!bill) {
    return res.redirect('/');
  }

  const qrCodeUrl = await QRCode.toDataURL(`${req.protocol}://${req.get('host')}/bill/join/${billId}`);
  res.render('qr-lobby', { qrCodeUrl, billId, participants: participants[billId] });
});

router.post('/join/:id', (req, res) => {
  const { name } = req.body;
  const billId = req.params.id;
  if (!participants[billId]) {
    participants[billId] = [];
  }
  const userColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  participants[billId].push({ name, color: userColor });
  res.redirect(`/bill/qr-lobby/${billId}`);
});

router.post('/start/:id', (req, res) => {
  const billId = req.params.id;
  const bill = bills.find(b => b.id === billId);
  if (!bill) {
    return res.redirect('/');
  }
  res.render('selection', { bill, participants: participants[billId] });
});

router.post('/select-item/:id', (req, res) => {
  const billId = req.params.id;
  const { itemName, userName, userColor } = req.body;
  const bill = bills.find(b => b.id === billId);
  if (bill) {
    const item = bill.items.find(i => i.name === itemName);
    if (item) {
      if (!item.selectedBy) {
        item.selectedBy = [];
      }
      item.selectedBy.push({ name: userName, color: userColor });
    }
  }
  res.json({ success: true });
});

module.exports = router;
