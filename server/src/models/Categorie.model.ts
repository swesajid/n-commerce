import { Document, model, Schema } from 'mongoose';

interface CategorieDocument extends Document {
    user: Schema.Types.ObjectId | string;
    name: string;
    description: string;
    
}

const CategorieSchema = new Schema(
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
    },
    { timestamps: true }
);

const Categorie = model<CategorieDocument>('categories', CategorieSchema);

export default Categorie;
