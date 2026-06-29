// ======================================
// NBA 2K26 DRAFT SYSTEM
// ======================================

// ======================================
// TEAMS
// ======================================

const teams = [
    "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets",
    "Charlotte Hornets", "Chicago Bulls", "Cleveland Cavaliers",
    "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons",
    "Golden State Warriors", "Houston Rockets", "Indiana Pacers",
    "LA Clippers", "Los Angeles Lakers", "Memphis Grizzlies",
    "Miami Heat", "Milwaukee Bucks", "Minnesota Timberwolves",
    "New Orleans Pelicans", "New York Knicks", "Oklahoma City Thunder",
    "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns",
    "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs",
    "Toronto Raptors", "Utah Jazz", "Washington Wizards"
];

const teamFiles = {
    "Golden State Warriors": "CSVs/Warriors.csv",
    "Los Angeles Lakers": "CSVs/Lakers.csv",
    "Boston Celtics": "CSVs/Celtics.csv",
    "Milwaukee Bucks": "CSVs/Bucks.csv",
    "Miami Heat": "CSVs/Heat.csv",
    "Atlanta Hawks": "CSVs/Hawks.csv",
    "Brooklyn Nets": "CSVs/Nets.csv",
    "Charlotte Hornets": "CSVs/Hornets.csv",
    "Chicago Bulls": "CSVs/Bulls.csv",
    "Cleveland Cavaliers": "CSVs/Cavs.csv",
    "Dallas Mavericks": "CSVs/Mavs.csv",
    "Denver Nuggets": "CSVs/Nuggets.csv",
    "Detroit Pistons": "CSVs/Pistons.csv",
    "Houston Rockets": "CSVs/Rockets.csv",
    "Indiana Pacers": "CSVs/Pacers.csv",
    "LA Clippers": "CSVs/Clippers.csv",
    "Memphis Grizzlies": "CSVs/Grizzlies.csv",
    "Minnesota Timberwolves": "CSVs/Timberwolves.csv",
    "New Orleans Pelicans": "CSVs/Pelicans.csv",
    "New York Knicks": "CSVs/Knicks.csv",
    "Oklahoma City Thunder": "CSVs/OKC.csv",
    "Orlando Magic": "CSVs/Magic.csv",
    "Philadelphia 76ers": "CSVs/76ers.csv",
    "Phoenix Suns": "CSVs/Suns.csv",
    "Portland Trail Blazers": "CSVs/TrailBlazers.csv",
    "Sacramento Kings": "CSVs/Kings.csv",
    "San Antonio Spurs": "CSVs/Spurs.csv",
    "Toronto Raptors": "CSVs/Raptors.csv",
    "Utah Jazz": "CSVs/Jazz.csv",
    "Washington Wizards": "CSVs/Wizards.csv"
};

// ======================================
// STATE
// ======================================

let currentRotation = 0;
let spinning = false;
let currentTeam = "";
let currentPerson = null;
let teamPlayers = [];
let filteredPlayers = [];
let draggedPlayer = null;
let pendingSlot = null; // for mobile tap-to-assign

const person1 = { PG1: null, PG2: null, SG1: null, SG2: null, SF1: null, SF2: null, PF1: null, PF2: null, C1: null, C2: null };
const person2 = { PG1: null, PG2: null, SG1: null, SG2: null, SF1: null, SF2: null, PF1: null, PF2: null, C1: null, C2: null };

// ======================================
// NAVIGATION
// ======================================

function showScreen(id) {
    ["homeScreen", "wheelScreen", "draftScreen", "numberGenScreen", "coinFlipScreen"]
        .forEach(s => {
            document.getElementById(s).style.display = (s === id) ? "" : "none";
        });
}

document.getElementById("goToDraftwheel").addEventListener("click", () => showScreen("wheelScreen"));
document.getElementById("goToNumberGen").addEventListener("click", () => showScreen("numberGenScreen"));
document.getElementById("goToCoinFlip").addEventListener("click", () => showScreen("coinFlipScreen"));

document.getElementById("wheelBackHome").addEventListener("click", () => showScreen("homeScreen"));
document.getElementById("numBackHome").addEventListener("click", () => showScreen("homeScreen"));
document.getElementById("coinBackHome").addEventListener("click", () => showScreen("homeScreen"));

