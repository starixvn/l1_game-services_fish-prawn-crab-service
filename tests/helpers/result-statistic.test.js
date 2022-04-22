import { generateResult } from "../../src/helpers/result-helper";
import { randomModes } from "../../src/helpers/dice-random";
import constants from "../../src/constants";

describe("Result statistic: 100000 times", () => {
    Object.keys(randomModes).forEach((mode) => {
        it(`should generate results statistically correct with mode ${mode}`, () => {
              // Arrange
              let statisticResult = {
                stag: 0,
                gourd: 0,
                rooster: 0,
                fish: 0,
                crab: 0,
                prawn: 0
            };

            const totalRounds = 10000;

            // Act
            for (let i = 0; i < totalRounds; i++) {
                const result = generateResult(1);
                Object.values(result).forEach(value => {
                    const {resultMapper} =constants;
                    switch (value) {
                        case resultMapper.stag:
                            statisticResult.stag++;
                            break;
                        case resultMapper.gourd:
                            statisticResult.gourd++;
                            break;
                        case resultMapper.rooster:
                            statisticResult.rooster++;
                            break;
                        case resultMapper.fish:
                            statisticResult.fish++;
                            break;
                        case resultMapper.crab:
                            statisticResult.crab++;
                            break;
                        default:
                            statisticResult.prawn++;
                            break;
                    }
                });
            }

            // Assert
            let totalPercent = 0;
            let total = 0;

            const resultPercentage = Object.keys(statisticResult).reduce((percentage, key) => {
                percentage[key] = +parseFloat((statisticResult[key] / totalRounds / 3) * 100).toFixed(2);

                totalPercent += percentage[key];
                total += statisticResult[key];

                return percentage;
            }, {});

            console.log(
                `total: ${total}, totalPercent: ${totalPercent}, countResult: ${JSON.stringify(statisticResult)}, percentageResult: ${JSON.stringify(resultPercentage)}`
            );

            expect(resultPercentage.stag).toBeGreaterThanOrEqual(16);
            expect(resultPercentage.gourd).toBeGreaterThanOrEqual(16);
            expect(resultPercentage.rooster).toBeGreaterThanOrEqual(16);
            expect(resultPercentage.fish).toBeGreaterThanOrEqual(16);
            expect(resultPercentage.crab).toBeGreaterThanOrEqual(16);
            expect(resultPercentage.prawn).toBeGreaterThanOrEqual(16);
        });
    });
});
