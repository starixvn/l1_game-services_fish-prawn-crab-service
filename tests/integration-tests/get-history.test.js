import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { socketOptions } from "./stubs/test-data";
import { initUserSession } from "./init-user-session";

export const getHistoryTest = () => {
    describe("when get history", () => {
        it("should return history", (done) => {
            // Arrange
            const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
            client.handleSignedInEvent(() => {
                client.sendInGameEvent();
            });
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
                    phien: 1190119,
                    currency: "$US",
                    name: "NormalUser",
                    odds: {
                        single: 2,
                        double: 3.4,
                        triple: 6
                    },
                    partnerId: "dummy-partner-id",
                    rate: 1,
                    betLogDetails: [],
                    roundId: 1190119,
                    paid: true,
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
                    phien: 1190119,
                    currency: "$US",
                    name: "NormalUser",
                    odds: {
                        single: 2,
                        double: 3.4,
                        triple: 6
                    },
                    partnerId: "dummy-partner-id",
                    rate: 1,
                    betLogDetails: [],
                    roundId: 1190119,
                    paid: false,
                },
            ];

            client.on(socketOptions.gameName, (inGameData) => {
                if (inGameData.remainingTime) {
                    setTimeout(() => {
                        // Act
                        client.sendGetHistoryEvent();

                        // Assert
                        client.on(socketOptions.gameName, (data) => {
                            if (data.history) {
                                const actualBetLogs = data.history.betLogs.map((betLog) => {
                                    delete betLog.result;
                                    delete betLog.settlementResult;
                                    return betLog;
                                });

                                expect(actualBetLogs).toEqual(expectedData);
                                expect(data.history.total).toBeGreaterThan(0);
                                expect(data.history.page).toBe(1);
                                expect(data.history.pageSize).toBe(8);

                                client.close();
                                done();
                            }
                        });
                    }, 1000);
                }
            });
        });
    });
};