document.getElementById("backBtn").addEventListener("click", () => {
    showScreen("wheelScreen");
});

// ======================================
// GLÜCKSRAD
// ======================================

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultEl = document.getElementById("result");
const addP1 = document.getElementById("addP1");
const addP2 = document.getElementById("addP2");
const rosterTitle = document.getElementById("rosterTitle");
const teamTitle = document.getElementById("teamTitle");

const size = 600;
const center = size / 2;
const radius = center - 10;
const sliceAngle = (2 * Math.PI) / teams.length;

function drawWheel() {
    ctx.clearRect(0, 0, size, size);

    teams.forEach((team, i) => {
        const startAngle = i * sliceAngle - Math.PI / 2;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? "#2563eb" : "#60a5fa";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.fillStyle = "#fff";
        ctx.font = "11px Arial";
        ctx.textAlign = "right";
        ctx.fillText(team, radius - 15, 4);
        ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, 30, 0, Math.PI * 2);
    ctx.fillStyle = "#111827";
    ctx.fill();
}

drawWheel();

spinBtn.addEventListener("click", () => {
    if (spinning) return;
    spinning = true;
    resultEl.innerHTML = "🎲 Dreht...";

    const winnerIndex = Math.floor(Math.random() * teams.length);
    currentTeam = teams[winnerIndex];

    const segmentSize = 360 / teams.length;
    const targetAngle = 360 - (winnerIndex * segmentSize + segmentSize / 2);
    const currentNormalized = ((currentRotation % 360) + 360) % 360;

    currentRotation += 360 * 6 + ((targetAngle - currentNormalized + 360) % 360);

    canvas.style.transition = "transform 6s cubic-bezier(0.17,0.67,0.12,0.99)";
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        resultEl.innerHTML = `<h2>🏆 Dein Team:</h2><h1>${currentTeam}</h1>`;
        document.getElementById("draftButtons").style.display = "block";
        addP1.textContent = `➕ Add Player from ${currentTeam} to Person 1`;
        addP2.textContent = `➕ Add Player from ${currentTeam} to Person 2`;
        spinning = false;
    }, 6000);
});

addP1.addEventListener("click", async () => {
    currentPerson = person1;
    rosterTitle.textContent = "Person 1";
    teamTitle.textContent = currentTeam;
    showScreen("draftScreen");
    await loadTeamPlayers();
    renderRoster();
});

addP2.addEventListener("click", async () => {
    currentPerson = person2;
    rosterTitle.textContent = "Person 2";
    teamTitle.textContent = currentTeam;
    showScreen("draftScreen");
    await loadTeamPlayers();
    renderRoster();
});

// ======================================
// CSV LADEN + PARSER
// ======================================

async function loadTeamPlayers() {
    const playersList = document.getElementById("playersList");
    playersList.innerHTML = "<p>Lade Spieler...</p>";
    teamPlayers = [];

    try {
        const file = teamFiles[currentTeam];
        if (!file) { playersList.innerHTML = "<p>Keine CSV Datei gefunden.</p>"; return; }

        const response = await fetch(file);
        const csvText = await response.text();
        parseCSV(csvText);
        filteredPlayers = [...teamPlayers];
        renderPlayers();
    } catch (err) {
        console.error(err);
        playersList.innerHTML = "<p>Fehler beim Laden der CSV.</p>";
    }
}

function parseCSV(csvText) {
    teamPlayers = [];
    const rows = csvText.split("\n").filter(r => r.trim());

    for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(",");
        teamPlayers.push({
            name:   cols[0]?.trim() || "",
            rating: cols[1]?.trim() || "",
            team:   cols[2]?.trim() || "",
            era:    cols[3]?.trim() || ""
        });
    }
}

// ======================================
// SPIELER ANZEIGEN
// ======================================

