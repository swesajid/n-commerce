import { Document, model, Schema } from 'mongoose';

interface TagDocument extends Document {
    user: Schema.Types.ObjectId | string;
    name: string;
    description: string;
    slug: string;
}

const TagSchema = new Schema(
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
        description: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Tag = model<TagDocument>('tags', TagSchema);

export default Tag;
