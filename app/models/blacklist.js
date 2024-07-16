import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: '7d' // This will automatically remove the document after 7 days
        }
    }
);

// module.exports = mongoose.model("Blacklist", blacklistSchema);

const Blacklist = mongoose.models["Blacklist"] || mongoose.model('Blacklist', blacklistSchema);
export default Blacklist;