// ======================================
// NBA GLÜCKSRAD + DRAFT SYSTEM
// TEIL 1
// ======================================

// ======================================
// TEAMS
// ======================================

const teams = [
    "Atlanta Hawks",
    "Boston Celtics",
    "Brooklyn Nets",
    "Charlotte Hornets",
    "Chicago Bulls",
    "Cleveland Cavaliers",
    "Dallas Mavericks",
    "Denver Nuggets",
    "Detroit Pistons",
    "Golden State Warriors",
    "Houston Rockets",
    "Indiana Pacers",
    "LA Clippers",
    "Los Angeles Lakers",
    "Memphis Grizzlies",
    "Miami Heat",
    "Milwaukee Bucks",
    "Minnesota Timberwolves",
    "New Orleans Pelicans",
    "New York Knicks",
    "Oklahoma City Thunder",
    "Orlando Magic",
    "Philadelphia 76ers",
    "Phoenix Suns",
    "Portland Trail Blazers",
    "Sacramento Kings",
    "San Antonio Spurs",
    "Toronto Raptors",
    "Utah Jazz",
    "Washington Wizards"
];

// ======================================
// TEAM -> CSV
// ======================================
// SPÄTER EINFACH ANPASSEN
// ======================================

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
// ELEMENTE
// ======================================

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const result = document.getElementById("result");

const wheelScreen = document.getElementById("wheelScreen");
const draftScreen = document.getElementById("draftScreen");

const addP1 = document.getElementById("addP1");
const addP2 = document.getElementById("addP2");

const backBtn = document.getElementById("backBtn");

const rosterTitle = document.getElementById("rosterTitle");
const teamTitle = document.getElementById("teamTitle");

// ======================================
// STATE
// ======================================

let currentRotation = 0;
let spinning = false;

let currentTeam = "";
let currentPerson = null;

let teamPlayers = [];

// ======================================
// PERSON 1
// ======================================

const person1 = {

    PG1: null,
    PG2: null,

    SG1: null,
    SG2: null,

    SF1: null,
    SF2: null,

    PF1: null,
    PF2: null,

    C1: null,
    C2: null
};

// ======================================
// PERSON 2
// ======================================

const person2 = {

    PG1: null,
    PG2: null,

    SG1: null,
    SG2: null,

    SF1: null,
    SF2: null,

    PF1: null,
    PF2: null,

    C1: null,
    C2: null
};

// ======================================
// GLÜCKSRAD
// ======================================

const size = canvas.width;
const center = size / 2;
const radius = center - 10;

const sliceAngle = (2 * Math.PI) / teams.length;

// ======================================
// RAD ZEICHNEN
// ======================================

