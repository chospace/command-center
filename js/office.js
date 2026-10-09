async function loadJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error("gagal memuat " + path);
  return r.json();
}
const STATUS_ICON = { working: "⌨️", idle: "☕", offline: "💤" };
const STATUS_LABEL = { working: "kerja", idle: "idle", offline: "offline" };

function renderOffice(agents) {
  const floor = document.getElementById("office-floor");
  floor.innerHTML = "";
  agents.forEach(a => {
    const el = document.createElement("div");
    el.className = "desk";
    el.innerHTML = `
      <div class="avatar">${a.avatar || "🤖"}</div>
      <div class="name">${a.nama}</div>
      <div class="role">${a.peran}</div>
      <div class="status"><span class="dot ${a.status}"></span>${STATUS_ICON[a.status] || ""} ${STATUS_LABEL[a.status] || a.status}</div>
      <div class="activity">${a.aktivitas}</div>
      <div class="updated">update ${a.update_terakhir}</div>`;
    floor.appendChild(el);
  });
}

function renderFeed(items) {
  const feed = document.getElementById("activity-feed");
  feed.innerHTML = "";
  items.slice(0, 12).forEach(i => {
    const li = document.createElement("li");
    li.innerHTML = `<time>${i.waktu}</time>${i.teks}`;
    feed.appendChild(li);
  });
}

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
      `<p class="loading">Gagal memuat data: ${e.message}</p>`;
  }
}
refresh();
setInterval(refresh, 30000);
