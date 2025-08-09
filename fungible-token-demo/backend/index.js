const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// CONFIG: token metadata and creator id
const TOKEN_NAME = 'EduCoin';
const TOKEN_SYMBOL = 'EDU';
const CREATOR_ID = 'creator-1'; // change as needed for demo

// In-memory Ledger
let totalSupply = 1000000; // initial total supply
const balances = new Map();

// Give all initial tokens to creator
balances.set(CREATOR_ID, totalSupply);

// Helper
function getBalance(id) {
  return balances.get(id) || 0;
}

// Public endpoints
app.get('/meta', (req, res) => {
  res.json({ name: TOKEN_NAME, symbol: TOKEN_SYMBOL, creatorId: CREATOR_ID });
});

app.get('/total-supply', (req, res) => {
  res.json({ totalSupply });
});

app.get('/balance/:id', (req, res) => {
  const id = req.params.id;
  res.json({ id, balance: getBalance(id) });
});

// Transfer endpoint
app.post('/transfer', (req, res) => {
  const { from, to, amount } = req.body;
  if (!from || !to || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid payload. Provide from, to, amount (number).' });
  }
  const senderBal = getBalance(from);
  if (senderBal < amount) {
    return res.status(400).json({ error: 'Not enough tokens' });
  }
  balances.set(from, senderBal - amount);
  balances.set(to, getBalance(to) + amount);
  return res.json({ success: true, message: 'Transfer successful', from, to, amount });
});

// Mint endpoint (only creator)
app.post('/mint', (req, res) => {
  const { by, to, amount } = req.body;
  if (by !== CREATOR_ID) {
    return res.status(403).json({ error: 'Only creator can mint tokens' });
  }
  if (!to || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  totalSupply += amount;
  balances.set(to, getBalance(to) + amount);
  return res.json({ success: true, message: 'Mint successful', to, amount, totalSupply });
});

// Simple explorer: list all addresses and balances (for demo only)
app.get('/explorer', (req, res) => {
  const items = [];
  for (const [id, bal] of balances.entries()) items.push({ id, balance: bal });
  res.json({ items, totalSupply });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Fungible token backend running on http://localhost:${PORT}`);
});