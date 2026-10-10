async function loadJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error("failed to load " + path);
  return r.json();
}
const STATUS_ICON = { working: "⌨️", idle: "☕", offline: "💤" };
const STATUS_LABEL = { working: "working", idle: "idle", offline: "offline" };

function renderOffice(agents) {
  const floor = document.getElementById("office-floor");
  floor.innerHTML = "";
  agents.forEach(a => {
    const el = document.createElement("div");
    el.className = "desk";
    el.innerHTML = `
      <div class="avatar">${a.avatar || "🤖"}</div>
      <div class="role">${a.peran}</div>
      <div class="name">${a.nama}</div>
      <div class="status"><span class="dot ${a.status}"></span>${STATUS_ICON[a.status] || ""} ${STATUS_LABEL[a.status] || a.status}</div>`;
    floor.appendChild(el);
  });
}

function renderFeed(items) {
  const feed = document.getElementById("activity-feed");
  feed.innerHTML = "";
  items.slice(0, 5).forEach(i => {
    const li = document.createElement("li");
    li.innerHTML = `<time>${i.waktu}</time><span class="classified">🔒 ${i.teks}</span>`;
    feed.appendChild(li);
  });
}

/* office clock (WIB) */
function tickClock() {
  const el = document.getElementById("office-clock");
  if (!el) return;
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  el.textContent = now.toTimeString().slice(0, 8);
}
setInterval(tickClock, 1000);
tickClock();

/* fake terminal typing */
(function terminal() {
  const out = document.getElementById("term-output");
  if (!out) return;
  const lines = [
    "waginem@agentspace:~$ status --all",
    "✓ 3 agents online — all systems nominal",
    "waginem@agentspace:~$ ",
  ];
  let li = 0, ci = 0, text = "";
  function type() {
    if (li >= lines.length) { setTimeout(() => { li = 0; text = ""; out.textContent = ""; type(); }, 6000); return; }
    if (ci <= lines[li].length) {
      text = lines.slice(0, li).join("\n") + (li ? "\n" : "") + lines[li].slice(0, ci);
      out.textContent = text + "▊";
      ci++;
      setTimeout(type, lines[li].startsWith("waginem") ? 45 : 12);
    } else { li++; ci = 0; setTimeout(type, 700); }
  }
  type();
})();

async function refresh() {
  try {
    const [agents, feed] = await Promise.all([
      loadJSON("data/status.json"),
      loadJSON("data/activity.json"),
    ]);
    renderOffice(agents);
    renderFeed(feed);
  } catch (e) {
    document.getElementById("office-floor").innerHTML =
      `<p class="loading">Failed to load data: ${e.message}</p>`;
  }
}
refresh();
setInterval(refresh, 30000);
