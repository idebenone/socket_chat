import mongoose, { Document, Schema } from 'mongoose';

interface Message extends Document {
    user: mongoose.Types.ObjectId,
    room: string,
    message: string,
    parent: mongoose.Types.ObjectId,
    liked: boolean,
    created_at: Date,
    modified_at: Date,
}

const messageSchema = new Schema<Message>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: String, required: true },
    message: { type: String, required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    liked: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    modified_at: { type: Date, default: Date.now }
})

export default mongoose.model<Message>('Message', messageSchema);