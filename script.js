// Configurações
const walletAddress = "0x0263EEA129f86cA24089d58ed6dF1B78B4E42e6D";
const apiKey = "DeEQXRPo5vwwilqNm7s72lS6teu4n5v_";
const progressBar = document.getElementById('progressBar');
const totalBalanceElement = document.getElementById('totalBalance');
const levelElement = document.getElementById('level');

// Redes
const networks = [
    { url: `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}`, coinId: "matic-network" },
    { url: `https://arb-mainnet.g.alchemy.com/v2/${apiKey}`, coinId: "ethereum" },
    { url: `https://berachain-mainnet.g.alchemy.com/v2/${apiKey}`, coinId: "berachain" },
    { url: `https://base-mainnet.g.alchemy.com/v2/${apiKey}`, coinId: "ethereum" },
    { url: `https://bnb-mainnet.g.alchemy.com/v2/${apiKey}`, coinId: "binancecoin" }
];

// Níveis
const levels = [
    { level: 1, value: 2, name: "Café Quentinho" },
    { level: 2, value: 10, name: "Pizza de Pepperoni" },
    { level: 3, value: 25, name: "Camiseta Estilosa" },
    { level: 4, value: 50, name: "Jantar Chique" },
    { level: 5, value: 100, name: "Fone de Ouvido Top" },
    { level: 6, value: 250, name: "Bicicleta Novinha" },
    { level: 7, value: 500, name: "Console de Videogame" },
    { level: 8, value: 1000, name: "Viagem de Fim de Semana" },
    { level: 9, value: 2500, name: "Notebook Turbinado" },
    { level: 10, value: 5000, name: "Carro Usado dos Sonhos" }
];

// Funções
async function fetchBalance(url) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "eth_getBalance",
                params: [walletAddress, "latest"]
            })
        });
        const data = await response.json();
        if (data.error) return 0;
        return parseInt(data.result, 16) / 1e18;
    } catch (error) {
        console.error("Erro ao buscar saldo:", error);
        return 0;
    }
}

async function fetchPrice(coinId) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
        const data = await response.json();
        return data[coinId]?.usd || 0;
    } catch (error) {
        console.error(`Erro ao buscar preço de ${coinId}:`, error);
        return 0;
    }
}

async function updateTotalBalance() {
    let totalUsd = 0;

    for (const network of networks) {
        const balance = await fetchBalance(network.url);
        const price = await fetchPrice(network.coinId);
        totalUsd += balance * price;
    }

    const maxGoal = 5000;
    const percentage = Math.min((totalUsd / maxGoal) * 100, 100);
    progressBar.style.width = percentage + '%';

    totalBalanceElement.textContent = totalUsd.toFixed(2);

    let currentLevel = "Nenhum";
    for (const level of levels) {
        if (totalUsd >= level.value) {
            currentLevel = `${level.level} - ${level.name}`;
        } else {
            break;
        }
    }
    levelElement.textContent = currentLevel;
}

// Executar ao carregar e atualizar a cada 1 minuto
updateTotalBalance();
setInterval(updateTotalBalance, 60000); // 60000 ms = 1 minuto
