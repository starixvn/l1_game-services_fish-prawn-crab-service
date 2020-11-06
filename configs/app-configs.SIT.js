export default {
    hostingPort: 8085,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://10.2.189.51:6300",
        authUrl: "http://10.2.189.51:6303",
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
        url: "http://10.2.189.51:7777/sit/main/api",
        auth: {
            url: "http://10.2.189.51:6303",
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
        url: "mongodb://lmn_backend:LmnBackend%40517@10.99.99.187:27301/?replicaSet=SabaSIT",
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
        env: "SIT",
    },
    authenticateSettings: {
        audiences: ["api", "admin-api"],
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    enableCorsWs: true,
    corsUrls: [
        "http://localhost:7456",
        "http://sit.sabagame.com",
        "https://sit.sabagame.com",
        "https://sit-admg.sabagame.com",
        "http://sit-adm.sabagame.com",
        "https://sit-adm.sabagame.com",
    ],
};
