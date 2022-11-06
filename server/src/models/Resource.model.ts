import { Document, model, Schema } from 'mongoose';

interface ResourceDocument extends Document {
    user: Schema.Types.ObjectId | string;
    name: string;
    description: string;
    tag: string;
    additionalTags: string;
    resource_files: string[];
    featured_image: string;
    videolink: string;
    videofile: string;
    permalink: string;
    publish?: boolean;
}

const ResourceSchema = new Schema(
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
        tag: {
            type: String,
            required: true
        },
        additionalTags: {
            type: [String],
            default: [],
            required: false,
        },
        resource_files: {
            type: Array,
            default: [],
        },
        featured_image: {
            type: String,
            required: false,
        },
        videolink: {
            type: String,
            default: "",
        },
        videofile: {
            type: String,
            default: "",
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

const Resource = model<ResourceDocument>('resources', ResourceSchema);

export default Resource;
