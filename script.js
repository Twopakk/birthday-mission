"use strict";

/*
    Personnalisation:
    - Remplace FRIEND_NAME par son prénom.
    - Remplace SECRET_CODE par le vrai code secret de 13 chiffres.
    - Place la première vidéo dans video/anniversaire-part1.mp4.
    - Place la deuxième vidéo dans video/anniversaire-part2.mp4.
*/

const FRIEND_NAME = "Zoé Are";
const SECRET_CODE = "2810422062026";

const app = document.getElementById("app");
const allScreens = document.querySelectorAll(".screen");

const introScreen = document.getElementById("introScreen");
const abandonScreen = document.getElementById("abandonScreen");
const memoryScreen = document.getElementById("memoryScreen");
const transitionScreen = document.getElementById("transitionScreen");
const candyScreen = document.getElementById("candyScreen");
const timerScreen = document.getElementById("timerScreen");
const codeScreen = document.getElementById("codeScreen");
const finalLoadingScreen = document.getElementById("finalLoadingScreen");
const videoScreen = document.getElementById("videoScreen");
const birthdayVideo = document.getElementById("birthdayVideo");
const secondBirthdayVideo = document.getElementById("secondBirthdayVideo");
const secondVideoButton = document.getElementById("secondVideoButton");
const secondVideoContainer = document.getElementById("secondVideoContainer");
const videoFallback = document.getElementById("videoFallback");

function showScreen(screen) {
    allScreens.forEach((item) => item.classList.remove("active"));
    screen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function wait(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

function triggerGlitch() {
    app.classList.add("glitch");
    document.body.classList.add("glitch-flash");

    if (navigator.vibrate) {
        navigator.vibrate(60);
    }

    setTimeout(() => {
        app.classList.remove("glitch");
        document.body.classList.remove("glitch-flash");
    }, 420);
}

function typeText({ text, element, speed = 22, clear = true, callback }) {
    if (clear) {
        element.textContent = "";
    }

    element.classList.add("cursor");
    let index = 0;

    function typeCharacter() {
        if (index < text.length) {
            const character = text.charAt(index);
            element.textContent += character;
            index++;

            const delay = character === "\n" ? speed * 3 : speed;
            setTimeout(typeCharacter, delay);
            return;
        }

        element.classList.remove("cursor");

        if (callback) {
            callback();
        }
    }

    typeCharacter();
}

const introText = document.getElementById("introText");
const loadingContainer = document.getElementById("loadingContainer");
const loadingProgress = document.getElementById("loadingProgress");
const loadingPercent = document.getElementById("loadingPercent");
const missionChoice = document.getElementById("missionChoice");
const acceptMissionButton = document.getElementById("acceptMissionButton");
const abandonMissionButton = document.getElementById("abandonMissionButton");

const introMessage = `
INITIALISATION DU SYSTÈME...

Connexion au serveur sécurisé...

Recherche d'une connexion active...

Connexion établie.

Analyse de l'appareil...

Caméra détectée.
Microphone détecté.
Localisation détectée.

Analyse de l'identité en cours...
`;

function startInitialLoading() {
    loadingContainer.classList.remove("hidden");
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 7) + 2;
        progress = Math.min(progress, 100);

        loadingProgress.style.width = `${progress}%`;
        loadingPercent.textContent = `${progress}%`;

        if (
            (progress >= 32 && progress <= 38) ||
            (progress >= 68 && progress <= 74) ||
            (progress >= 90 && progress <= 96)
        ) {
            triggerGlitch();
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(showMissionChoice, 700);
        }
    }, 125);
}

function showMissionChoice() {
    loadingContainer.classList.add("hidden");

    const missionMessage = `
CORRESPONDANCE TROUVÉE.

================================
IDENTITÉ DÉTECTÉE

NOM : ${FRIEND_NAME}

STATUT : B-DAY GIRL 

NIVEAU D'AUTORISATION : GROSSE FOLLE...EUH JE VEUX DIRE : BOSS LADY 
================================

Nous sommes des hackeurs de l'ombre et on a lu vos messages et appris que 
Ramin vous a préparé une vidéo qu'il compte jamais vous montrer.

On a décidé de vous aider à la récupérer.

Vous pouvez accepter l'extraction de la video et voir ce qu'elle contient
ou ne jamais savoir.
`;

    typeText({
        text: missionMessage,
        element: introText,
        speed: 20,
        callback: () => {
            missionChoice.classList.remove("hidden");
        }
    });
}

