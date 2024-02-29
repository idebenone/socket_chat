import mongoose, { Document, Schema } from 'mongoose';
import User from './User';

interface Conversations extends Document {
    participants: mongoose.Types.ObjectId[] | string[]
    lastMessage: mongoose.Types.ObjectId | string;
}

const conversatioSchema = new Schema<Conversations>({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true })

export default mongoose.model<Conversations>('Conversations', conversatioSchema);