function renderPlayers() {
    const playersList = document.getElementById("playersList");
    playersList.innerHTML = "";

    filteredPlayers.forEach(player => {
        const card = document.createElement("div");
        card.className = "player-card";
        card.draggable = true;
        card.dataset.name = player.name;
        card.innerHTML = `
            <div class="roster-player-name">${player.name}</div>
            <div class="player-rating">⭐ ${player.rating}</div>
            <div class="player-era">${player.era}</div>
        `;

        // ---- Desktop Drag ----
        card.addEventListener("dragstart", e => {
            draggedPlayer = player;
            e.dataTransfer.setData("text/plain", JSON.stringify(player));
            setTimeout(() => card.classList.add("dragging"), 0);
        });
        card.addEventListener("dragend", () => card.classList.remove("dragging"));

        // ---- Mobile Touch: tap card then tap slot ----
        card.addEventListener("click", () => {
            openPlayerPicker(player);
        });

        playersList.appendChild(card);
    });
}

// ======================================
// SUCHFUNKTION
// ======================================

document.getElementById("playerSearch").addEventListener("input", () => {
    const value = document.getElementById("playerSearch").value.toLowerCase().trim();
    filteredPlayers = teamPlayers.filter(p => p.name.toLowerCase().includes(value));
    renderPlayers();
});

// ======================================
// MOBILE: PLAYER PICKER MODAL
// ======================================

// When user taps a player card, we ask which slot

function openPlayerPicker(player) {
    const modal = document.getElementById("playerPickerModal");
    const list  = document.getElementById("modalPlayerList");
    const title = document.getElementById("modalTitle");

    title.textContent = `${player.name} zuweisen`;
    list.innerHTML = "";

    const slots = ["PG1","PG2","SG1","SG2","SF1","SF2","PF1","PF2","C1","C2"];
    slots.forEach(key => {
        const existing = currentPerson[key];
        const item = document.createElement("div");
        item.className = "modal-player-item";
        item.innerHTML = `
            <strong>${key}</strong>
            <span style="color:#9ca3af; margin-left:10px; font-size:13px;">
                ${existing ? existing.name : "Leer"}
            </span>
        `;
        item.addEventListener("click", () => {
            currentPerson[key] = { name: player.name, rating: player.rating, era: player.era, team: player.team };
            renderRoster();
            closePlayerPicker();
        });
        list.appendChild(item);
    });

    modal.style.display = "block";
}

function closePlayerPicker() {
    document.getElementById("playerPickerModal").style.display = "none";
}

document.getElementById("modalClose").addEventListener("click", closePlayerPicker);
document.getElementById("modalOverlay").addEventListener("click", closePlayerPicker);

// ======================================
// ROSTER RENDERN
// ======================================

function renderRoster() {
    if (!currentPerson) return;
    const slots = document.querySelectorAll(".roster-slot");

    slots.forEach(slot => {
        const key = slot.dataset.slot;
        const player = currentPerson[key];
        const nameEl = slot.querySelector(".player-name");

        if (!player) {
            nameEl.textContent = "Leer";
            slot.classList.remove("has-player");
        } else {
            nameEl.textContent = `${player.name} (${player.rating})`;
            slot.classList.add("has-player");
        }
    });
}

// ======================================
// DRAG & DROP (Desktop)
// ======================================

const rosterSlots = document.querySelectorAll(".roster-slot");

rosterSlots.forEach(slot => {
    slot.addEventListener("dragover", e => {
        e.preventDefault();
        slot.classList.add("drag-over");
    });
    slot.addEventListener("dragleave", () => slot.classList.remove("drag-over"));
    slot.addEventListener("drop", e => {
        e.preventDefault();
        slot.classList.remove("drag-over");
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        currentPerson[slot.dataset.slot] = { name: data.name, rating: data.rating, era: data.era, team: data.team };
        renderRoster();
    });
});

// ======================================
// TOUCH DRAG & DROP (Mobile)
// Long-press on card, drag to slot
// ======================================

let touchDragPlayer = null;
let touchClone = null;

function setupTouchDrag() {
    // We re-run this after renderPlayers to attach to new cards
    // Using event delegation on playersList instead

    const playersList = document.getElementById("playersList");

    playersList.addEventListener("touchstart", e => {
        const card = e.target.closest(".player-card");
        if (!card) return;
        const playerName = card.dataset.name;
        touchDragPlayer = filteredPlayers.find(p => p.name === playerName);
    }, { passive: true });
}

