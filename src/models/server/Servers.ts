import {Schema, model} from 'mongoose';

export interface IServer {
    guildId: string;
    lng: string;
    prefixes: string[];
}

const serverSchema = new Schema<IServer>(
    {
        guildId: { type: String, required: true },
        lng: String,
        prefixes: [String],
    },
    {
        timestamps: true
    }
);

export const ServerModel = model<IServer>("Servers", serverSchema, "Servers");
