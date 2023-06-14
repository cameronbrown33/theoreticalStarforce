function calculate() {
    let itemLevel = parseInt(document.getElementById("level").value);
    let current = parseInt(document.getElementById("current_stars").value);
    let target = parseInt(document.getElementById("target_stars").value);
    let mvp = document.getElementById("mvp").value;
    let safeguard = document.getElementById("safeguard").value;
    let starCatch = document.getElementById("starcatch").value;
    let thirtyPercentEvent = document.getElementById("30_percent").checked;
    let fiveTenFifteenEvent = document.getElementById("5_10_15").checked;
    let onePlusOneEvent = document.getElementById("one_plus_one").checked;
    let noBoomEvent = document.getElementById("no_boom").checked;

    let error = false;
    let errorMessage = "";

    if (itemLevel < 0) {
        error = true;
        errorMessage = "Lowest item level is 0."
    }
    if (current < 0 || target < 0) {
        error = true;
        errorMessage = "Lowest star value is 0."
    }
    if (current > 25 || target > 25) {
        error = true;
        errorMessage = "Highest star value is 25."
    }
    if (error) {
        document.getElementById("results").innerHTML =
    `
<div class="results-line">
  <p>
    Error: ${errorMessage}<br />
  </p>
</div>
    `
    return;
    }
    
    let successRate = [.95, .9, .85, .85, .8, .75, .7, .65, .6, .55, .5, .45, .4, .35, .3, .3, .3, .3, .3, .3, .3, .3, .03, .02, .01];
    let boomRate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, .01, .02, .02, .03, .03, .03, .04, .04, .1, .1, .2, .3, .4];
    let price = [];
    let basePrice = [];
    let cost = [];
    let noBoomChance = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    let totalCost = 0;
    let totalBooms = 0;

    let mvpDiscount = 0;
    if (mvp === "silver") {
        mvpDiscount = 0.03;
    }
    else if (mvp === "gold") {
        mvpDiscount = 0.05;
    }
    else if (mvp === "diamond") {
        mvpDiscount = 0.1;
    }

    let starCatchRate = 1;
    if (starCatch === "low") {
        starCatchRate = 1.025;
    }
    else if (starCatch === "standard") {
        starCatchRate = 1.05;
    }
    
    for (let i = 0; i < 25; i++) {
        let divisor = 2500;
        let exponent = 2.7;
        if (i < 10) {
            exp = 1;
        }
        else if (i === 10) {
            divisor = 40000;
        }
        else if (i === 11) {
            divisor = 22000;
        }
        else if (i === 12) {
            divisor = 15000;
        }
        else if (i === 13) {
            divisor = 11000;
        }
        else if (i === 14) {
            divisor = 7500;
        }
        else {
            divisor = 20000;
        }

        basePrice.push(100 * Math.round(Math.pow(itemLevel, 3) * Math.pow(i + 1, exponent) / divisor + 10));

        if (noBoomEvent && i >= 12 && i < 15) {
            boomRate[i] = 0;
        }
        if (fiveTenFifteenEvent && (i === 5 || i === 10 || i === 15)) {
            successRate[i] = 1;
            boomRate[i] = 0;
        }
        let extraCost = 0;
        if (((safeguard === "always" || safeguard === "under_15") && i >= 12 && i < 15) ||
            ((safeguard === "always" || safeguard === "over_15") && i >= 15 && i < 17)) {
            if (boomRate[i] !== 0) {
                extraCost = basePrice[i];
            }
            boomRate[i] = 0;
        }
        let discount = 1;
        if (thirtyPercentEvent) {
            discount -= .3;
        }
        if (i < 17) {
            discount -= mvpDiscount;
        }
        basePrice[i] = discount * basePrice[i];
        price.push(basePrice[i] + extraCost);
        
        if (successRate[i] < 1) {
            successRate[i] *= starCatchRate;
        }
    }

    ////////////////////////////////////
    // HERE'S WHERE THE MAGIC HAPPENS //
    ////////////////////////////////////

    for (let i = 0; i < target; i++) {
        let singleCost = 0;

        if (i <= 10 || i === 15 || i === 20) {
            // easy enough
            singleCost = (price[i] + (1 - successRate[i]) * boomRate[i] * boomCost(i, cost)) / successRate[i];
        }
        else if (i === 11 || i === 16 || i === 21) {
            // getting intense
            if (onePlusOneEvent && i == 11) {
                singleCost = price[i] + (1 - successRate[i]) * cost[i - 1];
            }
            else {
                singleCost = (price[i] + (1 - successRate[i]) * (1 - boomRate[i]) * cost[i - 1] + (1 - successRate[i]) * boomRate[i] * boomCost(i, cost)) / successRate[i];
            }
        }
        else {
            // oh dear god wtf
            if (onePlusOneEvent && i == 12) {
                singleCost = (price[i] + (1 - successRate[i]) * (1 - boomRate[i]) * (price[i - 1] + (1 - successRate[i - 1]) * price[i - 2])) / successRate[i];
            }
            else {
                singleCost = (price[i] + (1 - successRate[i]) * (1 - boomRate[i]) * (price[i - 1] + (1 - successRate[i - 1]) * (1 - boomRate[i - 1]) * (basePrice[i - 2] + cost[i - 1]) + (1 - successRate[i - 1]) * boomRate[i - 1] * boomCost(i, cost)) + (1 - successRate[i]) * boomRate[i] * boomCost(i, cost)) / successRate[i];
            }
        }

        if (i >= current) {
            if (onePlusOneEvent) {
                if (current < 12 && i < 12) {
                    if (current % 2 == 0 && i % 2 == 0) {
                        totalCost += singleCost;
                    }
                    else if (current % 2 == 1 && i % 2 == 1) {
                        totalCost += singleCost;
                    }
                }
                else {
                    totalCost += singleCost;
                }
            }
            else {
                totalCost += singleCost;
            }
        }
        cost.push(singleCost);
    }

    for (let i = 12; i < target; i++) {
        let singleChance = 1;
        let loopChance = 0;

        if (i === 12 || i === 15 || i === 20) {
            loopChance = (1 - successRate[i]) * (1 - boomRate[i]);
        }
        else if (i === 16 || i === 21) {
            loopChance = (1 - successRate[i]) * (1 - boomRate[i]) * noBoomChance[i - 1];
        }
        else {
            loopChance = (1 - successRate[i]) * (1 - boomRate[i]) * (successRate[i - 1] + (1 - successRate[i - 1]) * (1 - boomRate[i - 1]) * noBoomChance[i - 1]);
        }
        singleChance = successRate[i] / (1 - loopChance);

        noBoomChance.push(singleChance);
    }

    let noBoomChanceFromCurrent = 1;
    let noBoomChanceFrom12 = 1;

    for (let i = 12; i < target; i++) {
        noBoomChanceFrom12 *= noBoomChance[i];
    }

    if (current > 12) {
        for (let i = current; i < target; i++) {
            noBoomChanceFromCurrent *= noBoomChance[i];
        }
    }
    else {
        noBoomChanceFromCurrent = noBoomChanceFrom12;
    }

    totalBooms = (1 - noBoomChanceFromCurrent) / noBoomChanceFrom12;

    let averageMeso = Math.round(totalCost).toLocaleString();
    let averageBooms = (Math.round(1000 * totalBooms) / 1000).toFixed(3);
    
    document.getElementById("results").innerHTML =
    `
<div class="results-line">
  <p>
    Average meso cost: ${averageMeso}<br />
    Average booms: ${averageBooms}<br />
  </p>
</div>
    `
}

function boomCost(star, cost) {
    if (star <= 12) {
        return 0;
    }
    let total = 0;
    for (let i = 12; i < star; i++) {
        total += cost[i];
    }
    return total;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calculate").addEventListener("click", function () {
        calculate();
    });
});