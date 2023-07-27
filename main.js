"use strict";
(() => {

    const TOTAL_CARDS = 100;

    function init() {
        const homeLink = document.getElementById("homeLink");
        const reportsLink = document.getElementById("reportsLink");
        const aboutLink = document.getElementById("aboutLink");

        const pageHtmlContent = document.getElementById("pageHtmlContent");

        homeLink.addEventListener("click", displayHome);
        reportsLink.addEventListener("click", displayReports);
        aboutLink.addEventListener("click", displayAbout);

        const homePage = document.createElement("div");
        homePage.className = "homePage";

        const list = document.getElementById("listCont")
        const searchInput = document.getElementById("input")
        const toggleListCont = document.getElementById("toggleListCont")

        drawHomePage()
    }

    async function drawHomePage() {
        clearContent();
        drawBigLoader();
        await getCryptoApi();
        clearContent();
        homePage.append(...getCards());
        draw(homePage);
    }

    function clearContent() {
        toggleListCont.innerHTML = " ";
        homePage.innerHTML = " ";
        pageHtmlContent.innerHTML = " ";
    }

    function drawBigLoader() {
        pageHtmlContent.innerHTML = `
        <div class="spinner-grow" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        `;
    }

    async function getCryptoApi() {
        const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
        try {
            const response = await fetch(url);
            const json = await response.json();
            return json;

        } catch (err) {
            alert(`Error in getting Crypto Api data- ${err}`);
        }
    }

    function getCards() {
        const cardsArray = []
        for (let index = 0; index < TOTAL_CARDS; index++) {
            const card = new CardClosed(index)
            let toggleStatus = false
            const found = state.toggleListId.find(element => element === card.id);
            if (card.id === found) { toggleStatus = true } else { toggleStatus = false }
            const currentCardUi = cardUi(card.name, card.symbol, card.image, card.id, toggleStatus)

            currentCardUi.className = "column"
            cardsArray.push(currentCardUi)
        }
        return cardsArray
    }

})()