acceptMissionButton.addEventListener("click", () => {
    missionChoice.classList.add("hidden");
    triggerGlitch();

    const acceptedMessage = `
EXTRACTION ACCEPTÉE.

Il est fort Ramin, il a mis une série d'épreuves pour proteger la video.
Tu vas devoir les réussir pour la voir.

CHARGEMENT DE LA PREMIÈRE ÉPREUVE...
`;

    typeText({
        text: acceptedMessage,
        element: introText,
        speed: 24,
        callback: () => {
            setTimeout(() => {
                triggerGlitch();
                showScreen(memoryScreen);
                initialiseMemoryChallenge();
            }, 700);
        }
    });
});

abandonMissionButton.addEventListener("click", () => {
    triggerGlitch();
    showScreen(abandonScreen);

    setTimeout(() => {
        window.close();
    }, 1000);
});

const correctMemoryOrder = [
    "Parc Walibi",
    "Gare de Lausanne",
    "Europa-Park",
    "5 minutes à Yverdon",
    "Week-end à Paris"
];

const memoryCards = document.getElementById("memoryCards");
const selectedMemoriesList = document.getElementById("selectedMemories");
const emptySelectionMessage = document.getElementById("emptySelectionMessage");
const resetMemoriesButton = document.getElementById("resetMemoriesButton");
const verifyMemoriesButton = document.getElementById("verifyMemoriesButton");
const memoryFeedback = document.getElementById("memoryFeedback");

let shuffledMemories = [];
let selectedMemories = [];
let memoryChallengeLocked = false;

function shuffleArray(items) {
    const array = [...items];

    for (let index = array.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    }

    return array;
}

function initialiseMemoryChallenge() {
    shuffledMemories = shuffleArray(correctMemoryOrder);
    selectedMemories = [];
    memoryChallengeLocked = false;
    memoryFeedback.textContent = "";
    memoryFeedback.className = "feedback";
    renderMemoryCards();
    renderSelectedMemories();
}

function renderMemoryCards() {
    memoryCards.innerHTML = "";

    shuffledMemories.forEach((memory) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "memory-card";
        button.textContent = `> ${memory}`;

        if (selectedMemories.includes(memory)) {
            button.classList.add("selected");
            button.disabled = true;
        }

        button.addEventListener("click", () => selectMemory(memory));
        memoryCards.appendChild(button);
    });
}

function renderSelectedMemories() {
    selectedMemoriesList.innerHTML = "";
    emptySelectionMessage.classList.toggle("hidden", selectedMemories.length > 0);

    selectedMemories.forEach((memory) => {
        const listItem = document.createElement("li");
        listItem.textContent = memory;
        selectedMemoriesList.appendChild(listItem);
    });
}

function selectMemory(memory) {
    if (memoryChallengeLocked || selectedMemories.includes(memory)) {
        return;
    }

    selectedMemories.push(memory);
    renderMemoryCards();
    renderSelectedMemories();
    memoryFeedback.textContent = `${selectedMemories.length}/5 souvenirs sélectionnés.`;
    memoryFeedback.className = "feedback";
}

resetMemoriesButton.addEventListener("click", () => {
    if (memoryChallengeLocked) {
        return;
    }

    selectedMemories = [];
    memoryFeedback.textContent = "Sélection réinitialisée.";
    memoryFeedback.className = "feedback";
    renderMemoryCards();
    renderSelectedMemories();
});

verifyMemoriesButton.addEventListener("click", () => {
    if (memoryChallengeLocked) {
        return;
    }

    if (selectedMemories.length !== 5) {
        memoryFeedback.textContent = "Sélectionne les cinq souvenirs avant de vérifier.";
        memoryFeedback.className = "feedback incorrect";
        return;
    }

    const isCorrect = selectedMemories.every((memory, index) => memory === correctMemoryOrder[index]);

    if (!isCorrect) {
        memoryFeedback.textContent = "ORDRE INCORRECT. Les souvenirs ne sont pas encore correctement alignés.";
        memoryFeedback.className = "feedback incorrect";
        triggerGlitch();
        return;
    }

    memoryChallengeLocked = true;
    memoryFeedback.textContent = "CHRONOLOGIE VALIDÉE. ACCÈS AU NIVEAU SUIVANT.";
    memoryFeedback.className = "feedback correct";

    if (navigator.vibrate) {
        navigator.vibrate([60, 40, 60]);
    }

    setTimeout(showTransitionToCandy, 1100);
});

