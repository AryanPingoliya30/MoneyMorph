const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapIcon = document.querySelector(".swap");


// Load initial exchange rate
window.addEventListener("load", () => {
    UpdateExchangeRate();
});

// Populate currency options
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

        select.addEventListener("change", (evt) => {
            updateFlag(evt.target);
        });
    }
}

// Update flag image on selection change
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// On button click, fetch exchange rate
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    UpdateExchangeRate();
});

// Fetch and display exchange rate
async function UpdateExchangeRate() {
    const amountInput = document.querySelector(".amount input");
    let amtVal = amountInput.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amountInput.value = "1";
    }

    const from = fromCurr.value.toLowerCase();
    const to = toCurr.value.toLowerCase();
    const URL = `${BASE_URL}/currencies/${from}.json`;

    try {
        const response = await fetch(URL);
        const data = await response.json();

        const rate = data[from][to];
        const finalAmount = (amtVal * rate).toFixed(2);

        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = `Failed to fetch exchange rate. (${error.message})`;
        console.error("Error fetching exchange rate:", error);
    }
}

swapIcon.addEventListener("click", () => {
    // Swap selected values
    let temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;

    // Update flags
    updateFlag(fromCurr);
    updateFlag(toCurr);

    // Refresh exchange rate
    UpdateExchangeRate();
});
