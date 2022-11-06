import { Schema, Document, model } from 'mongoose';

interface EmailDocument extends Document {
    user: Schema.Types.ObjectId | string;
    name: string;
    subject: string;
    description: string;
}

const EmailSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        subject: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Email = model<EmailDocument>('emails', EmailSchema);
export default Email;
