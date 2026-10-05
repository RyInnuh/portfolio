const navButtons = document.querySelectorAll(".nav-button");
const pages = document.querySelectorAll(".page");
const openTabButtons = document.querySelectorAll("[data-open-tab]");

function openTab(tabName) {
    pages.forEach((page) => page.classList.toggle("active", page.id === tabName));
    navButtons.forEach((button) => button.classList.toggle("active", button.dataset.tab === tabName));

    if (tabName === "whiteboard") {
        requestAnimationFrame(initializeWhiteboard);
    }
}

navButtons.forEach((button) => button.addEventListener("click", () => openTab(button.dataset.tab)));
openTabButtons.forEach((button) => button.addEventListener("click", () => openTab(button.dataset.openTab)));

const projects = {
    goc: {
        file: "goc_branding.project",
        title: "GOC Branding",
        description: "Logo dla Globalnej Koalicji Okultystycznej i jej dywizji.",
        details: `Swego czasu dużo czytałem opowieści i raportów z SCP Wiki. Niedawno zachciałem spróbować stworzyć własną interpretację logo Globalnej Koalicji Okulstystycznej i jej dywizji.
        Celem było stworzenie ich w taki sposób, aby znaczenie symbolu było jasne (niekoniecznie wprost, ale poprzez skojarzenia i kontekst).
        `,
        tags: ["Adobe Illustrator", "Logo Design"],
        images: ["images/goc/GOC.png", "images/goc/GOC_PHYSICS.png", "images/goc/GOC_PNEUMA.png", "images/goc/GOC_PTOLEMY.png", "images/goc/GOC_PSYCHE.png", "images/goc/GOC_PSYCHE_SPECIALOBSERVERS.png", "images/goc/GOC_PANGAEA.png", "images/goc/GOC_GRC.png","images/goc/GOC_C108.png", "images/goc/GOC_HICOM.png", "images/goc/GOC_ParaCourt.png"]
    },
    mcd: {
        file: "mcd_redesign.project",
        title: "MC&D Redesign",
        description: "Remake logo Marshall, Carter & Dark Ltd. w mojej interpretacji. Inspirowane pracą @Randomini.",
        details: "Podobnie jak w przypadku GOC, celem było stworzenie spójnego logo w mojej własnej interpretacji.",
        tags: ["Adobe Illustrator", "Logo Design"],
        images: ["images/mc&d/MC&D.png"]
    },
    graphic_design: {
        file: "graphic_design.project",
        title: "Ilustracje i Plakaty",
        description: "Zbiór prostszych ilustracji i plakatów.",
        details: "Tutaj trafiają eksperymenty z sylwetką, uproszczeniem kształtów i czytelnością grafiki w małej skali. Część prac może później służyć jako element interfejsu, emblemat albo grafika pomocnicza.",
        tags: ["Adobe Illustrator", "Ilustracje i Plakaty"],
        images: ["images/posters/939_sketch.png", "images/posters/UNS_Kanaloa_Poster.png", "images/posters/GOC_HELIOS_POSTER1.png", "images/posters/GOC_HELIOS_POSTER2.png", "images/posters/MC&D_MarshallPoster.png"]
    },
    support_unit_project: {
        file: "support_unit_project.project",
        title: "Support Unit Project",
        description: "Bot do discorda, zawierający zestaw prostych narzędzi i systemów do wsparcia serwera, międzyinnymi: Relay System, Stikcy Messages System, Reminder System i Giveaway System..",
        details: `Bot został stworzony w celu zarządzania prostymi systemami. 
        Relay System - bot przekazuje wiadomości z jednego kanału na drugi, z możliwością dodania własnych reguł np. prz użyciu RegEx. 
        Sticky System - bot wysyła wiadomość na kanale i upewnia się, że jest zawsze ostatnią wysłaną na kanale (dobre dla tych co nie czytają przypiętych wiadomości).
        Reminder System - bot wysyła wiadomość co określony interval. Może to być co godzinę, w każdy wtorek, co tydzień itp.
        Giveaway System - standardowy system.
        Ważne: Bot nie używac "Application Commands" ponieważ użytkownicy nie powinni ich widzieć. Zamiast tego, używany jest stary system "prefix-ów".
        .`,
        tags: ["TypeScript", "Discord", "Automatyzaja"],
        images: ["images/support_unit/relay1.png","images/support_unit/sticky1.png", "images/support_unit/reminder1.png", "images/support_unit/reminder2.png", "images/support_unit/giveaway1.png", "images/support_unit/giveaway2.png"],
    }
};

const modal = document.getElementById("project-modal");
const modalFile = document.getElementById("modal-file");
const modalKicker = document.getElementById("modal-kicker");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalDetails = document.getElementById("modal-details");
const modalTags = document.getElementById("modal-tags");
const carouselStage = document.getElementById("carousel-stage");
const carouselCounter = document.getElementById("carousel-counter");
let currentProject = null;
let currentImage = 0;
let lastFocusedElement = null;

function getWrappedIndex(index, length) {
    return (index % length + length) % length;
}

