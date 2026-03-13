const form = document.querySelector("form");
const searchInput = document.getElementById("card-search");
const cardList = document.getElementById("card-list");
const mtgApp = document.getElementById("mtg-app");

// show previous search
const prevSearchDisplay = document.createElement("p");
form.after(prevSearchDisplay);

window.addEventListener("load", () => {
    const previousSearch = localStorage.getItem("lastCardSearch");
    if (previousSearch) {
        prevSearchDisplay.textContent = `Last searched: ${previousSearch}`;
        searchInput.value = previousSearch;
        searchCards();
    }
});

// handle/prevent blank form submission
form.addEventListener("submit", function (e) {
    e.preventDefault();
    searchCards();
});

// create search functionality for cards + async function
async function searchCards() {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
        cardList.innerHTML = "<p>Please enter a card name or word.</p>";
        return;
    }
    // display last searched with localStorage
    localStorage.setItem("lastCardSearch", searchTerm);
    prevSearchDisplay.textContent = `Last searched: ${searchTerm}`;

    try {
        // template literal + await 
        const response = await fetch(
            `https://api.magicthegathering.io/v1/cards?name=${searchTerm}`
        );
        const data = await response.json();
    
        renderCards(data.cards);
    } catch (error) {
        mtgApp.innerHTML = error.message;
    }
}

// render and display the card data
function renderCards(cards) {

    cardList.innerHTML = "";

    if (!cards || cards.length === 0) {
        cardList.innerHTML = "<p>No cards found.</p>";
        return;
    }
    // only show cards with front images
    const validCards = cards.filter(card => card.imageUrl);

    if (validCards.length === 0) {
        cardList.innerHTML = "<p>No cards with images found.</p>";
        return;
    }

    // arrow function
    validCards.forEach(card => {
        // array/object destructuring for displayed card data
        const cardDiv = document.createElement("div");
        cardDiv.className = "card";

        const { name = "Unknown", type = "N/A" } = card;
        const colors = card.colors ? card.colors.join(", ") : "Colorless";
        const rarity = card.rarity || "Unknown";
        const set = card.setName || "Unknown Set";

        cardDiv.innerHTML = `
      <img src="${card.imageUrl}" alt="${name}">
      <p>Card Name: ${name}</p>
      <p>Type: ${type}</p>
      <p>Colors: ${colors}</p>
      <p>Rarity: ${rarity}</p>
      <p>Set: ${set}</p>
    `;

        cardList.appendChild(cardDiv);

    });

}