import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export default function App() {
  const [meta, setMeta] = useState({ name: '', symbol: '', creatorId: '' });
  const [loggedInId, setLoggedInId] = useState('');
  const [myBalance, setMyBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState(0);
  const [mintTo, setMintTo] = useState('');
  const [mintAmount, setMintAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [explorerId, setExplorerId] = useState('');
  const [explorerResult, setExplorerResult] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/meta`).then(r => r.json()).then(setMeta);
    fetch(`${API_BASE}/total-supply`).then(r => r.json()).then(d => setTotalSupply(d.totalSupply));
  }, []);

  useEffect(() => {
    if (!loggedInId) return;
    fetch(`${API_BASE}/balance/${encodeURIComponent(loggedInId)}`).then(r => r.json()).then(d => setMyBalance(d.balance || 0));
  }, [loggedInId, message]); // refresh on message change

  async function handleLogin(e) {
    e.preventDefault();
    if (!loggedInId) setMessage('Enter an ID to login');
    else setMessage(`Logged in as ${loggedInId}`);
  }

  async function doTransfer(e) {
    e.preventDefault();
    setMessage('');
    const body = { from: loggedInId, to: transferTo, amount: Number(transferAmount) };
    const res = await fetch(`${API_BASE}/transfer`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) setMessage(data.error || 'Transfer failed');
    else {
      setMessage('Transfer successful!');
      // refresh balances
      const ts = await (await fetch(`${API_BASE}/total-supply`)).json();
      setTotalSupply(ts.totalSupply);
    }
  }

  async function doMint(e) {
    e.preventDefault();
    setMessage('');
    const body = { by: loggedInId, to: mintTo, amount: Number(mintAmount) };
    const res = await fetch(`${API_BASE}/mint`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) setMessage(data.error || 'Mint failed');
    else {
      setMessage('Mint successful!');
      setTotalSupply(data.totalSupply);
    }
  }

  async function checkExplorer(e) {
    e.preventDefault();
    const id = explorerId.trim();
    if (!id) return;
    const res = await fetch(`${API_BASE}/balance/${encodeURIComponent(id)}`);
    const d = await res.json();
    setExplorerResult(d);
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui', padding: 20 }}>
      <h1 style={{ fontSize: 26, marginBottom: 8 }}>{meta.name} ({meta.symbol})</h1>
      <div style={{ marginBottom: 12 }}><strong>Total Supply:</strong> {totalSupply}</div>

      <form onSubmit={handleLogin} style={{ marginBottom: 12 }}>
        <label>Login / Use ID:&nbsp;
          <input value={loggedInId} onChange={e => setLoggedInId(e.target.value)} placeholder="your-user-id" />
        </label>
        <button style={{ marginLeft: 8 }} type="submit">Use ID</button>
      </form>

      <div style={{ marginBottom: 12 }}>
        <strong>Your ID:</strong> {loggedInId || '—'}<br />
        <strong>Your Balance:</strong> {myBalance}
      </div>

      <section style={{ borderTop: '1px solid #eee', paddingTop: 12, marginBottom: 12 }}>
        <h2>Transfer Tokens</h2>
        <form onSubmit={doTransfer}>
          <div>
            <label>Recipient ID: <input value={transferTo} onChange={e => setTransferTo(e.target.value)} /></label>
          </div>
          <div>
            <label>Amount: <input type="number" value={transferAmount} onChange={e => setTransferAmount(e.target.value)} /></label>
          </div>
          <div>
            <button type="submit">Send</button>
          </div>
        </form>
      </section>

      {loggedInId === meta.creatorId && (
        <section style={{ borderTop: '1px solid #eee', paddingTop: 12, marginBottom: 12 }}>
          <h2>Mint Tokens (Creator Only)</h2>
          <form onSubmit={doMint}>
            <div>
              <label>Recipient ID: <input value={mintTo} onChange={e => setMintTo(e.target.value)} /></label>
            </div>
            <div>
              <label>Amount: <input type="number" value={mintAmount} onChange={e => setMintAmount(e.target.value)} /></label>
            </div>
            <div>
              <button type="submit">Mint Tokens</button>
            </div>
          </form>
        </section>
      )}

      <section style={{ borderTop: '1px solid #eee', paddingTop: 12 }}>
        <h2>Explorer</h2>
        <form onSubmit={checkExplorer}>
          <label>Address ID: <input value={explorerId} onChange={e => setExplorerId(e.target.value)} /></label>
          <button style={{ marginLeft: 8 }} type="submit">Check</button>
        </form>
        {explorerResult && (
          <div style={{ marginTop: 8 }}>
            <strong>ID:</strong> {explorerResult.id} <br />
            <strong>Balance:</strong> {explorerResult.balance}
          </div>
        )}
      </section>

      <div style={{ marginTop: 12, color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</div>

      <footer style={{ marginTop: 18 }}>
        <small>Creator ID: {meta.creatorId}</small>
      </footer>
    </div>
  );
}