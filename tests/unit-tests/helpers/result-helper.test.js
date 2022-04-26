import { generateResult, getSettlementResult, generateRawResultForHash } from "../../../src/helpers/result-helper";

describe("generateResult test", () => {
    it("should return 3 dices having value between 0 and 5", () => {
        const actualResult = generateResult();

        expect(actualResult).toContainAllKeys(["dice1", "dice2", "dice3"]);
        expect(Object.values(actualResult)).toSatisfyAll((dice) => dice >= 0 && dice <= 5);
    });
});

describe("getSettlementResult test", () => {
    const testCases = [
        {
            result: { dice1: 0, dice2: 1, dice3: 2 },
            expectSettlementResult: { stag: true, gourd: true, rooster: true, fish: false, crab: false, prawn: false },
        },
        {
            result: { dice1: 3, dice2: 4, dice3: 5 },
            expectSettlementResult: { stag: false, gourd: false, rooster: false, fish: true, crab: true, prawn: true },
        },
        {
            result: { dice1: 2, dice2: 2, dice3: 1 },
            expectSettlementResult: { stag: false, gourd: true, rooster: true, fish: false, crab: false, prawn: false },
        },
        {
            result: { dice1: 0, dice2: 0, dice3: 0 },
            expectSettlementResult: { stag: true, gourd: false, rooster: false, fish: false, crab: false, prawn: false },
        },
    ];

    it.each(testCases)("should return correct settlement result", ({ result, expectSettlementResult }) => {
        const actualResult = getSettlementResult(result);

        expect(actualResult).toEqual(expectSettlementResult);
    });
});

describe("generateResult tests", () => {
    describe("when not passing mode", () => {
        it("should return enough results", () => {
            // act
            var result = generateResult();

            // assert
            expect(Object.keys(result).length).toBe(3);
        });
    });

    describe("when passing a out of range mode", () => {
        it("should return enough results", () => {
            // act
            var result = generateResult(10);

            // assert
            expect(Object.keys(result).length).toBe(3);
        });
    });

    describe("when passing a valid mode", () => {
        it("should return enough results", () => {
            // act
            var result = generateResult(2);

            // assert
            expect(Object.keys(result).length).toBe(3);
        });
    });
});

describe("generateRawResultForHash", () => {
    it("should return correct format dices", () => {
        // Arrange
        const roundResult = { dice1: 1, dice2: 2, dice3: 3 };

        // Act
        const result = generateRawResultForHash(roundResult);

        // Assert
        expect(result).toBe("{2,3,4}");
    });
});