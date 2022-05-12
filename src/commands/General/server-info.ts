import { color } from '@cat-configs/color';
import { CatCommand } from '@cat-customs/sapphire/CatCommand';
import { catServers } from '@cat-storage/CatServer';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
import { EmbedFieldData, GuildChannel, GuildMember, MessageEmbed, ThreadChannel } from 'discord.js';

// TODO: fix cant reliable on cache
@ApplyOptions<CatCommand.Options>({
	name: 'general.server_info.name',
	aliases: ['server_info'],
	runIn: ['GUILD_ANY'],
	example: 'general.server_info.example',
	description: 'general.server_info.description',
	requiredClientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES']
})
export class ServerInfoCommand extends CatCommand {
	public async run(message: Message): Promise<Message | void> {
		const { client, trans, emoji } = this.container;
		const guildId = message.guildId;
		const server = catServers.get(guildId as string);
		if (server) {
			const sLng = server.lng;
			const onlineEmoji = client.emojis.cache.get(emoji('symbols.online'))!.toString();
			const owner: GuildMember = await message!.guild!.fetchOwner();
			const fields: Array<EmbedFieldData> = [
				{ name: trans('general.server_info.embed_id', sLng), value: message!.guild!.id },
				{ name: trans('general.server_info.embed_owner', sLng), value: `${owner.user.tag} \n (${owner.user.username})`, inline: true },
				{ name: trans('general.server_info.embed_verification', sLng), value: message!.guild!.verificationLevel, inline: true },
				{
					name: trans('general.server_info.embed_channels', sLng),
					value: `${message!.guild!.channels.cache.filter((e: GuildChannel | ThreadChannel) => e?.type === 'GUILD_CATEGORY').size}`,
					inline: true
				},
				{
					name: trans('general.server_info.embed_voice_channels', sLng),
					value: `${message!.guild!.channels.cache.filter((e: GuildChannel | ThreadChannel) => e?.type === 'GUILD_VOICE').size}`,
					inline: true
				},
				{
					name: trans('general.server_info.embed_chat_channels', sLng),
					value: `${message!.guild!.channels.cache.filter((e: GuildChannel | ThreadChannel) => e?.type === 'GUILD_TEXT').size}`,
					inline: true
				},
				{ name: trans('general.server_info.embed_role', sLng), value: String(message!.guild!.roles.cache.size), inline: true },
				{
					name: trans('general.server_info.embed_members', sLng),
					value: `${onlineEmoji} ${message!.guild!.members.cache.filter((e: GuildMember) => e?.presence?.status != 'offline').size}/${
						message!.guild!.memberCount
					}`,
					inline: true
				},
				{ name: trans('general.server_info.embed_emojis', sLng), value: `${message!.guild!.emojis.cache.size}`, inline: true },
				{
					name: trans('general.server_info.embed_emojis_animate', sLng),
					value: `${message!.guild!.emojis.cache.filter((e: any) => e?.animated).size}`,
					inline: true
				}
			];

			const embed = new MessageEmbed()
				.setColor(color.primaryCorlor)
				.setTitle(trans('general.server_info.embed_title', sLng))
				.addFields(fields)
				.setFooter(client!.user!.username, client!.user!.displayAvatarURL())
				.setTimestamp();
			if (message!.guild!.iconURL()) {
				embed.setThumbnail(`${message!.guild!.iconURL({ size: 128 })}`).setAuthor(message!.guild!.name, String(message!.guild!.iconURL()));
			}
			return send(message, { embeds: [embed] });
		}
	}
}
