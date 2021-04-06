import { Core } from "sc-game-base";
import GameSetting from "../game-settings";

export default class FishPrawnCrabRoundQuery extends Core.QueryApis.RoundQuery {
    convertResult(round) {
        return {
            dice1: round.dice1,
            dice2: round.dice2,
            dice3: round.dice3,
        };
    }

    convertSettlementResult(round) {
        const settlementResult = {
            stag: false,
            gourd: false,
            rooster: false,
            fish: false,
            crab: false,
            prawn: false,
        };

        settlementResult[GameSetting.choices[round.dice1]] = true;
        settlementResult[GameSetting.choices[round.dice2]] = true;
        settlementResult[GameSetting.choices[round.dice3]] = true;

        return settlementResult;
    }
}
