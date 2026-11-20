
// ==========================================
// EINSTELLUNGEN – HIER SPÄTER ANPASSEN
// ==========================================

// Das richtige Lösungswort
const CORRECT_ANSWER = "DELPHI";

// Der täglich freigegebene Gutschein-PIN
const VOUCHER_PIN = "7070";

// Dein echter Thalia-Gutscheincode
const VOUCHER_CODE = "DEIN-GUTSCHEINCODE";

// Startdatum der Ermittlung (Jahr-Monat-Tag)
const START_DATE = "2026-11-21";

// ==========================================
// TÄGLICHE HINWEISE
// ==========================================

function getRevealedLetters() {
    const start = new Date(START_DATE + "T00:00:00");
    const today = new Date();

    const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const difference = Math.floor(
        (todayDate - start) / (1000 * 60 * 60 * 24)
    );

    return Math.max(
        0,
        Math.min(difference + 1, VOUCHER_PIN.length)
    );
}

// ==========================================
// BUCHSTABEN ANZEIGEN
// ==========================================

function displayLetters() {
    const container = document.getElementById("letterContainer");
    const status = document.getElementById("hintStatus");

    const revealed = getRevealedLetters();

    container.innerHTML = "";

    for (let i = 0; i < VOUCHER_PIN.length; i++) {

        const box = document.createElement("div");

        if (i < revealed) {
            box.className = "letter";
            box.textContent = VOUCHER_PIN[i];
        } else {
            box.className = "letter hidden-letter";
            box.textContent = "?";
        }

        container.appendChild(box);
    }

    if (revealed === 0) {
        status.textContent =
            "Die erste PIN-Ziffer wird am 21.11.2026 freigegeben.";
    } else if (revealed === VOUCHER_PIN.length) {
        status.textContent =
            "Der vollständige PIN wurde freigegeben. Der Barcode ist jetzt ebenfalls verfügbar.";
        revealSuccess();
    } else {
        status.textContent =
            revealed + " von " + VOUCHER_PIN.length +
            " PIN-Ziffern freigegeben.";
    }
}

// Den vollständigen Erfolgsbereich mit Barcode-Foto einblenden.
// Er erscheint nach richtiger Lösung oder automatisch nach Freigabe
// aller vier PIN-Ziffern.
function revealSuccess() {
    const panel = document.getElementById("successPanel");
    panel.classList.remove("hidden");
}

// Falls die Seite über Mitternacht geöffnet bleibt, die Tagesfreigabe
// direkt beim nächsten lokalen Tageswechsel erneut prüfen.
function scheduleMidnightRefresh() {
    const now = new Date();
    const nextMidnight = new Date(
        now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1
    );
    const delay = nextMidnight.getTime() - now.getTime();

    setTimeout(function() {
        displayLetters();
        scheduleMidnightRefresh();
    }, delay);
}

// ==========================================
// LÖSUNG ÜBERPRÜFEN
// ==========================================

function checkAnswer() {

    const input = document.getElementById("answer");
    const feedback = document.getElementById("feedback");

    const userAnswer = input.value
        .trim()
        .toLocaleUpperCase("de-DE");

    const correctAnswer = CORRECT_ANSWER
        .trim()
        .toLocaleUpperCase("de-DE");

    if (userAnswer === correctAnswer) {

        feedback.textContent = "Ermittlung erfolgreich!";
        feedback.style.color = "#8eaf72";

        revealSuccess();

        input.disabled = true;

    } else {

        feedback.textContent =
            "Falsche Spur! Das gesuchte Wort stimmt noch nicht.";

        feedback.style.color = "#c75a50";

    }
}

// ==========================================
// ENTER-TASTE FUNKTION
// ==========================================

document.getElementById("answer").addEventListener(
    "keydown",
    function(event) {
        if (event.key === "Enter") {
            checkAnswer();
        }
    }
);

// ==========================================
// SEITE STARTEN
// ==========================================

displayLetters();
scheduleMidnightRefresh();


// ==========================================
// EINMALIGES TUTORIAL
// ==========================================

const TUTORIAL_KEY = "ermittlungsakte_tutorial_seen_v2";

function showTutorial() {

    const alreadySeen = localStorage.getItem(TUTORIAL_KEY);

    if (!alreadySeen) {
        document.getElementById("tutorialOverlay")
            .classList.remove("hidden");
    }
}

function closeTutorial() {

    document.getElementById("tutorialOverlay")
        .classList.add("hidden");

    localStorage.setItem(TUTORIAL_KEY, "true");
}

// Tutorial beim Seitenaufruf überprüfen
showTutorial();
