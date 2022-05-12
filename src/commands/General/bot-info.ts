import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import { ClientUser, EmbedFieldData, MessageEmbed } from 'discord.js';
import { IBotInfo, BotInfoModel } from '@cat-models/BotInfo';
import { language } from '@cat-configs/language';
import { CatCommand } from '@cat-customs/sapphire/CatCommand';
import { color } from '@cat-configs/color';
import { catServers } from '@cat-storage/CatServer';

enum DBStatus {
	db_unreachable = 'general.db.db_unreachable',
	cannot_find_info = 'general.bot_info.cannot_find_info',
	un_synchronized = 'general.bot_info.un_synchronized'
}

@ApplyOptions<CatCommand.Options>({
	name: 'general.bot_info.name',
	aliases: ['bot_info'],
	preconditions: ['OwnerOnly'],
	requiredClientPermissions: ['SEND_MESSAGES'],
	subCommands: ['update', 'create', { input: 'show', default: true }],
	requiredUserPermissions: ['MANAGE_ROLES'],
	example: 'general.bot_info.example',
	description: 'general.bot_info.description'
})
export class UserCommand extends CatCommand {
	private static async checkDB(clientUser: ClientUser): Promise<IBotInfo | DBStatus> {
		const botInfo = await BotInfoModel.findOne({ discordId: clientUser.id });
		if (!botInfo) {
			return DBStatus.cannot_find_info;
		}
		// TODO: check if botInfo has been synchronized with clientUser
		return botInfo;
	}

	public async update(message: Message): Promise<Message | void> {
		const { client, trans } = this.container;
		const guildId = message.guildId;
		const server = catServers.get(guildId as string);
		if (server) {
			const sLng = server.lng;
			const infoChecked = await UserCommand.checkDB(client.user!);
			if (infoChecked instanceof BotInfoModel) {
				return send(message, trans('general.bot_info.already_exist', sLng));
			}
			if (infoChecked !== DBStatus.un_synchronized) {
				return send(message, trans(infoChecked, sLng));
			}
			// update in DB
		}
	}

	public async create(message: Message): Promise<Message | void> {
		const { client, trans } = this.container;
		const guildId = message.guildId;
		const server = catServers.get(guildId as string);
		if (server) {
			const sLng = server.lng;
			const infoChecked = await UserCommand.checkDB(client.user!);
			if (infoChecked instanceof BotInfoModel) {
				return send(message, trans('general.bot_info.already_exist', sLng));
			}
			if (infoChecked !== DBStatus.cannot_find_info) {
				return send(message, trans(infoChecked, sLng));
			}
			await BotInfoModel.create({
				discordId: client.user!.id,
				username: client.user!.username,
				avatar: client.user?.avatar || undefined,
				discriminator: client.user?.discriminator,
				verified: client.user?.verified,
				mfaEnabled: client.user?.mfaEnabled,
				lng: language[0]
			});
			return send(message, trans('general.bot_info.create_success', sLng));
		}
	}

	@RequiresClientPermissions('EMBED_LINKS')
	public async show(message: Message): Promise<Message | void> {
		const { client, trans } = this.container;
		const guildId = message.guildId;
		const server = catServers.get(guildId as string);
		if (server) {
			let sLng = server.lng;
			const infoChecked = await UserCommand.checkDB(client.user!);
			if (!(infoChecked instanceof BotInfoModel)) {
				return send(message, trans(infoChecked, sLng));
			}
			const { discordId, username, verified, lng } = infoChecked;
			sLng = lng;
			const fields: Array<EmbedFieldData> = [
				{ name: trans('general.bot_info.embed_id', sLng), value: discordId },
				{ name: trans('general.bot_info.embed_username', sLng), value: username, inline: true },
				{ name: trans('general.bot_info.embed_verified', sLng), value: String(verified), inline: true },
				{ name: trans('general.bot_info.embed_default_language', sLng), value: lng, inline: true }
			];
			const embed = new MessageEmbed()
				.setColor(color.primaryCorlor)
				.setTitle(trans('general.bot_info.embed_key', sLng))
				.addFields(fields)
				.setTimestamp();
			if (client.user) {
				embed
					.setThumbnail(`${client.user!.displayAvatarURL({ size: 128 })}`)
					.setAuthor(`${client.user!.username} 🟢`, String(client.user!.displayAvatarURL()))
					.setFooter(client.user!.username, client.user!.displayAvatarURL());
			}
			return send(message, { embeds: [embed] });
		}
	}
}
