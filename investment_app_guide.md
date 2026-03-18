# 📈 Kid Investment Learning App (VMFXX vs VOO)

## 🎯 Goal

Build a simple, kid-friendly web app that demonstrates:

1. **Safe investing (money market – VMFXX)**
   - Always increases
   - Smooth compounding
   - Real-time “money clock”

2. **Market investing (VOO index fund)**
   - Goes up and down
   - Real price data
   - Daily change visible

3. **Core lesson**
   > Some investments are stable but slower. Others grow faster but can go down.

---

# 🧠 High-Level Architecture

This is a **pure frontend app**:

- Static HTML + JavaScript
- Hosted on **GitHub Pages**
- Uses:
  - `localStorage` → save data
  - `fetch()` → get VOO price
  - `setInterval()` → update clock

No backend needed.

---

# 🧱 Project Structure

```
/index.html
/app.js
/style.css (optional)
```

You can also do this as a **single HTML file** if you want simplicity.

---

# ⚙️ Features Breakdown

## 1. 💰 VMFXX (Safe Money)

### What it does:
- Uses a fixed annual yield (e.g. 5.27%)
- Converts to **per-second growth**
- Updates every second
- Never goes down

---

### Formula

```js
const secondsPerYear = 31536000;

const ratePerSecond =
  Math.pow(1 + annualYield, 1 / secondsPerYear) - 1;
```

---

### Key idea (IMPORTANT)

Do NOT increment balance blindly every second.

Instead:

```js
function computeBalance(startBalance, rate, startTime) {
  const now = Date.now();
  const seconds = (now - startTime) / 1000;
  return startBalance * Math.pow(1 + rate, seconds);
}
```

---

### Data to store

```json
{
  "startBalance": 1000,
  "startTime": 1710000000000,
  "annualYield": 0.0527
}
```

---

## 2. 📊 VOO (Market Money)

### What it does:
- Fetches real price from Yahoo Finance
- Shows:
  - current price
  - daily change
- Updates:
  - on load
  - every 5 minutes

---

### Endpoint

```
https://query1.finance.yahoo.com/v8/finance/chart/VOO
```

---

### Fetch example

```js
async function fetchVOO() {
  const res = await fetch(
    "https://query1.finance.yahoo.com/v8/finance/chart/VOO"
  );
  const data = await res.json();

  const meta = data.chart.result[0].meta;

  return {
    price: meta.regularMarketPrice,
    previousClose: meta.previousClose,
    timestamp: Date.now()
  };
}
```

---

### Calculate change

```js
const change = price - previousClose;
const percent = (change / previousClose) * 100;
```

---

## 3. ⏱️ Smart Refresh Logic

We only want to fetch:
- on load
- every 5 minutes
- when user returns to app

---

### Implementation

```js
const FIVE_MIN = 5 * 60 * 1000;

async function maybeRefreshVOO() {
  const cached = loadVOO();

  if (!cached || Date.now() - cached.timestamp > FIVE_MIN) {
    try {
      const fresh = await fetchVOO();
      saveVOO(fresh);
      renderVOO(fresh);
    } catch {
      if (cached) renderVOO(cached);
    }
  } else {
    renderVOO(cached);
  }
}
```

---

### Run it

```js
maybeRefreshVOO();
setInterval(maybeRefreshVOO, FIVE_MIN);
```

---

### Handle iPad sleep / returning

```js
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    maybeRefreshVOO();
  }
});
```

---

## 4. 💾 Local Storage

### Save

```js
localStorage.setItem("vooData", JSON.stringify(data));
```

---

### Load

```js
function loadVOO() {
  const raw = localStorage.getItem("vooData");
  return raw ? JSON.parse(raw) : null;
}
```

---

### What to store

- VMFXX:
  - start balance
  - start time
  - yield

- VOO:
  - last fetched price
  - previous close
  - timestamp

---

# 🖥️ UI Layout (Simple)

## Option 1: Side-by-side

```
[ SAFE MONEY ]     [ MARKET MONEY ]
$1,234.56          $412.33
+0.0003/sec        +1.23 (0.45%)

Smooth graph       Up/Down graph
```

---

## Option 2: Toggle

- Button:
  - “Safe”
  - “Market”

---

## Key Teaching UI Elements

### VMFXX
- Big number
- “+$0.0003 per second”
- Always green

### VOO
- Price
- Red/green change
- “This can go down”

---

# 🎮 Teaching Features (Optional but Powerful)

## 1. Add contributions
- “Add $5/week”

## 2. Time travel
- “Jump 10 years”

## 3. Comparison mode
- Show both together

---

# 🚀 Deployment (GitHub Pages)

## Steps

1. Create repo:
```
investment-app
```

2. Add files:
- index.html
- app.js

3. Push to GitHub

4. Enable Pages:
- Settings → Pages → Deploy from main branch

---

## Result

You get:

```
https://yourusername.github.io/investment-app/
```

---

# 📱 iPad Setup

1. Open in Safari
2. Tap Share button
3. Select **Add to Home Screen**

Now it behaves like an app.

---

# ⚠️ Known Limitations

## Yahoo Finance API
- Unofficial
- Could break someday
- Fine for personal use

---

## localStorage
- Device-specific
- Not synced across devices

---

## VMFXX yield
- Manual update required
- (Better than scraping)

---

# 🔥 Why this is powerful

Most tools teach:
- trading
- buying/selling

This teaches:
- time
- compounding
- risk vs stability

👉 That’s a deeper understanding.

---

# 🧾 Final Summary

You are building:

- A **static web app**
- With:
  - real market data (VOO)
  - simulated compounding (VMFXX)
  - persistent local state
  - live updating UI

👉 No backend  
👉 Runs on iPad  
👉 Teaches core investing concepts clearly  

---

# 🚀 Next Step

Start with:
1. VMFXX clock only
2. Add VOO fetch
3. Add comparison view

Keep it simple and iterate.