const transitionText = document.getElementById("transitionText");

function showTransitionToCandy() {
    showScreen(transitionScreen);
    triggerGlitch();

    const message = `
ÉPREUVE N° 1 VALIDÉE.

ANALYSE DE LA CHRONOLOGIE...

COHÉRENCE CONFIRMÉE.

OUVERTURE DU PROTOCOLE SUIVANT...

G... G... G... Gardenscape???

DÉGATS DÉGATS.
`;

    typeText({
        text: message,
        element: transitionText,
        speed: 24,
        callback: () => {
            setTimeout(() => {
                triggerGlitch();
                showScreen(candyScreen);
                initialiseCandyGame();
            }, 750);
        }
    });
}

const candyGrid = document.getElementById("candyGrid");
const candyScoreElement = document.getElementById("candyScore");
const candyMovesElement = document.getElementById("candyMoves");
const candyMessage = document.getElementById("candyMessage");

const candySymbols = ["🍬", "🍭", "🍓", "🍋", "🍇"];
const candyRows = 5;
const candyColumns = 5;
const candyGoal = 5;

let candyBoard = [];
let selectedCandy = null;
let candyScore = 0;
let candyMoves = 0;
let candyLocked = false;

function randomCandy() {
    return candySymbols[Math.floor(Math.random() * candySymbols.length)];
}

function createBoardWithoutMatches() {
    do {
        candyBoard = [];

        for (let row = 0; row < candyRows; row++) {
            const currentRow = [];

            for (let column = 0; column < candyColumns; column++) {
                currentRow.push(randomCandy());
            }

            candyBoard.push(currentRow);
        }
    } while (findCandyMatches().length > 0 || !hasValidCandyMove());
}

function initialiseCandyGame() {
    selectedCandy = null;
    candyScore = 0;
    candyMoves = 0;
    candyLocked = false;
    candyScoreElement.textContent = "0";
    candyMovesElement.textContent = "0";
    candyMessage.textContent = "Sélectionne un premier bonbon.";
    createBoardWithoutMatches();
    renderCandyBoard();
}

function renderCandyBoard(matchedPositions = []) {
    candyGrid.innerHTML = "";

    for (let row = 0; row < candyRows; row++) {
        for (let column = 0; column < candyColumns; column++) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "candy-cell";
            button.textContent = candyBoard[row][column] || "";
            button.setAttribute("aria-label", `Case ${row + 1}, ${column + 1}`);

            const isSelected = selectedCandy && selectedCandy.row === row && selectedCandy.column === column;
            const isMatched = matchedPositions.some((position) => position.row === row && position.column === column);

            if (isSelected) {
                button.classList.add("selected");
            }

            if (isMatched) {
                button.classList.add("matched");
            }

            button.addEventListener("click", () => selectCandy(row, column));
            candyGrid.appendChild(button);
        }
    }
}

function selectCandy(row, column) {
    if (candyLocked) {
        return;
    }

    const currentPosition = { row, column };

    if (!selectedCandy) {
        selectedCandy = currentPosition;
        candyMessage.textContent = "Choisis maintenant un bonbon voisin.";
        renderCandyBoard();
        return;
    }

    if (selectedCandy.row === row && selectedCandy.column === column) {
        selectedCandy = null;
        candyMessage.textContent = "Sélection annulée.";
        renderCandyBoard();
        return;
    }

    if (!areAdjacent(selectedCandy, currentPosition)) {
        selectedCandy = currentPosition;
        candyMessage.textContent = "Ces bonbons ne sont pas voisins. Nouveau bonbon sélectionné.";
        renderCandyBoard();
        return;
    }

    performCandySwap(selectedCandy, currentPosition);
}

function areAdjacent(firstPosition, secondPosition) {
    const rowDifference = Math.abs(firstPosition.row - secondPosition.row);
    const columnDifference = Math.abs(firstPosition.column - secondPosition.column);
    return rowDifference + columnDifference === 1;
}

