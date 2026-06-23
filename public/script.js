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

function drawWheel() {
    ctx.clearRect(0, 0, size, size);

    teams.forEach((team, i) => {

        // Start bei -90° => erstes Feld oben
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

        // Text
        ctx.save();

        ctx.translate(center, center);
        ctx.rotate(startAngle + sliceAngle / 2);

        ctx.fillStyle = "#fff";
        ctx.font = "11px Arial";
        ctx.textAlign = "right";

        ctx.fillText(team, radius - 15, 4);

        ctx.restore();
    });

    // Mittelpunkt
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

    // Gewinner vorher festlegen
    const winnerIndex = Math.floor(Math.random() * teams.length);

    const segmentSize = 360 / teams.length;

    /*
      Gewinnersegment exakt unter Pfeil platzieren.
      Da das Rad bei -90° startet, müssen wir das berücksichtigen.
    */
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

        spinning = false;

    }, 6000);
});