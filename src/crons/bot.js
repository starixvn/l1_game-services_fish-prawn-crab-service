import { Core } from "sc-game-base";
import { userInfos } from "sc-base-database";

export default class Bot extends Core.Crons.BaseBot {
    constructor(definition, gameData, userInfosRepository) {
        super(definition, gameData, userInfosRepository);

        this.mainOpts = ["stag", "gourd", "rooster", "fish", "crab", "prawn"];

        this.smallTicketRatio = 70;
        this.smallTickets = 0;
        this.resetAllBets();
    }

    async reset() {
        await super.reset();

        const configs = this.gameData.gameConfigs;

        if (configs?.botenabled) {
            const bots = await userInfos.find({ type: true, disabled: false }, "id name").lean().exec();

            this.bots = this.chance.shuffle(bots).slice(0, this.maxNumberOfBots);
        } else {
            this.bots = [];
        }
    }

    async placeBet(bot) {
        const choice = this.getBetChoice(bot);
        const minBet = this.getMinBet();
        const maxBet = this.getMaxBet(bot, choice);
        const betAmount = this.getBetAmount(minBet, maxBet);

        if (this.gameData.remainingTime > this.definition.durations.lockingBet) {
            this.gameData.totalBets[choice] = (this.gameData.totalBets[choice] ?? 0) + betAmount;
            this.allBets[choice] = (this.allBets[choice] ?? 0) + betAmount;
            this.totalTickets++;

            if (this.isSmallTicket(betAmount)) {
                this.smallTickets++;
            }
        }
    }

    async resetAllBotData() {
        await super.resetAllBotData();
        this.resetAllBets();
    }

    resetAllBets() {
        this.allBets = {
            stag: 0,
            gourd: 0,
            rooster: 0,
            fish: 0,
            crab: 0,
            prawn: 0,
        };

        this.smallTickets = 0;
    }

    getBetAmount(minBet, maxBet) {
        return this.chance.integer({ min: minBet, max: maxBet });
    }

    getBetChoice(bot) {
        return this.getRandomChoiceFromGroup(this.mainOpts);
    }

    getMaxBet(bot, choice) {
        const gameConfigs = this.gameData.gameConfigs;
        const minBet = this.getMinBet();
        const maxBetPerChoice = gameConfigs.choices_maxbet[choice];
        const botMaxBet = gameConfigs.bot_maxbet;
        let maxBet = Math.min(maxBetPerChoice, botMaxBet);

        if (this.mainOpts.includes(choice)) {
            const isSmallTicket = this.totalTickets === 0 ? true : (this.smallTickets * 100) / this.totalTickets < this.smallTicketRatio;
            const maxBetOfSmallTicket = Math.min(minBet * 50, botMaxBet * 0.1, maxBetPerChoice);
            maxBet = isSmallTicket ? maxBetOfSmallTicket : maxBet;
        }

        return Math.max(maxBet, minBet);
    }

    getRandomChoiceFromGroup(group) {
        const randomIndex = (Math.random() * group.length) >> 0;
        return group[randomIndex];
    }

    getTotalAmountOnChoiceGroup(choices) {
        let total = 0;
        choices.forEach((choice) => (total += this.allBets[choice]));

        return total;
    }

    getTotalAmountOfBotOnChoiceGroup(bot, choices) {
        let total = 0;
        choices.forEach((choice) => (total += bot.betOnChoices[choice]));

        return total;
    }

    getAllBetAmount() {
        let total = 0;
        this.definition.choices.forEach((choice) => (total += this.allBets[choice]));

        return total;
    }

    isSmallTicket(amount) {
        return amount <= this.getMinBet() * 50;
    }
}