function swapCandyPositions(firstPosition, secondPosition) {
    const temporaryCandy = candyBoard[firstPosition.row][firstPosition.column];
    candyBoard[firstPosition.row][firstPosition.column] = candyBoard[secondPosition.row][secondPosition.column];
    candyBoard[secondPosition.row][secondPosition.column] = temporaryCandy;
}

async function performCandySwap(firstPosition, secondPosition) {
    candyLocked = true;
    candyMoves++;
    candyMovesElement.textContent = candyMoves.toString();

    swapCandyPositions(firstPosition, secondPosition);
    selectedCandy = null;
    renderCandyBoard();

    await wait(220);

    const matches = findCandyMatches();

    if (matches.length === 0) {
        swapCandyPositions(firstPosition, secondPosition);
        renderCandyBoard();
        candyMessage.textContent = "Aucune combinaison. Échange annulé.";
        triggerGlitch();
        candyLocked = false;
        return;
    }

    await resolveCandyMatches();
    candyLocked = false;
}

function findCandyMatches() {
    const positions = new Map();

    for (let row = 0; row < candyRows; row++) {
        let startColumn = 0;

        for (let column = 1; column <= candyColumns; column++) {
            const currentCandy = candyBoard[row][startColumn];
            const sameCandy = column < candyColumns && candyBoard[row][column] === currentCandy;

            if (sameCandy) {
                continue;
            }

            const matchLength = column - startColumn;

            if (currentCandy && matchLength >= 3) {
                for (let index = startColumn; index < column; index++) {
                    positions.set(`${row}-${index}`, { row, column: index });
                }
            }

            startColumn = column;
        }
    }

    for (let column = 0; column < candyColumns; column++) {
        let startRow = 0;

        for (let row = 1; row <= candyRows; row++) {
            const currentCandy = candyBoard[startRow][column];
            const sameCandy = row < candyRows && candyBoard[row][column] === currentCandy;

            if (sameCandy) {
                continue;
            }

            const matchLength = row - startRow;

            if (currentCandy && matchLength >= 3) {
                for (let index = startRow; index < row; index++) {
                    positions.set(`${index}-${column}`, { row: index, column });
                }
            }

            startRow = row;
        }
    }

    return Array.from(positions.values());
}

function hasValidCandyMove() {
    for (let row = 0; row < candyRows; row++) {
        for (let column = 0; column < candyColumns; column++) {
            const current = { row, column };
            const neighbors = [
                { row: row + 1, column },
                { row, column: column + 1 }
            ];

            for (const neighbor of neighbors) {
                if (neighbor.row >= candyRows || neighbor.column >= candyColumns) {
                    continue;
                }

                swapCandyPositions(current, neighbor);
                const createsMatch = findCandyMatches().length > 0;
                swapCandyPositions(current, neighbor);

                if (createsMatch) {
                    return true;
                }
            }
        }
    }

    return false;
}

async function resolveCandyMatches() {
    let matches = findCandyMatches();

    while (matches.length > 0) {
        candyScore++;
        candyScoreElement.textContent = Math.min(candyScore, candyGoal).toString();
        candyMessage.textContent = `COMBINAISON VALIDÉE : ${Math.min(candyScore, candyGoal)}/${candyGoal}`;
        renderCandyBoard(matches);

        if (navigator.vibrate) {
            navigator.vibrate([45, 35, 45]);
        }

        await wait(380);

        removeMatchedCandies(matches);
        dropCandies();
        fillEmptyCandyCells();
        renderCandyBoard();

        await wait(350);

        if (candyScore >= candyGoal) {
            completeCandyChallenge();
            return;
        }

        matches = findCandyMatches();
    }

    if (!hasValidCandyMove()) {
        candyMessage.textContent = "Nouvelle grille générée. Le système poursuit l'épreuve.";
        createBoardWithoutMatches();
        renderCandyBoard();
        return;
    }

    candyMessage.textContent = "Continue. Le système attend d'autres combinaisons.";
}

function removeMatchedCandies(matches) {
    matches.forEach((position) => {
        candyBoard[position.row][position.column] = null;
    });
}

