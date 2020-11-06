export default {
    hostingPort: 8085,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://10.2.189.50:8300",
        authUrl: "http://10.2.189.50:8303",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: true,
        requestTimeout: 10000,
        placeBetTimeout: 4500,
        enableApiLogs: true,
    },
    mainServerApiSettings: {
        url: "http://10.2.189.50:8888/main/api",
        auth: {
            url: "http://10.2.189.50:8303",
            id: "game-services",
            secret: "gameservices@20luminet&",
        },
        requestTimeout: 10000,
        placeBetTimeout: 4500,
        useAuthenticate: true,
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
    },
    enabledLogs: true,
    database: {
        url:
            "mongodb://lmn_backend:M7K4ttH%2AtZ3ml%3F%29%7CA%5DjN4%3FLBhwF%266IO%3C@10.3.189.54:27101,10.3.189.53:27102,10.3.189.53:27103/?replicaSet=SabaMain",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auto_reconnect: true,
        },
    },
    sentry: {
        sentryUrl: "https://6b166df44b284094b8d9da0f98837f35@sentryuat.sabagame.com/150",
        logIdentifier: "vip-fish-prawn-crab",
        env: "PROD",
    },
    authenticateSettings: {
        audiences: ["api", "admin-api"],
    },
    adminSecretKey: "asWDEer4yGdgsdqR4uqmKQZgh",
    enableCorsWs: true,
    corsUrls: [
        "http://sabagame.com",
        "http://www.sabagame.com",
        "https://sabagame.com",
        "https://www.sabagame.com",
        "https://www.gamesaba.com",
        "https://gamesaba.com",
        "http://www.gamesaba.com",
        "http://gamesaba.com",
        "http://admg.sabagame.com",
        "https://admg.sabagame.com",
        "http://adm.sabagame.com",
        "https://adm.sabagame.com",
    ],
};
