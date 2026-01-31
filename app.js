let username = localStorage.getItem("username");
const API = "https://mushbackend-production.up.railway.app/";

function login() {
  username = document.getElementById("username").value;
  localStorage.setItem("username", username);
  init();
}

async function api(path, options = {}) {
  return fetch(API + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-username": username
    }
  }).then(r => r.json());
}

async function init() {
  document.getElementById("login").hidden = true;
  document.getElementById("app").hidden = false;

  const batches = await api("/batches");
  document.getElementById("batchList").innerHTML =
    batches.map(b => `<div onclick="loadInsights(${b.batch_id})">${b.substrate_type}</div>`).join("");
}

async function loadInsights(batchId) {
  const data = await api(`/insights/${batchId}`);
  document.getElementById("insights").innerText = data.summary;
}

if (username) init();
