import { Schema, model } from 'mongoose';

export interface IBotInfo {
	discordId: string;
	username: string;
	avatar?: string;
	discriminator?: string;
	verified?: boolean;
	mfaEnabled?: boolean;
	lng: string;
}

const BotInfoSchema = new Schema<IBotInfo>(
	{
		discordId: { type: String, required: true },
		username: { type: String, required: true },
		avatar: String,
		discriminator: String,
		verified: Boolean,
		mfaEnabled: Boolean,
		lng: String
	},
	{
		timestamps: true
	}
);

export const BotInfoModel = model<IBotInfo>('BotInfo', BotInfoSchema, 'BotInfo');
