import { Core } from "sc-game-base";
import GameSetting from "../game-settings";

const OldBetChoiceKeys = ["0", "1", "2", "3", "4", "5"];

export default class FishPrawnCrabHistoryQuery extends Core.QueryApis.HistoryQuery {
    convertBet(bet) {
        if (Object.keys(bet).some((key) => OldBetChoiceKeys.includes(key))) {
            const convertedBet = OldBetChoiceKeys.reduce((result, betChoiceKey) => {
                result[GameSetting.choices[+betChoiceKey]] = bet[betChoiceKey];

                return result;
            }, {});

            return { ...bet, ...convertedBet };
        }

        return bet;
    }
}
