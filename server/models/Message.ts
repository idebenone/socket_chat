import mongoose, { Document, Schema } from 'mongoose';

interface Message extends Document {
    participants: [
        {
            user: mongoose.Types.ObjectId,
            role: 'sender' | 'receiver'
        }
    ],
    room: string,
    message: string,
    parent: string,
    liked: boolean,
    created_at: Date,
    modified_at: Date,
}

const messageSchema = new Schema<Message>({
    participants: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            role: { type: String, enum: ['sender', 'receiver'], required: true },
        },
    ],
    room: { type: String, required: true },
    message: { type: String, required: true },
    parent: { type: String },
    liked: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    modified_at: { type: Date, default: Date.now }
})

export default mongoose.model<Message>('Message', messageSchema);