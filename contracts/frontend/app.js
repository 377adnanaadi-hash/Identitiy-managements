// === Set your deployed contract address here ===
const CONTRACT_ADDRESS = "PASTE_DEPLOYED_ADDRESS_HERE";

// Minimal ABI for the contract methods used in the UI
const ABI = [
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"dids","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"caller","type":"address"}],"name":"isDelegate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"delegateAddr","type":"address"}],"name":"grantDelegate","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"delegateAddr","type":"address"}],"name":"revokeDelegate","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"string","name":"did","type":"string"}],"name":"setDID","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"setAttribute","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"string","name":"key","type":"string"}],"name":"getAttribute","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}
];

let provider, signer, contract, myAddr;

async function connect() {
  if (!window.ethereum) {
    alert("MetaMask not detected. Please install it.");
    return;
  }
  provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  myAddr = accounts[0];
  signer = await provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  document.getElementById("connectBtn").innerText =
    "Connected: " + myAddr.slice(0,6) + "..." + myAddr.slice(-4);
  document.getElementById("contractAddr").innerText = CONTRACT_ADDRESS;

  // Load current DID
  const did = await contract.dids(myAddr);
  document.getElementById("currentDid").innerText = did || "—";
}

async function setDid() {
  const val = document.getElementById("didInput").value.trim();
  if (!val) return alert("Enter DID string");
  const tx = await contract.setDID(val);
  await tx.wait();
  const did = await contract.dids(myAddr);
  document.getElementById("currentDid").innerText = did || "—";
}

async function setAttr() {
  const user = document.getElementById("attrUser").value.trim() || myAddr;
  const key = document.getElementById("attrKey").value.trim();
  const value = document.getElementById("attrValue").value.trim();
  if (!key) return alert("Enter attribute key");
  const tx = await contract.setAttribute(user, key, value);
  await tx.wait();
  alert("Attribute set!");
}

async function getAttr() {
  const user = document.getElementById("attrUser").value.trim() || myAddr;
  const key = document.getElementById("getKey").value.trim();
  if (!key) return alert("Enter key to read");
  const val = await contract.getAttribute(user, key);
  document.getElementById("attrValueOut").innerText = val || "—";
}

async function grant() {
  const d = document.getElementById("delegateAddr").value.trim();
  if (!d) return alert("Enter delegate address");
  const tx = await contract.grantDelegate(d);
  await tx.wait();
  alert("Delegate granted!");
}

async function revoke() {
  const d = document.getElementById("delegateAddr").value.trim();
  if (!d) return alert("Enter delegate address");
  const tx = await contract.revokeDelegate(d);
  await tx.wait();
  alert("Delegate revoked!");
}

document.getElementById("connectBtn").onclick = connect;
document.getElementById("setDidBtn").onclick = setDid;
document.getElementById("setAttrBtn").onclick = setAttr;
document.getElementById("getAttrBtn").onclick = getAttr;
document.getElementById("grantBtn").onclick = grant;
document.getElementById("revokeBtn").onclick = revoke;
