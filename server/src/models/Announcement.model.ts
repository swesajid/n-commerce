import { Document, model, Schema } from 'mongoose';

interface AnnouncementDocument extends Document {
    user: Schema.Types.ObjectId | string;
    name: string;
    description: string;
    publication_date: Date;
    expiration_date: Date;
    permalink: string;
    publish?: boolean;
}

const AnnouncementSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        publication_date: {
            type: Date,
            required: true,
        },
        expiration_date: {
            type: Date,
            required: true,
        },
        permalink: {
            type: String,
            required: true,
            unique: true,
        },
        publish: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Announcement = model<AnnouncementDocument>('announcements', AnnouncementSchema);

export default Announcement;