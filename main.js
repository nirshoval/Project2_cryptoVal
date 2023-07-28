"use strict";
(() => {
const cryptoCoinsUrl = `crypto_coins.json`;

const init = () => {
    const homeLink = document.getElementById('homeLink');
    const iconNavBar = document.getElementById('iconNavBar');
    const reportsLink = document.getElementById('reportsLink');
    const aboutLink = document.getElementById('aboutLink');
    const pageHtmlContent = document.getElementById('pageHtmlContent');
    const searchInput = document.getElementById('searchInput');
    homeLink.addEventListener('click', displayHome);
    iconNavBar.addEventListener('click', displayHome);
    searchInput.addEventListener('input', (event) => displayCoinsCards(event.target.value));
    // reportsLink.addEventListener("click", displayReports);
    // aboutLink.addEventListener("click", displayAbout);

    displayHome();
};

document.addEventListener('DOMContentLoaded', init);

function displayHome() {
    pageHtmlContent.innerHTML = '';
    drawBigLoader();
    setTimeout(async () => {
        await getAndDisplayCoinsCards();
    }, 1000);
}

let coins = [];

async function getAndDisplayCoinsCards() {
    try {
        const response = await fetch(cryptoCoinsUrl);
        const json = await response.json();
        coins = json;
        displayCoinsCards();
    } catch (err) {
        console.log(err);
    }
}
async function getAndDisplayCoinsInfo(id) {
    try {
        const saveData = getSessionStorage(id);
        if (saveData) {
            return saveData;
        }
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        const coinsInfo = await response.json();
        setSessionStorage(id, coinsInfo);
        return coinsInfo;
    } catch (err) {
        console.log(err);
    }
}

function displayCoinsCards(search) {
    const searchLowercase = search && search.toLowerCase();
    const pageHtmlContent = document.getElementById('pageHtmlContent');
    if (!coins.length) {
        pageHtmlContent.innerHTML = '<p>No data available</p>';
        return;
    }

    let html = '';
    for (const coin of coins) {
        if (
            searchLowercase &&
            !(
                coin.id.toLowerCase().includes(searchLowercase) ||
                coin.name.toLowerCase().includes(searchLowercase) ||
                coin.symbol.toLowerCase().includes(searchLowercase)
            )
        ) {
            continue;
        }
        html += `
        <div id=${coin.id} class="card mb-3 d-inline-block mt-2" style="max-width: 250px; max-height: 280px;">
        <div class="form-check form-switch position-relative mt-2 me-2">
            <input class="form-check-input position-absolute top-0 end-0" type="checkbox" ${selectedCoins.includes(coin.id) ? 'checked' : ''}
             onchange="toggleList(\'${coin.id}\')" role="switch"id="${coin.id}Toggle">
            <label class="form-check-label position-absolute top-0 end-0" for="flexSwitchCheckDefault"></label>
        </div>
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${coin.image}" class="img-fluid rounded-circle w-50 h-50" alt="${coin.name}">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${coin.symbol}</h5>
                    <p class="card-text">${coin.name}</p>
                    <div>
                        <button type="button" class="btn btn-primary btn-sm" id="moreInfoBtn${coin.id}" onclick="addMoreInfo(\'${coin.id}\')">
                            Show More
                        </button>
                    </div>
                         <div class="collapse" id="Collapsed${coin.id}">
                         </div>
                </div>
            </div>
        </div>
    </div>
        `;
    }
    pageHtmlContent.innerHTML = html;

    coinsWithInfo.forEach((coin) => addMoreInfo(coin, true));
}

function drawBigLoader() {
    pageHtmlContent.innerHTML = `
    <div class="d-flex justify-content-center mt-5">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `;
}
function drawSmallLoader(btn) {
    setTimeout(() => {
        btn.innerHTML = `
        <div class="spinner-border spinner-border-sm " role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    }, 1);
}

let clicked = false;

const coinsWithInfo = [];
async function addMoreInfo(id, drawOnly) {
    const moreInfoBtn = document.getElementById(`moreInfoBtn${id}`);
    const btnOpen = moreInfoBtn.getAttribute('open');
    if (!btnOpen) {
        if (!drawOnly) {
            coinsWithInfo.push(id);
        }
        const btnOpening = moreInfoBtn.getAttribute('opening');
        if (!btnOpening) {
            moreInfoBtn.setAttribute('opening', 'true');
            if (!getSessionStorage(id)) {
                drawSmallLoader(moreInfoBtn);
            }

            await cardInfo(id);
            moreInfoBtn.innerText = 'Show Less';

            moreInfoBtn.removeAttribute('opening');
            moreInfoBtn.setAttribute('open', 'true');
        }
    } else {
        if (!drawOnly) {
            coinsWithInfo.splice(
                coinsWithInfo.findIndex((coin) => coin === id),
                1
            );
        }
        moreInfoBtn.removeAttribute('open');
        moreInfoBtn.innerText = 'Show More';
        hideMoreInfo(id);
    }
}

async function cardInfo(id) {
    const coinsInfo = await getAndDisplayCoinsInfo(id);
    drawMoreInfo(id, coinsInfo);
}

function drawMoreInfo(id, info) {
    const moreInfo = document.getElementById(`Collapsed${id}`);
    let html = '';
    html += `
                <p>USD = ${info.market_data.current_price.usd} $</p>
                <p>EUR = ${info.market_data.current_price.eur} €</p>
                <p>ILS = ${info.market_data.current_price.ils} ₪</p>
        `;
    moreInfo.innerHTML = html;
    moreInfo.classList.remove('collapse');
    moreInfo.classList.add('collapse.show');
}

function hideMoreInfo(id) {
    const moreInfo = document.getElementById(`Collapsed${id}`);
    moreInfo.classList.remove('collapse.show');
    moreInfo.classList.add('collapse');
}

const selectedCoins = [];
function toggleList(id) {
    const modalBody = document.getElementById('modalBody');

    const coinIndex = selectedCoins.findIndex((coin) => coin === id);
    if (coinIndex === -1) {
        selectedCoins.push(id);
    } else {
        selectedCoins.splice(coinIndex, 1);
    }
    if (selectedCoins.length > 5) {
        $('#myModal').modal('show');
        modalBody.innerHTML = '';
        selectedCoins.forEach((coin) => {
            const coinElement = document.getElementById(coin);
            const coinClone = coinElement.cloneNode(true);
            modalBody.appendChild(coinClone);
        });
        return;
    }
    setTimeout(() => {
        displayCoinsCards();
        $('#myModal').modal('hide');
    }, 150);
}

function closePopUp() {
    $('#myModal').modal('hide');
    selectedCoins.pop();
    displayCoinsCards();
}

function setSessionStorage(id, data) {
    const jsonResponse = JSON.stringify(data);
    sessionStorage.setItem(id, jsonResponse);
}

function getSessionStorage(id) {
    const jsonResponse = sessionStorage.getItem(id);
    return JSON.parse(jsonResponse);
}

})()