function drawWheel() {

    ctx.clearRect(0, 0, size, size);

    teams.forEach((team, i) => {

        const startAngle =
            i * sliceAngle - Math.PI / 2;

        const endAngle =
            startAngle + sliceAngle;

        ctx.beginPath();

        ctx.moveTo(center, center);

        ctx.arc(
            center,
            center,
            radius,
            startAngle,
            endAngle
        );

        ctx.closePath();

        ctx.fillStyle =
            i % 2 === 0
                ? "#2563eb"
                : "#60a5fa";

        ctx.fill();

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;

        ctx.stroke();

        ctx.save();

        ctx.translate(center, center);

        ctx.rotate(
            startAngle +
            sliceAngle / 2
        );

        ctx.fillStyle = "#fff";
        ctx.font = "11px Arial";

        ctx.textAlign = "right";

        ctx.fillText(
            team,
            radius - 15,
            4
        );

        ctx.restore();
    });

    ctx.beginPath();

    ctx.arc(
        center,
        center,
        30,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#111827";
    ctx.fill();
}

drawWheel();

// ======================================
// SPIN
// ======================================

spinBtn.addEventListener("click", () => {

    if (spinning) return;

    spinning = true;

    result.innerHTML = "🎲 Dreht...";

    const winnerIndex =
        Math.floor(
            Math.random() * teams.length
        );

    currentTeam =
        teams[winnerIndex];

    const segmentSize =
        360 / teams.length;

    const targetAngle =
        360 -
        (
            winnerIndex *
            segmentSize +
            segmentSize / 2
        );

    const currentNormalized =
        (
            (
                currentRotation %
                360
            ) + 360
        ) % 360;

    currentRotation +=
        360 * 6 +
        (
            (
                targetAngle -
                currentNormalized +
                360
            ) % 360
        );

    canvas.style.transition =
        "transform 6s cubic-bezier(0.17,0.67,0.12,0.99)";

    canvas.style.transform =
        `rotate(${currentRotation}deg)`;

    setTimeout(() => {

        result.innerHTML = `
            <h2>🏆 Dein Team:</h2>
            <h1>${currentTeam}</h1>
        `;

        document.getElementById(
            "draftButtons"
        ).style.display = "block";

        addP1.textContent =
            `➕ Add Player from ${currentTeam} to Person 1`;

        addP2.textContent =
            `➕ Add Player from ${currentTeam} to Person 2`;

        spinning = false;

    }, 6000);

});


// ======================================
// DRAFT SCREEN ÖFFNEN
// ======================================

addP1.addEventListener("click", async () => {

    currentPerson = person1;

    rosterTitle.textContent =
        "Person 1";

    teamTitle.textContent =
        currentTeam;

    wheelScreen.style.display =
        "none";

    draftScreen.style.display =
        "block";

    await loadTeamPlayers();

    renderRoster();
});

addP2.addEventListener("click", async () => {

    currentPerson = person2;

    rosterTitle.textContent =
        "Person 2";

    teamTitle.textContent =
        currentTeam;

    wheelScreen.style.display =
        "none";

    draftScreen.style.display =
        "block";

    await loadTeamPlayers();

    renderRoster();
});

// ======================================
// ZURÜCK
// ======================================

backBtn.addEventListener("click", () => {

    draftScreen.style.display =
        "none";

    wheelScreen.style.display =
        "block";

});

// ======================================
// ROSTER RENDERN
// ======================================

function renderRoster() {
    if (!currentPerson) return;

    const slots = document.querySelectorAll(".roster-slot");

    slots.forEach(slot => {
        const key = slot.dataset.slot;
        const player = currentPerson[key];

        const playerName = slot.querySelector(".player-name");

        if (!player) {
            playerName.textContent = "Leer";
            return;
        }

        playerName.textContent = `${player.name} (${player.rating})`;
    });
}
// ======================================
// TEIL 2
// CSV + SUCHEN + DRAG & DROP
// ======================================

const playersList =
    document.getElementById("playersList");

const playerSearch =
    document.getElementById("playerSearch");

let filteredPlayers = [];

// ======================================
// CSV LADEN
// ======================================

async function loadTeamPlayers() {

    playersList.innerHTML =
        "<p>Lade Spieler...</p>";

    teamPlayers = [];

    try {

        const file =
            teamFiles[currentTeam];

        if (!file) {

            playersList.innerHTML =
                "<p>Keine CSV Datei gefunden.</p>";

            return;
        }

        const response =
            await fetch(file);

        const csvText =
            await response.text();

        parseCSV(csvText);

        filteredPlayers =
            [...teamPlayers];

        renderPlayers();

    } catch (err) {

        console.error(err);

        playersList.innerHTML =
            "<p>Fehler beim Laden der CSV.</p>";
    }
}

// ======================================
// CSV PARSER
// ======================================

function parseCSV(csvText) {

    teamPlayers = [];

    const rows =
        csvText
        .split("\n")
        .filter(row => row.trim());

    // Header überspringen
    for (let i = 1; i < rows.length; i++) {

        const cols =
            rows[i]
            .split(",");

        const player = {

            name:
                cols[0]?.trim() || "",

            rating:
                cols[1]?.trim() || "",

            team:
                cols[2]?.trim() || "",

            era:
                cols[3]?.trim() || ""

        };

        teamPlayers.push(player);
    }
}

// ======================================
// SPIELER ANZEIGEN
// ======================================

function renderPlayers() {

    playersList.innerHTML = "";

    filteredPlayers.forEach(player => {

        const card =
            document.createElement("div");

        card.className =
            "player-card";

        card.draggable = true;

        card.dataset.name =
            player.name;

        card.innerHTML = `
            <div class="player-name">
                ${player.name}
            </div>

            <div class="player-rating">
                ⭐ ${player.rating}
            </div>

            <div class="player-era">
                ${player.era}
            </div>
        `;

        card.addEventListener(
            "dragstart",
            e => {

                e.dataTransfer.setData(
                    "text/plain",
                    JSON.stringify(player)
                );

            }
        );

        playersList.appendChild(card);

    });

}

// ======================================
// SUCHFUNKTION
// ======================================

playerSearch.addEventListener(
    "input",
    () => {

        const value =
            playerSearch.value
            .toLowerCase()
            .trim();

        filteredPlayers =
            teamPlayers.filter(player =>
                player.name
                .toLowerCase()
                .includes(value)
            );

        renderPlayers();

    }
);

// ======================================
// DRAG & DROP
// ======================================

const rosterSlots =
    document.querySelectorAll(
        ".roster-slot"
    );

rosterSlots.forEach(slot => {

    slot.addEventListener(
        "dragover",
        e => {

            e.preventDefault();

            slot.classList.add(
                "drag-over"
            );

        }
    );

    slot.addEventListener(
        "dragleave",
        () => {

            slot.classList.remove(
                "drag-over"
            );

        }
    );

    slot.addEventListener(
        "drop",
        e => {

            e.preventDefault();

            slot.classList.remove(
                "drag-over"
            );

            const data =
                JSON.parse(
                    e.dataTransfer.getData(
                        "text/plain"
                    )
                );

            const slotKey =
                slot.dataset.slot;

            // Speichern
            currentPerson[slotKey] = {

                name: data.name,
                rating: data.rating,
                era: data.era,
                team: data.team

            };

            renderRoster();

        }
    );

});

// ======================================
// SLOT LEEREN BEI DOPPELKLICK
// ======================================

rosterSlots.forEach(slot => {

    slot.addEventListener(
        "dblclick",
        () => {

            const slotKey =
                slot.dataset.slot;

            currentPerson[slotKey] =
                null;

            renderRoster();

        }
    );

});

// ======================================
// INITIAL
// ======================================

renderRoster();

function randomNumberGenerator(min, max) {
    
    const generateBtn = document.getElementById("generateBtn");
    const minInput = document.getElementById("minValue");
    const maxInput = document.getElementById("maxValue");
    const result = document.getElementById("randomResult");

    generateBtn.addEventListener("click", () => {
        const min = Number(minInput.value);
        const max = Number(maxInput.value);

        if (!minInput.value || !maxInput.value) {
            result.textContent = "Bitte beide Werte eingeben.";
            return;
        }

        if (min > max) {
            result.textContent = "Min darf nicht größer als Max sein.";
            return;
        }

        const random = Math.floor(Math.random() * (max - min + 1)) + min;

        result.textContent = "🎲 Ergebnis: " + random;
});
}