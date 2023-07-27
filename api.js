"use strict";
(() => {
    async function getCryptoApi() {
        const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
        try{
            const response = await fetch(url);
            const json = await response.json();
           return json;
    
        }catch(err){
            alert(`Error in getting Crypto Api data- ${err}`);
        }
    }







})()