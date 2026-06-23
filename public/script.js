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

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const result = document.getElementById("result");

const size = canvas.width;
const center = size / 2;
const radius = center - 10;

const sliceAngle = (2 * Math.PI) / teams.length;

let currentRotation = 0;
let spinning = false;
let lastTeam = "";

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
    result.innerHTML = "🎲 Dreht...";

    const winnerIndex = Math.floor(Math.random() * teams.length);

    lastTeam = teams[winnerIndex];

    const segmentSize = 360 / teams.length;

    const targetAngle =
        360 -
        (winnerIndex * segmentSize + segmentSize / 2);

    const currentNormalized =
        ((currentRotation % 360) + 360) % 360;

    const extraSpins = 360 * 6;

    currentRotation +=
        extraSpins +
        ((targetAngle - currentNormalized + 360) % 360);

    canvas.style.transition =
        "transform 6s cubic-bezier(0.17, 0.67, 0.12, 0.99)";

    canvas.style.transform =
        `rotate(${currentRotation}deg)`;

    setTimeout(() => {

        result.innerHTML = `
            <h2>🏆 Dein Team:</h2>
            <h1>${teams[winnerIndex]}</h1>
        `;

        const buttons = document.getElementById("draftButtons");

        buttons.style.display = "block";

        document.getElementById("addP1").textContent =
            `➕ Add Player from ${teams[winnerIndex]} to Person 1`;

        document.getElementById("addP2").textContent =
            `➕ Add Player from ${teams[winnerIndex]} to Person 2`;

        spinning = false;

    }, 6000);
});

const rosterScreen = document.getElementById("rosterScreen");
const roster = document.getElementById("roster");
const rosterTitle = document.getElementById("rosterTitle");

function renderRoster(person) {

    roster.innerHTML = "";

    rosterTitle.textContent = person;

    const slots = [
        "PG", "PG",
        "SG", "SG",
        "SF", "SF",
        "PF", "PF",
        "C", "C"
    ];

    slots.forEach(pos => {

        const div = document.createElement("div");

        div.className = "roster-slot";

        div.innerHTML = `
            <span class="position">${pos}</span>
            —
            <span class="empty">Leer</span>
        `;

        roster.appendChild(div);
    });
}

document.getElementById("addP1").addEventListener("click", () => {

    document.getElementById("wheelScreen").style.display = "none";
    rosterScreen.style.display = "block";

    renderRoster("Person 1");
});

document.getElementById("addP2").addEventListener("click", () => {

    document.getElementById("wheelScreen").style.display = "none";
    rosterScreen.style.display = "block";

    renderRoster("Person 2");
});

document.getElementById("backBtn").addEventListener("click", () => {

    rosterScreen.style.display = "none";
    document.getElementById("wheelScreen").style.display = "block";
});