import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },

    stag: { type: Number, default: 0 },
    gourd: { type: Number, default: 0 },
    rooster: { type: Number, default: 0 },
    fish: { type: Number, default: 0 },
    crab: { type: Number, default: 0 },
    prawn: { type: Number, default: 0 },

    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    siteId: { type: String },
    freeBet: { type: Boolean, default: false },

    currency: { type: String, required: true },
    rate: { type: Number, required: true },

    playerId: { type: Number },
    operatorId: { type: String, required: true },
    roundId: { type: Number, required: true },
    paid: { type: Boolean, default: false },
});

export default mongoose.model("BauCua_cuoc", schema);
