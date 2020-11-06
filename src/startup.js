import mongoose from "mongoose";
import { middlewares } from "sc-common";
import { Table } from "sc-game-base";

import appConfigs from "./app-configs";
import AdminSocketRouter from "./routers/AdminSocketRouter";

export default class Startup extends Table.TableGameStartup {
    async configureServices(app) {
        super.configureServices(app);

        await middlewares.database.configureDatabase(mongoose, appConfigs.database);
    }

    initAdminSocketRouter(socketClient) {
        const router = new AdminSocketRouter();

        router.init(this.definition, this.gameData, socketClient, this.appConfigs.adminSecretKey);
    }
}
