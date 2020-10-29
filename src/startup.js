import mongoose from "mongoose";
import { middlewares } from "sc-common";
import { Table } from "sc-game-base";

import appConfigs from "./app-configs";

export default class Startup extends Table.TableGameStartup {
    async configureServices(app) {
        super.configureServices(app);

        await middlewares.database.configureDatabase(mongoose, appConfigs.database);
    }
}
