'use-strict';
const cryptoCoinsUrl = `crypto_coins.json`;
// Define the URL to the JSON file containing cryptocurrency data.

const REFETCH_INTERVAL = 120000; // 2 minutes

const init = () => {
    // Initialize the webpage when the DOM content is loaded.

    // Get DOM elements by their ID's:
    const homeLink = document.getElementById('homeLink');
    const iconNavBar = document.getElementById('iconNavBar');
    const reportsLink = document.getElementById('reportsLink');
    const aboutLink = document.getElementById('aboutLink');
    const searchInput = document.getElementById('searchInput');
    homeLink.addEventListener('click', displayHomePage);
    iconNavBar.addEventListener('click', displayHomePage);
    searchInput.addEventListener('input', (event) => displayCoinsCards(event.target.value));
    reportsLink.addEventListener('click', displayReports);
    aboutLink.addEventListener('click', displayAbout);

    displayHomePage();
    // Show home page as default
};
document.addEventListener('DOMContentLoaded', init);

function displayHomePage() {
    enableSearchInput();
    pageHtmlContent.innerHTML = '';
    drawBigLoader();
    setTimeout(async () => {
        await getAndDisplayCoinsCards();
    }, 1000);
}

function displayReports() {
    disableSearchInput();
    pageHtmlContent.innerHTML = '';
    drawBigLoader();
    setTimeout(() => {
        pageHtmlContent.innerHTML = `
        <div class="comingSoonPage">
        <h1>Coming Soon...</h1>
        <br>
        <h2>(Page under construction)</h2>
        <br>
        <i class="fa-solid fa-person-digging fa-2xl"></i>
        </div>
        `;
    }, 1000);
}

function displayAbout() {
    disableSearchInput();
    pageHtmlContent.innerHTML = '';
    drawBigLoader();
    setTimeout(() => {
        pageHtmlContent.innerHTML = `
        <div class = "container aboutMe">
            <div class="card aboutCard" >
                <img src="assets/images/IMG_8168.JPG" class="card-img-top" alt="myImage">
                <div class="card-body">
                    <h5>Nir Shoval</h5>
                    <h6 class="aboutMeSecondHeader">FS Web Developer</h6>
                    <p class="card-text aboutMeParagraphText">
                    <i class="fa-solid fa-circle" style="color: #186bfb;"></i>My project is a web application called "CryptoVal" which serves as a cryptocurrency comparison website.
                    <br>
                    <i class="fa-solid fa-circle" style="color: #186bfb;"></i>The application allows users to view information about various cryptocurrencies.
                    <br>
                    <i class="fa-solid fa-circle" style="color: #186bfb;"></i>Overall, CryptoVal provides a user-friendly interface for exploring and comparing cryptocurrency data.
                    </p>
                </div>
                <h6 class="contactMeHeader">Contact Us:</h6>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item"><i class="fa-solid fa-user" style="color: #186bfb;"></i> Nir Shoval, age: 22</li>
                  <li class="list-group-item"><i class="fa-solid fa-house" style="color: #186bfb;"></i> Qiryat Ono, Israel</li>
                  <li class="list-group-item"><i class="fa-solid fa-envelope" style="color: #186bfb;"></i> nirshoval2@gmail.com</li>
                  <li class="list-group-item"><i class="fa-solid fa-phone" style="color: #186bfb;"></i> 050-596-9009</li>
                </ul>
            </div>
        </div>
        `;
    }, 1000);
}

function disableSearchInput() {
    // Function that disabled the search input field.
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    searchInput.disabled = true;
}
function enableSearchInput() {
    // Function to enable the search input field
    const searchInput = document.getElementById('searchInput');
    searchInput.disabled = false;
}

let coins = [];

async function getAndDisplayCoinsCards() {
    //Fetch and display the coin cards
    try {
        const response = await fetch(cryptoCoinsUrl);
        const json = await response.json();
        coins = json;
        displayCoinsCards();
    } catch (err) {
        console.log(err);
    }
}

function shouldRefetch(firstDate, secondDate) {
    return firstDate.getTime() - secondDate.getTime() >= REFETCH_INTERVAL;
}

async function getAndDisplayCoinsInfo(id) {
    try {
        const saveData = getSessionStorage(id);
        if (saveData && saveData.createdAt && !shouldRefetch(new Date(), new Date(saveData.createdAt))) {
            return saveData;
        }
        drawSmallLoader(document.getElementById(`moreInfoBtn${id}`));
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        const coinsInfo = await response.json();
        setSessionStorage(id, { ...coinsInfo, createdAt: new Date() });
        return coinsInfo;
    } catch (err) {
        console.log(err);
    }
}