function dropCandies() {
    for (let column = 0; column < candyColumns; column++) {
        const remainingCandies = [];

        for (let row = candyRows - 1; row >= 0; row--) {
            const candy = candyBoard[row][column];

            if (candy) {
                remainingCandies.push(candy);
            }
        }

        for (let row = candyRows - 1; row >= 0; row--) {
            const remainingIndex = candyRows - 1 - row;
            candyBoard[row][column] = remainingCandies[remainingIndex] || null;
        }
    }
}

function fillEmptyCandyCells() {
    for (let row = 0; row < candyRows; row++) {
        for (let column = 0; column < candyColumns; column++) {
            if (!candyBoard[row][column]) {
                candyBoard[row][column] = randomCandy();
            }
        }
    }
}

function completeCandyChallenge() {
    candyLocked = true;
    candyMessage.textContent = "ANOMALIE CORRIGÉE. PROTOCOLE SUCRÉ VALIDÉ.";

    if (navigator.vibrate) {
        navigator.vibrate([80, 40, 80]);
    }

    setTimeout(() => {
        triggerGlitch();
        showScreen(timerScreen);
        initialiseTimerChallenge();
    }, 1300);
}

const startTimerButton = document.getElementById("startTimerButton");
const stopTimerButton = document.getElementById("stopTimerButton");
const resetTimerButton = document.getElementById("resetTimerButton");
const timerPulse = document.getElementById("timerPulse");
const timerStatus = document.getElementById("timerStatus");
const timerFeedback = document.getElementById("timerFeedback");

const timerMinimum = 20000;
const timerMaximum = 21000;

let timerStartTime = 0;
let timerRunning = false;
let timerLocked = false;

function initialiseTimerChallenge() {
    timerStartTime = 0;
    timerRunning = false;
    timerLocked = false;
    startTimerButton.disabled = false;
    stopTimerButton.disabled = true;
    resetTimerButton.classList.add("hidden");
    timerPulse.classList.remove("running", "success");
    timerPulse.textContent = "20";
    timerStatus.textContent = "Prête pour la synchronisation.";
    timerFeedback.textContent = "";
    timerFeedback.className = "feedback";
}

startTimerButton.addEventListener("click", () => {
    if (timerLocked || timerRunning) {
        return;
    }

    timerStartTime = performance.now();
    timerRunning = true;
    startTimerButton.disabled = true;
    stopTimerButton.disabled = false;
    resetTimerButton.classList.add("hidden");
    timerPulse.classList.add("running");
    timerFeedback.textContent = "";
    timerFeedback.className = "feedback";
    timerStatus.textContent = "Chronomètre lancé. Le temps reste invisible.";

    if (navigator.vibrate) {
        navigator.vibrate(45);
    }
});

stopTimerButton.addEventListener("click", () => {
    if (timerLocked || !timerRunning) {
        return;
    }

    const elapsedTime = performance.now() - timerStartTime;
    timerRunning = false;
    stopTimerButton.disabled = true;
    timerPulse.classList.remove("running");

    if (elapsedTime >= timerMinimum && elapsedTime <= timerMaximum) {
        timerLocked = true;
        timerPulse.classList.add("success");
        timerStatus.textContent = "Synchronisation validée.";
        timerFeedback.textContent = "PARFAIT. Fenêtre des 20 secondes atteinte.";
        timerFeedback.className = "feedback correct";

        if (navigator.vibrate) {
            navigator.vibrate([70, 35, 70]);
        }

        setTimeout(() => {
            triggerGlitch();
            showScreen(codeScreen);
            secretCodeInput.focus();
        }, 1200);

        return;
    }

    startTimerButton.disabled = true;
    resetTimerButton.classList.remove("hidden");
    timerStatus.textContent = "Synchronisation refusée.";

    if (elapsedTime < timerMinimum) {
        timerFeedback.textContent = "Trop tôt. Le système attendait le signal entre 20 et 21 secondes.";
    } else {
        timerFeedback.textContent = "Trop tard. Le système attendait le signal entre 20 et 21 secondes.";
    }

    timerFeedback.className = "feedback incorrect";
    triggerGlitch();
});

resetTimerButton.addEventListener("click", initialiseTimerChallenge);

const secretCodeInput = document.getElementById("secretCodeInput");
const codeCounter = document.getElementById("codeCounter");
const verifyCodeButton = document.getElementById("verifyCodeButton");
const codeFeedback = document.getElementById("codeFeedback");

