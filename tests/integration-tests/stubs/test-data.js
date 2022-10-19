import gameSetting from "./../../../src/game-settings";

const game = {
    id: gameSetting.id,
    name: gameSetting.name,
};

const currencyData = { code: "USD", name: "$US" };

const socketOptions = {
    socketUri: `http://localhost:8085/user/${gameSetting.name.toLowerCase()}`,
    gameName: game.name,
    proxyRoute: "/socket.io",
};

const gameConfig = {
    type: 0,
    name: "baucua",
    minBet: 1,
    maxBet: 3000,
    maxBetPerChoices: { fish: 2000, prawn: 2000, crab: 2000, stag: 2000, gourd: 2000, rooster: 2000 },
    odds: { single: 2, double: 3.4, triple: 6 },
};

const rounds = [
    {
        id: 1190119,
        exchangeRateId: 1,
        result: {
            dice1: 0,
            dice2: 1,
            dice3: 3,
        },
        settlementResult: {
            stag: true,
            gourd: true,
            rooster: false,
            fish: true,
            crab: false,
            prawn: false,
        },
    },
    {
        id: 1190118,
        exchangeRateId: 1,
        result: {
            dice1: 3,
            dice2: 1,
            dice3: 0,
        },
        settlementResult: {
            stag: true,
            gourd: true,
            rooster: false,
            fish: true,
            crab: false,
            prawn: false,
        },
    },
    {
        id: 1190117,
        exchangeRateId: 1,
        result: {
            dice1: 5,
            dice2: 3,
            dice3: 1,
        },
        settlementResult: {
            stag: false,
            gourd: true,
            rooster: false,
            fish: true,
            crab: false,
            prawn: true,
        },
    },
];

const userBetData = (uid) => {
    return [
        {
            freeBet: false,
            uid: uid,
            betwin: 0,
            currency: "$US",
            playerId: 1,
            name: "NormalUser",
            odds: gameConfig.odds,
            partnerId: "dummy-partner-id",
            rate: 1,
            stag: 100,
            gourd: 0,
            rooster: 0,
            fish: 0,
            crab: 0,
            prawn: 0,
            siteId: "111",
            paid: true,
            roundId: 1190119,
            operatorId: " ",
        },
        {
            freeBet: false,
            uid: uid,
            betwin: 0,
            currency: "$US",
            playerId: 4,
            name: "NormalUser",
            odds: gameConfig.odds,
            partnerId: "dummy-partner-id",
            rate: 1,
            stag: 100,
            gourd: 0,
            rooster: 0,
            fish: 0,
            crab: 0,
            prawn: 0,
            siteId: "111",
            paid: true,
            roundId: 1190119,
            operatorId: " ",
        },
    ];
};

export { game, currencyData, socketOptions, gameConfig, rounds, userBetData };
