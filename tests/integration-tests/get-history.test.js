import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { socketOptions } from "./stubs/test-data";
import { initUserSession } from "./init-user-session";

export const getHistoryTest = () => {
    describe("when get history", () => {
        let driver;

        beforeAll(async () => {
            driver = new GameClientDriver(socketOptions, initUserSession(normalUser));
            await driver.handleSignedInEvent();
            driver.sendInGameEvent();
            await driver.handleGameEvent((inGameData) => inGameData.remainingTime);
        });

        afterAll(() => {
            driver.close();
        });

        it("should return history", async () => {
            // Arrange
            const expectedData = [
                {
                    stag: 100,
                    gourd: 0,
                    rooster: 0,
                    fish: 0,
                    crab: 0,
                    prawn: 0,
                    betwin: 0,
                    freeBet: false,
                    name: "NormalUser",
                    odds: {
                        single: 2,
                        double: 3.4,
                        triple: 6,
                    },
                    rate: 1,
                    betLogDetails: [],
                    roundId: 1190119,
                    phien: 1190119,
                },
                {
                    stag: 100,
                    gourd: 0,
                    rooster: 0,
                    fish: 0,
                    crab: 0,
                    prawn: 0,
                    betwin: 0,
                    freeBet: false,
                    name: "NormalUser",
                    odds: {
                        single: 2,
                        double: 3.4,
                        triple: 6,
                    },
                    rate: 1,
                    betLogDetails: [],
                    roundId: 1190119,
                    phien: 1190119,
                },
            ];

            // Act
            driver.sendGetHistoryEvent();
            const result = await driver.handleGameEvent((historyData) => historyData.history);

            const actualBetLogs = result.history.betLogs.map((betLog) => {
                delete betLog.result;
                delete betLog.settlementResult;
                return betLog;
            });

            expect(actualBetLogs).toEqual(expectedData);
            expect(result.history.total).toBeGreaterThan(0);
            expect(result.history.page).toBe(1);
            expect(result.history.pageSize).toBe(8);
        });
    });
};