secretCodeInput.addEventListener("input", () => {
    const digitsOnly = secretCodeInput.value.replace(/\D/g, "");
    secretCodeInput.value = digitsOnly.slice(0, 13);
    codeCounter.textContent = `${secretCodeInput.value.length}/13 chiffres`;
    codeFeedback.textContent = "";
    codeFeedback.className = "feedback";
});

secretCodeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        verifyCodeButton.click();
    }
});

verifyCodeButton.addEventListener("click", () => {
    const submittedCode = secretCodeInput.value.trim();

    if (submittedCode.length !== 13) {
        codeFeedback.textContent = "Le code doit contenir exactement treize chiffres.";
        codeFeedback.className = "feedback incorrect";
        return;
    }

    if (submittedCode !== SECRET_CODE) {
        codeFeedback.textContent = "CODE REFUSÉ. Vérifie les lettres et réessaie.";
        codeFeedback.className = "feedback incorrect";
        triggerGlitch();
        return;
    }

    codeFeedback.textContent = "CODE ACCEPTÉ. IDENTITÉ CONFIRMÉE.";
    codeFeedback.className = "feedback correct";
    verifyCodeButton.disabled = true;
    secretCodeInput.disabled = true;

    if (navigator.vibrate) {
        navigator.vibrate([80, 40, 80]);
    }

    setTimeout(startFinalSequence, 1000);
});

const finalLoadingText = document.getElementById("finalLoadingText");
const finalProgressContainer = document.getElementById("finalProgressContainer");
const finalProgress = document.getElementById("finalProgress");
const finalPercent = document.getElementById("finalPercent");

function startFinalSequence() {
    showScreen(finalLoadingScreen);
    triggerGlitch();

    const finalMessage = `
CODE ACCEPTÉ.

ON S'OCCUPE DU RESTE.

MWHAHAHAHAHAH.

EXTRACTION EN COURS...
`;

    typeText({
        text: finalMessage,
        element: finalLoadingText,
        speed: 24,
        callback: () => {
            finalProgressContainer.classList.remove("hidden");
            runFinalProgress();
        }
    });
}

function runFinalProgress() {
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 7) + 2;
        progress = Math.min(progress, 100);
        finalProgress.style.width = `${progress}%`;
        finalPercent.textContent = `${progress}%`;

        if ((progress >= 40 && progress <= 47) || (progress >= 78 && progress <= 84)) {
            triggerGlitch();
        }

        if (progress >= 100) {
            clearInterval(interval);

            setTimeout(() => {
                finalProgressContainer.classList.add("hidden");

                const accessMessage = `
DÉCHIFFREMENT TERMINÉ.

ACCÈS AUTORISÉ.

OUVERTURE DU MESSAGE...
`;

                typeText({
                    text: accessMessage,
                    element: finalLoadingText,
                    speed: 28,
                    callback: () => {
                        setTimeout(showBirthdayVideo, 900);
                    }
                });
            }, 650);
        }
    }, 130);
}

function showBirthdayVideo() {
    triggerGlitch();

    setTimeout(() => {
        document.body.classList.add("birthday-mode");
        showScreen(videoScreen);
        videoFallback.classList.add("hidden");
        secondVideoContainer.classList.add("hidden");
        secondVideoButton.classList.remove("hidden");
        birthdayVideo.currentTime = 0;
        secondBirthdayVideo.pause();
        secondBirthdayVideo.currentTime = 0;
        birthdayVideo.load();
        secondBirthdayVideo.load();

        const playPromise = birthdayVideo.play();

        if (playPromise) {
            playPromise.catch(() => {
                videoFallback.classList.remove("hidden");
            });
        }
    }, 550);
}

birthdayVideo.addEventListener("error", () => {
    videoFallback.classList.remove("hidden");
});

secondVideoButton.addEventListener("click", () => {
    secondVideoContainer.classList.remove("hidden");
    secondVideoButton.classList.add("hidden");
    secondBirthdayVideo.currentTime = 0;
    secondBirthdayVideo.play();
});

showScreen(introScreen);

typeText({
    text: introMessage,
    element: introText,
    speed: 20,
    callback: startInitialLoading
});
