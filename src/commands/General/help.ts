import { color } from '@cat-configs/color';
import { CatCommand } from '@cat-customs/sapphire/CatCommand';
import { catServers } from '@cat-storage/CatServer';
import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { EmbedFieldData, Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CatCommand.Options>({
	name: 'general.help.name',
	runIn: ['GUILD_ANY'],
	aliases: ['help'],
	description: 'general.help.description',
	example: 'general.help.example',
	requiredUserPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
})
export class HelpCommand extends CatCommand {
	public async run(message: Message, args: Args): Promise<Message | void> {
		const { client, trans, emoji } = this.container;
		const guildId = message.guildId;
		const prefix = client.options.defaultPrefix;
		const server = catServers.get(guildId as string);
		if (server) {
			const sLng = server.lng;
			const failEmoji = client.emojis.cache.get(emoji('manager.fail'))!.toString();
			const commandsMap = client.stores.get('commands');
			const categories = commandsMap.categories;
			const catCommands: CatCommands[] = [];
			commandsMap.forEach(
				(command: any) => !command.hidden && catCommands.push({ category: `${command.category}`, name: `${command.aliases[0]}` })
			);
			try {
				const commandName = await args.rest('string');
				const commandDetails: any = client.stores.get('commands').get(commandName);
				if (!commandDetails)
					return message.channel.send(trans('general.help.not_have_command', sLng, { botName: client!.user!.username, icon: failEmoji }));
				if (commandDetails.hidden)
					return message.channel.send(
						trans('general.help.not_have_permission', sLng, { username: message.author.username, icon: failEmoji })
					);
				this.commandDetails(message, commandDetails);
			} catch {
				const fields: EmbedFieldData[] = [];
				categories.forEach((category) => {
					const catCommandsByCategory: string[] = [];
					catCommands.filter((command) => command.category === category).forEach((command) => catCommandsByCategory.push(command.name));
					fields.push({
						name: category,
						value: `\`${catCommandsByCategory.join('` `')}\``,
						inline: false
					});
				});
				const embed = new MessageEmbed()
					.setColor(color.primaryCorlor)
					.addFields(fields)
					.setDescription(trans('general.help.embed_list', sLng, { botName: client!.user!.username, prefix: prefix }));
				if (message.author.avatarURL()) {
					embed.setAuthor(message.author.username, String(message.author.avatarURL()));
				}
				return message.channel.send({ embeds: [embed] });
			}
		}
	}
	public async commandDetails(message: Message, commandDetails: CatCommand): Promise<Message | void> {
		const { trans } = this.container;
		const guildId = message.guildId;
		const server = catServers.get(guildId as string);
		if (server) {
			const sLng = server.lng;
			const prefix = server.prefixes[0];
			const fields: EmbedFieldData[] = [
				{
					name: trans('general.help.embed_aliases', sLng),
					value: commandDetails.aliases.length ? `\`${commandDetails.aliases.join('` `')}\`` : `${commandDetails.name}`
				},
				{
					name: trans('general.help.embed_description', sLng),
					value: trans(commandDetails.description || 'N/A', sLng)
				},
				{
					name: trans('general.help.embed_example', sLng),
					value: trans(commandDetails.example || 'N/A', sLng, { prefix: prefix, alias: commandDetails.aliases[0] })
				}
			];
			const embed = new MessageEmbed().setColor(color.primaryCorlor).addFields(fields).setTitle(trans(commandDetails.name, sLng));
			if (message!.author!.avatarURL()) {
				embed.setAuthor(message!.author!.username, String(message!.author!.avatarURL()));
			}
			return message.channel.send({ embeds: [embed] });
		}
	}
}
interface CatCommands {
	category: string;
	name: string;
}
