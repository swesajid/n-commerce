import { Schema, Document, model } from 'mongoose';
import { USER_ROLE } from '../types/index';

interface UserDocument extends Document {
    name: string;
    email: string;
    username: string;
    password: string;
    passwordreset: boolean;
    // active: boolean;
    active: string;
    role: USER_ROLE;
}

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        passwordreset: {
            type: Boolean,
            default: 0,
        },
        // active: {
        //     type: Boolean,
        //     required: true,
        //     default: false,
        // },
        active: {
            type: String,
            required: true,
            default: "Active"
        },
        role: {
            type: String,
            default: 'member',
            // required: true,
            // roles available to this proj: admin, member
        },
    },
    { timestamps: { createdAt: 'created_at' } }
);

const User = model<UserDocument>('users', UserSchema);
export default User;
