import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

//auto delete token when expired
tokenBlacklistSchema.index({
    expiresAt: 1 //1 means ascending order => 'Hey mongodb arrange tokens in ascending order in time like earliest to latest order to delete them and assign an index to everyone
}, {
    expireAfterSeconds: 0 // dont delay, delete at the time when the tokens expire
});

export default mongoose.model('TokenBlacklist', tokenBlacklistSchema);