const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";
const FALLBACK_URL = "https://latest.currency-api.pages.dev/v1/currencies/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");



for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}



const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

const fetchExchangeRate = async (url) => {
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
};




const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = parseFloat(amount.value);
    if (isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const url = `${BASE_URL}${fromCurr.value.toLowerCase()}.json`;
    const fallbackUrl = `${FALLBACK_URL}${fromCurr.value.toLowerCase()}.json`;

    let data = await fetchExchangeRate(url);

    if (!data) {
        data = await fetchExchangeRate(fallbackUrl);
    }
    console.log(data[fromCurr.value.toLowerCase()])

    // here we are checking if the data is not null and fromCurr code is present in the data
    if (data && data[fromCurr.value.toLowerCase()]) {
        // Step 1: Get the exchange rates for the 'from' currency
        let exchangeRatesForFromCurrency = data[fromCurr.value.toLowerCase()];
        console.log(exchangeRatesForFromCurrency)

        // Step 2: Get the rate for the 'to' currency from those exchange rates
        let rate = exchangeRatesForFromCurrency[toCurr.value.toLowerCase()];
        console.log(rate)

        console.log(rate)
        if (rate !== undefined) {
            let finalAmount = (amtVal * rate).toFixed(2);
            msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
        } else {
            msg.innerText = `Exchange rate for ${toCurr.value} not found.`;
        }
    } else {
        msg.innerText = "Error fetching exchange rate data.";
    }
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