function setSessionStorage(id, data) {
    const jsonResponse = JSON.stringify(data);
    sessionStorage.setItem(id, jsonResponse);
}

function getSessionStorage(id) {
    const jsonResponse = sessionStorage.getItem(id);
    return JSON.parse(jsonResponse);
}

function displayCoinsCards(search) {
    // Function to display the coin cards on home page
    const searchValue = search || document.getElementById('searchInput').value;
    const searchLowercase = searchValue && searchValue.toLowerCase();
    const pageHtmlContent = document.getElementById('pageHtmlContent');
    if (!coins.length) {
        pageHtmlContent.innerHTML = '<p>No data available</p>';
        return;
    }

    let foundCoins = false;
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
        foundCoins = true;
        html += `
            <div id="${coin.id}" class="card coinCardSize mb-3 mt-2 pt-2 col-sm-12 col-md-4 col-lg-3 col-xl-2">
                <div class="form-check form-switch position-relative mt-2 me-2">
                    <input class="form-check-input position-absolute top-0 end-0" type="checkbox" ${selectedCoins.includes(coin.id) ? 'checked' : ''}
                    onchange="toggleList(\'${coin.id}\')" role="switch"id="${coin.id}Toggle">
                    <label class="form-check-label position-absolute top-0 end-0" for="flexSwitchCheckDefault"></label>
                </div>
                        <img src="${coin.image}" class="img-fluid rounded-circle coinImages" alt="${coin.name}">
                        <div id="${coin.id}CardBody" class="card-body">
                            <h5 class="card-title text-center">${coin.symbol}</h5>
                            <p class="card-text text-center">${coin.name}</p>
                            <div id="${coin.id}MoreInfoButton" class="text-center">
                                <button type="button" class="btn btn-primary btn-sm mt-1" id="moreInfoBtn${coin.id}" onclick="addMoreInfo(\'${
            coin.id
        }\')">
                                    Show More
                                </button>
                            </div>
                                <div id="Collapsed${coin.id}" class="collapse mt-2 pt-3 border-top border-bottom">
                                </div>
                        </div>
                </div>
            </div>
        `;
    }
    if (!foundCoins) {
        drawBigLoader();
        setTimeout(() => {
            pageHtmlContent.innerHTML = '<h1 class="searchNotFoundMessage">Coins not found..</h1>';
        }, 1000);
    } else {
        pageHtmlContent.innerHTML = html;
        coinsWithInfo.forEach((coin) => addMoreInfo(coin, true));
    }
}

function drawBigLoader() {
    //Draw a big loader in the main content
    pageHtmlContent.innerHTML = `
    <div class="d-flex justify-content-center mt-5">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `;
}

function drawSmallLoader(btn) {
    //Draw a small loader within a button
    setTimeout(() => {
        btn.innerHTML = `
        <div class="spinner-border spinner-border-sm " role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    }, 1);
}

const coinsWithInfo = [];
async function addMoreInfo(id, drawOnly) {
    //Add or remove more detailed information about a coin
    const moreInfoBtn = document.getElementById(`moreInfoBtn${id}`);
    const btnOpen = moreInfoBtn.getAttribute('open');
    if (!btnOpen) {
        if (!drawOnly) {
            coinsWithInfo.push(id);
        }
        const btnOpening = moreInfoBtn.getAttribute('opening');
        if (!btnOpening) {
            moreInfoBtn.setAttribute('opening', 'true');
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
    //Draw detailed information about a coin.
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
    // Hide detailed information about a coin.
    const moreInfo = document.getElementById(`Collapsed${id}`);
    moreInfo.classList.remove('collapse.show');
    moreInfo.classList.add('collapse');
}

const selectedCoins = [];
function toggleList(id) {
    const modalExitBtn = document.getElementById("modalExitBtn");
    modalExitBtn.addEventListener("click",closePopUp);
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
            for (let i = 0; i < coinClone.children.length; i++) {
                const cardChild = coinClone.children[i];
                if (`${coin}CardBody` === cardChild.id) {
                    for (let j = 0; j < cardChild.childNodes.length; j++) {
                        const cardBodyChild = cardChild.childNodes[j];
                        if (`${coin}MoreInfoButton` === cardBodyChild.id) {
                            cardChild.removeChild(cardBodyChild);
                        } else if (`Collapsed${coin}` === cardBodyChild.id) {
                            cardChild.removeChild(cardBodyChild);
                        }
                    }
                }
            }

            modalBody.appendChild(coinClone);
        });
        return;
    } else {
        setTimeout(() => {
            displayCoinsCards();
            $('#myModal').modal('hide');
        }, 150);
    }
}

function closePopUp() {
    $('#myModal').modal('hide');
    selectedCoins.pop();
    displayCoinsCards();
}
