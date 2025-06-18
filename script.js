const scenarioSelect = document.getElementById('scenario');
const customRateLabel = document.getElementById('customRateLabel');
const customRateInput = document.getElementById('customRate');

scenarioSelect.addEventListener('change', () => {
    if (scenarioSelect.value === 'custom') {
        customRateLabel.style.display = 'block';
    } else {
        customRateLabel.style.display = 'none';
    }
});

function calculate() {
    const monthly = parseFloat(document.getElementById('monthly').value) || 0;
    const yearly = parseFloat(document.getElementById('yearly').value) || 0;
    const years = parseInt(document.getElementById('years').value) || 0;
    let rate = parseFloat(scenarioSelect.value);
    if (scenarioSelect.value === 'custom') {
        rate = parseFloat(customRateInput.value) / 100;
    }
    let price = parseFloat(document.getElementById('initialPrice').value) || 0;

    let btc = 0;
    let invested = 0;
    const patrimony = [];
    const investedTimeline = [];
    const priceTimeline = [];

    for (let year = 0; year < years; year++) {
        btc += (monthly * 12) / price;
        btc += yearly / price;
        invested += monthly * 12 + yearly;
        const value = btc * price;
        patrimony.push(value);
        investedTimeline.push(invested);
        priceTimeline.push(price);
        price += price * rate;
    }

    const finalValue = btc * price;

    document.getElementById('totalBTC').innerText = `BTC acumulado: ${btc.toFixed(6)}`;
    document.getElementById('totalInvested').innerText = `Total investido: R$ ${invested.toFixed(2)}`;
    document.getElementById('finalValue').innerText = `Valor estimado em R$: R$ ${finalValue.toFixed(2)}`;

    document.querySelector('.results').style.display = 'block';

    plotChart(patrimony, investedTimeline, priceTimeline);
}

function plotChart(patrimony, investedTimeline, priceTimeline) {
    const ctx = document.getElementById('chart').getContext('2d');
    if (window.investChart) {
        window.investChart.destroy();
    }
    const labels = patrimony.map((_, idx) => `Ano ${idx + 1}`);
    window.investChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Patrimônio (R$)',
                    data: patrimony,
                    borderColor: 'green',
                    fill: false
                },
                {
                    label: 'Total Investido (R$)',
                    data: investedTimeline,
                    borderColor: 'blue',
                    fill: false
                },
                {
                    label: 'Cotação BTC (R$)',
                    data: priceTimeline,
                    borderColor: 'orange',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.getElementById('calculate').addEventListener('click', calculate);
document.getElementById('clear').addEventListener('click', () => {
    document.getElementById('monthly').value = 0;
    document.getElementById('yearly').value = 0;
    document.getElementById('years').value = 1;
    scenarioSelect.value = '0.8';
    customRateInput.value = 0;
    customRateLabel.style.display = 'none';
    document.getElementById('initialPrice').value = 0;
    document.querySelector('.results').style.display = 'none';
    if (window.investChart) {
        window.investChart.destroy();
    }
});
