
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const container = document.getElementById("trackerContainer");
const summaryText = document.getElementById("summaryText");

function getData() {
  return JSON.parse(localStorage.getItem("trackerData") || "{}");
}

function saveData(data) {
  localStorage.setItem("trackerData", JSON.stringify(data));
  updateSummary();
}

function createDayCard(day) {
  const data = getData()[day] || {};
  const macros = data.macros || { calories: "", protein: "", carbs: "", fat: "" };
  const steps = data.steps || "";
  const sleep = data.sleep || "";
  const water = data.water || "";
  const notes = data.notes || "";
  const completed = data.completed || false;

  const card = document.createElement("div");
  card.className = "card p-3 day-card shadow-sm";
  card.innerHTML = `
    <h5>${day}</h5>
    <div class="form-check form-switch mb-2">
      <input class="form-check-input" type="checkbox" id="${day}-done" ${completed ? "checked" : ""}>
      <label class="form-check-label" for="${day}-done">Workout done</label>
    </div>
    <div class="mb-2">Calories: <input type="number" class="form-control macro-input" id="${day}-cal" value="${macros.calories}"></div>
    <div class="mb-2">Protein (g): <input type="number" class="form-control macro-input" id="${day}-pro" value="${macros.protein}"></div>
    <div class="mb-2">Carbs (g): <input type="number" class="form-control macro-input" id="${day}-carbs" value="${macros.carbs}"></div>
    <div class="mb-2">Fat (g): <input type="number" class="form-control macro-input" id="${day}-fat" value="${macros.fat}"></div>
    <div class="mb-2">Steps: <input type="number" class="form-control macro-input" id="${day}-steps" value="${steps}"></div>
    <div class="mb-2">Sleep (hrs): <input type="number" class="form-control macro-input" id="${day}-sleep" value="${sleep}"></div>
    <div class="mb-2">Water (L): <input type="number" class="form-control macro-input" id="${day}-water" value="${water}"></div>
    <div class="mb-2">Notes: <textarea class="form-control" id="${day}-notes">${notes}</textarea></div>
    <button class="btn btn-sm btn-primary" onclick="saveDay('${day}')">Save</button>
  `;
  container.appendChild(card);
}

function saveDay(day) {
  const data = getData();
  data[day] = {
    completed: document.getElementById(`${day}-done`).checked,
    macros: {
      calories: document.getElementById(`${day}-cal`).value,
      protein: document.getElementById(`${day}-pro`).value,
      carbs: document.getElementById(`${day}-carbs`).value,
      fat: document.getElementById(`${day}-fat`).value
    },
    steps: +document.getElementById(`${day}-steps`).value,
    sleep: +document.getElementById(`${day}-sleep`).value,
    water: +document.getElementById(`${day}-water`).value,
    notes: document.getElementById(`${day}-notes`).value
  };
  saveData(data);
  alert(`${day} saved!`);
}

function updateSummary() {
  const data = getData();
  let totalSteps = 0, totalWater = 0, totalSleep = 0;
  let daysCount = 0;
  const stepsData = [], sleepData = [], waterData = [];

  days.forEach(day => {
    const d = data[day];
    if (d) {
      totalSteps += d.steps || 0;
      totalWater += d.water || 0;
      totalSleep += d.sleep || 0;
      daysCount++;
      stepsData.push(d.steps || 0);
      sleepData.push(d.sleep || 0);
      waterData.push(d.water || 0);
    } else {
      stepsData.push(0);
      sleepData.push(0);
      waterData.push(0);
    }
  });

  const avgSteps = (totalSteps / daysCount).toFixed(0);
  const avgSleep = (totalSleep / daysCount).toFixed(1);
  const totalWaterFixed = totalWater.toFixed(1);

  summaryText.innerText = `Avg Steps: ${avgSteps}, Avg Sleep: ${avgSleep} hrs, Total Water: ${totalWaterFixed} L`;

  renderChart("chartSteps", "Steps", stepsData, "#0d6efd");
  renderChart("chartSleep", "Sleep (hrs)", sleepData, "#198754");
  renderChart("chartWater", "Water (L)", waterData, "#20c997");
}

function renderChart(id, label, data, color) {
  const ctx = document.getElementById(id).getContext("2d");
  if (window[id + "Chart"]) window[id + "Chart"].destroy();
  window[id + "Chart"] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: days,
      datasets: [{
        label: label,
        data: data,
        backgroundColor: color
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

window.onload = () => {
  days.forEach(createDayCard);
  updateSummary();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }
};

// --- Notifications Setup ---
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        scheduleNotifications();
      }
    });
  }
}

function scheduleNotifications() {
  const now = new Date();
  const millisTill7 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0, 0) - now;
  if (millisTill7 < 0) return;
  setTimeout(() => {
    new Notification("🏋️ Time to log your workout!");
  }, millisTill7);

  const millisTillWater = 2 * 60 * 60 * 1000;
  setTimeout(() => {
    new Notification("💧 Drink water and log it!");
  }, millisTillWater);

  const millisTillSleep = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 0, 0, 0) - now;
  if (millisTillSleep > 0) {
    setTimeout(() => {
      new Notification("🛏️ Log your sleep before bed!");
    }, millisTillSleep);
  }
}

// --- CSV Export ---
function exportToCSV() {
  const data = getData();
  const rows = [["Day", "Workout Done", "Calories", "Protein", "Carbs", "Fat", "Steps", "Sleep", "Water", "Notes"]];
  for (const day of days) {
    const d = data[day] || {};
    const m = d.macros || {};
    rows.push([
      day,
      d.completed ? "Yes" : "No",
      m.calories || "",
      m.protein || "",
      m.carbs || "",
      m.fat || "",
      d.steps || "",
      d.sleep || "",
      d.water || "",
      (d.notes || "").replace(/\n/g, " ")
    ]);
  }

  const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "weekly_tracker.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Add Export button
const exportBtn = document.createElement("button");
exportBtn.className = "btn btn-outline-secondary mt-3";
exportBtn.innerText = "Export to CSV";
exportBtn.onclick = exportToCSV;
document.body.appendChild(exportBtn);

window.onload = () => {
  days.forEach(createDayCard);
  updateSummary();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }
  requestNotificationPermission();
};