// Slot touch events for drag-to-slot on mobile
rosterSlots.forEach(slot => {
    slot.addEventListener("touchstart", e => {
        // If user taps directly on a slot (not dragging), open slot assignment via the players list tap-flow
        // This is handled by the modal system
    }, { passive: true });

    // Clear button
    const clearBtn = slot.querySelector(".clear-slot-btn");
    clearBtn.addEventListener("click", e => {
        e.stopPropagation();
        currentPerson[slot.dataset.slot] = null;
        renderRoster();
    });

    // Tap slot = open picker to choose player
    slot.addEventListener("click", e => {
        if (e.target.classList.contains("clear-slot-btn")) return;
        openSlotPicker(slot.dataset.slot);
    });
});

// Tap on slot → show list of players to pick from
function openSlotPicker(slotKey) {
    if (filteredPlayers.length === 0) return; // no players loaded

    const modal = document.getElementById("playerPickerModal");
    const list  = document.getElementById("modalPlayerList");
    const title = document.getElementById("modalTitle");

    title.textContent = `Spieler für ${slotKey} wählen`;
    list.innerHTML = "";

    filteredPlayers.forEach(player => {
        const item = document.createElement("div");
        item.className = "modal-player-item";
        item.innerHTML = `
            <strong>${player.name}</strong>
            <span style="color:gold; margin-left:8px; font-size:13px;">⭐ ${player.rating}</span>
            <span style="color:#9ca3af; margin-left:6px; font-size:12px;">${player.era}</span>
        `;
        item.addEventListener("click", () => {
            currentPerson[slotKey] = { name: player.name, rating: player.rating, era: player.era, team: player.team };
            renderRoster();
            closePlayerPicker();
        });
        list.appendChild(item);
    });

    modal.style.display = "block";
}

setupTouchDrag();

// ======================================
// NUMBER GENERATOR
// ======================================

document.getElementById("generateBtn").addEventListener("click", () => {
    const minInput = document.getElementById("minValue");
    const maxInput = document.getElementById("maxValue");
    const resultEl = document.getElementById("randomResult");

    if (!minInput.value || !maxInput.value) {
        resultEl.textContent = "⚠️";
        resultEl.style.fontSize = "28px";
        resultEl.style.color = "#f87171";
        setTimeout(() => {
            resultEl.textContent = "";
            resultEl.style.fontSize = "";
            resultEl.style.color = "";
        }, 1500);
        return;
    }

    const min = Number(minInput.value);
    const max = Number(maxInput.value);

    if (min > max) {
        resultEl.style.fontSize = "20px";
        resultEl.style.color = "#f87171";
        resultEl.textContent = "Min > Max!";
        return;
    }

    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    resultEl.style.fontSize = "";
    resultEl.style.color = "#60a5fa";
    resultEl.textContent = random;
});

// ======================================
// COIN FLIP
// ======================================

const coin = document.getElementById("coin");
const flipBtn = document.getElementById("flipBtn");
const coinResult = document.getElementById("coinResult");

let coinFlipping = false;

// We show heads or tails by rotating
// heads = showing .coin-heads (front), tails = showing .coin-tails (back)
// Simple: just animate and show emoji result

flipBtn.addEventListener("click", () => {
    if (coinFlipping) return;
    coinFlipping = true;
    coinResult.textContent = "";
    
    const coinInner = coin.querySelector(".coin-inner");
    coinInner.style.transform = "";
    coin.classList.remove("flipping");
    void coinInner.offsetWidth; // reflow auf coin-inner!
    
    const isHeads = Math.random() < 0.5;
    const finalRotation = isHeads ? 1800 : 1980;
    coin.style.setProperty("--final-rotation", finalRotation + "deg");
    coin.classList.add("flipping");

    setTimeout(() => {
        coinInner.style.transform = `rotateY(${finalRotation}deg)`;
        coinResult.textContent = isHeads ? "🟡 HEADS" : "⚪ TAILS";
        coinResult.style.color = isHeads ? "#fcd34d" : "#d1d5db";
        coinResult.style.fontSize = "clamp(24px, 8vw, 48px)";
        coinFlipping = false;
    }, 1300);
});

// ======================================
// INITIAL
// ======================================

renderRoster();
