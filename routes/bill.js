const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

let bills = [];
let participants = {};

router.get('/new', (req, res) => {
  const billId = uuidv4();
  req.session.billId = billId;
  bills.push({ id: billId, items: [] });
  res.redirect(`/bill/creator/${billId}`);
});

router.get('/creator/:id', (req, res) => {
  const bill = bills.find(b => b.id === req.params.id);
  if (!bill) {
    return res.redirect('/');
  }
  res.render('bill-creator', { bill });
});

router.post('/add-item', (req, res) => {
  const { name, price } = req.body;
  const bill = bills.find(b => b.id === req.session.billId);
  if (bill) {
    bill.items.push({ name, price });
  }
  res.redirect(`/bill/creator/${req.session.billId}`);
});

router.post('/finish', async (req, res) => {
  const bill = bills.find(b => b.id === req.session.billId);
  if (!bill) {
    return res.redirect('/');
  }
  const qrCodeUrl = await QRCode.toDataURL(`${req.protocol}://${req.get('host')}/bill/join/${bill.id}`);
  res.render('qr-lobby', { qrCodeUrl, participants: participants[bill.id] || [], billId: bill.id });
});

router.get('/join/:id', (req, res) => {
  const bill = bills.find(b => b.id === req.params.id);
  if (!bill) {
    return res.redirect('/');
  }
  res.render('qr-lobby', { qrCodeUrl: '', participants: participants[bill.id] || [], billId: bill.id });
});

router.post('/join/:id', (req, res) => {
  const { name } = req.body;
  const billId = req.params.id;
  if (!participants[billId]) {
    participants[billId] = [];
  }
  const userColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  participants[billId].push({ name, color: userColor });
  res.render('qr-lobby', { qrCodeUrl: '', participants: participants[billId], billId });
});

router.post('/start/:id', (req, res) => {
  const billId = req.params.id;
  const bill = bills.find(b => b.id === billId);
  if (!bill) {
    return res.redirect('/');
  }
  res.render('selection', { bill, participants: participants[billId] });
});

module.exports = router;