function renderCarousel() {
    const images = currentProject.images;
    const previous = getWrappedIndex(currentImage - 1, images.length);
    const next = getWrappedIndex(currentImage + 1, images.length);
    const visible = [previous, currentImage, next];

    carouselStage.innerHTML = visible.map((imageIndex, position) => `
        <div class="carousel-slide ${position === 1 ? "center" : "side"}">
            <img src="${images[imageIndex]}" alt="${currentProject.title}, zdjęcie ${imageIndex + 1}" draggable="false">
        </div>
    `).join("");

    carouselCounter.textContent = `${currentImage + 1} / ${images.length}`;
}

function moveCarousel(direction) {
    currentImage = getWrappedIndex(currentImage + direction, currentProject.images.length);
    renderCarousel();
}

function openProject(projectKey, sourceElement) {
    currentProject = projects[projectKey];
    if (!currentProject) return;

    lastFocusedElement = sourceElement || document.activeElement;
    currentImage = 0;
    modalFile.textContent = currentProject.file;
    modalKicker.textContent = currentProject.kicker;
    modalTitle.textContent = currentProject.title;
    modalDescription.textContent = currentProject.description;
    modalDetails.textContent = currentProject.details;
    modalTags.innerHTML = currentProject.tags.map((tag) => `<span>${tag}</span>`).join("");
    renderCarousel();

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modal.querySelector(".modal-close").focus();
}

function closeProject() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocusedElement) lastFocusedElement.focus();
}

document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", () => openProject(card.dataset.project, card));
    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProject(card.dataset.project, card);
        }
    });
});

document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeProject));
document.getElementById("carousel-prev").addEventListener("click", () => moveCarousel(-1));
document.getElementById("carousel-next").addEventListener("click", () => moveCarousel(1));

document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("open")) return;
    if (event.key === "Escape") closeProject();
    if (event.key === "ArrowLeft") moveCarousel(-1);
    if (event.key === "ArrowRight") moveCarousel(1);
});

let whiteboardInitialized = false;
let highestZIndex = 10;

function randomizePosition(element, board, placedElements) {
    const padding = 24;
    const maxX = Math.max(padding, board.clientWidth - element.offsetWidth - padding);
    const maxY = Math.max(70, board.clientHeight - element.offsetHeight - padding);

    let chosenX = padding;
    let chosenY = 70;

    for (let attempt = 0; attempt < 80; attempt++) {
        const x = padding + Math.random() * Math.max(0, maxX - padding);
        const y = 70 + Math.random() * Math.max(0, maxY - 70);
        const rect = { left: x, top: y, right: x + element.offsetWidth, bottom: y + element.offsetHeight };

        const collision = placedElements.some((other) => {
            const otherRect = {
                left: parseFloat(other.style.left) || 0,
                top: parseFloat(other.style.top) || 0,
                right: (parseFloat(other.style.left) || 0) + other.offsetWidth,
                bottom: (parseFloat(other.style.top) || 0) + other.offsetHeight
            };
            return !(rect.right + 18 < otherRect.left || rect.left > otherRect.right + 18 || rect.bottom + 18 < otherRect.top || rect.top > otherRect.bottom + 18);
        });

        chosenX = x;
        chosenY = y;
        if (!collision) break;
    }

    element.style.left = `${chosenX}px`;
    element.style.top = `${chosenY}px`;
}

function makeDraggable(element, board) {
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    element.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        dragging = true;
        highestZIndex++;
        element.style.zIndex = highestZIndex;
        const boardRect = board.getBoundingClientRect();
        offsetX = event.clientX - boardRect.left - element.offsetLeft;
        offsetY = event.clientY - boardRect.top - element.offsetTop;
        element.setPointerCapture(event.pointerId);
    });

    element.addEventListener("pointermove", (event) => {
        if (!dragging) return;

        const maxX = Math.max(0, board.clientWidth - element.offsetWidth);
        const maxY = Math.max(0, board.clientHeight - element.offsetHeight);
        const boardRect = board.getBoundingClientRect();
        const x = Math.max(0, Math.min(event.clientX - boardRect.left - offsetX, maxX));
        const y = Math.max(0, Math.min(event.clientY - boardRect.top - offsetY, maxY));

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    });

    const endDrag = () => { dragging = false; };
    element.addEventListener("pointerup", endDrag);
    element.addEventListener("pointercancel", endDrag);
}

function initializeWhiteboard() {
    if (whiteboardInitialized) return;

    const board = document.getElementById("whiteboard");
    const blocks = [...board.querySelectorAll(".blok")];
    const placed = [];

    blocks.forEach((element) => {
        randomizePosition(element, board, placed);
        makeDraggable(element, board);
        placed.push(element);
    });

    whiteboardInitialized = true;
}

window.addEventListener("resize", () => {
    if (!whiteboardInitialized) return;
    const board = document.getElementById("whiteboard");
    if (!board.classList.contains("active")) return;

    board.querySelectorAll(".blok").forEach((element) => {
        const maxX = Math.max(0, board.clientWidth - element.offsetWidth);
        const maxY = Math.max(0, board.clientHeight - element.offsetHeight);
        element.style.left = `${Math.min(parseFloat(element.style.left) || 0, maxX)}px`;
        element.style.top = `${Math.min(parseFloat(element.style.top) || 0, maxY)}px`;
    });
});
