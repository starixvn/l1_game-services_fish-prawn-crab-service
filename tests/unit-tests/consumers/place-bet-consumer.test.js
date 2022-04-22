import { stub } from "jest-micro-auto-stub";
import { helpers } from "sc-common";
import { Core } from "sc-game-base";

import PlaceBetConsumer from "../../../src/consumers/place-bet-consumer";
import gameSettings from "../../../src/game-settings";

const definition = new Core.GameDefinition(gameSettings);
const publisher = stub(Core.BaseEventPublishers.BaseEventPublisher);

describe("PlaceBetConsumer test", () => {
    const gameData = new Core.GameData();
    const consumer = new PlaceBetConsumer(definition, gameData, publisher);

    it("should inherit Core place bet consumer", () => {
        expect(consumer instanceof Core.BaseEventConsumers.PlaceBetConsumer);
    });
});

describe("BettingTimeValidation test", () => {
    describe("when game's disabled", () => {
        it("should return invalid bet", () => {
            // arrange
            const gameData = new Core.GameData();
            gameData.gameConfigs = {
                enabled: false,
            };
            const consumer = new PlaceBetConsumer(definition, gameData, publisher);

            // act
            const actualResult = consumer.composeBettingTimeValidationCriteria(1);

            // assert
            expect(actualResult[0].failure).toBe(true);
        });
    });

    describe("when betting after place bet time", () => {
        it("should return invalid bet", () => {
            // arrange
            const gameData = new Core.GameData(31);
            const consumer = new PlaceBetConsumer(definition, gameData, publisher);

            // act
            const criterions = consumer.composeBettingTimeValidationCriteria(1);

            // assert
            expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
                failure: true,
                notice: { errorCode: helpers.noticeHelper.placeBetNextRound },
            });
        });
    });

    describe("when betting on waitting time", () => {
        it("should return invalid bet", () => {
            // arrange
            const gameData = new Core.GameData(34);
            const consumer = new PlaceBetConsumer(definition, gameData, publisher);

            // act
            const criterions = consumer.composeBettingTimeValidationCriteria(1);

            // assert
            expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
                failure: true,
                notice: { errorCode: helpers.noticeHelper.placeBetNextRound },
            });
        });
    });

    describe("When roundId not match running round", () => {
        it("should return placeBetNextRound notice ", () => {
            // arrange
            const gameData = new Core.GameData(20);
            gameData.roundId = 2;
            gameData.gameConfigs.enabled = true;
            const placeBetConsumer = new PlaceBetConsumer(definition, gameData);

            // act
            var criterions = placeBetConsumer.composeBettingTimeValidationCriteria(1);

            // assert
            expect(criterions).not.toBeEmpty();
            expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
                failure: true,
                notice: { errorCode: helpers.noticeHelper.invalidBet, gameRoundId: 1 },
            });
        });
    });

    describe("when betting on place bet time", () => {
        it("should return valid bet ", () => {
            // arrange
            const gameData = new Core.GameData(20);
            gameData.gameConfigs = {
                enabled: true,
            };
            const consumer = new PlaceBetConsumer(definition, gameData, publisher);

            const validationCriteria = consumer.composeBettingTimeValidationCriteria(1);

            // act
            const actualResult = validationCriteria.some((criteria) => criteria.failure);

            // assert
            expect(actualResult).toBe(false);
        });
    });
});
