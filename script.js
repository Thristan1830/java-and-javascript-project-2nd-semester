const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// Attendance records
const attendanceRecords = [];

function beep() {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.1;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.15);
}

function formatTimestamp(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const correctPassword = "Thristan1830";
    const username = document.getElementById("username").value;
    const passwordInput = document.getElementById("password");
    const wrongAlert = document.getElementById("wrongAlert");
    const loginTimeDisplay = document.getElementById("loginTime");

    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }

    if (passwordInput.value !== correctPassword) {
        beep();
        wrongAlert.textContent = "Wrong password!";
        wrongAlert.style.display = "block";
        passwordInput.value = "";
        passwordInput.focus();
        loginTimeDisplay.textContent = "";
    } else {
        wrongAlert.style.display = "none";

        // Capture timestamp
        const now = new Date();
        const timestamp = formatTimestamp(now);

        // Display timestamp
        loginTimeDisplay.textContent = `Login Time: ${timestamp}`;

        // Save attendance record
        attendanceRecords.push({
            username: username,
            timestamp: timestamp
        });

        // Generate attendance summary file
        let attendanceText = "Attendance Summary\n\n";
        attendanceRecords.forEach(record => {
            attendanceText += `Username: ${record.username}\nTimestamp: ${record.timestamp}\n\n`;
        });

        const blob = new Blob([attendanceText], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "attendance_summary.txt";
        link.click();
    }
});
