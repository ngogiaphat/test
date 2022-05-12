import type { Args } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import { catServers } from '@cat-storage/CatServer';
import { CatCommand } from '@cat-customs/sapphire/CatCommand';
import { ServerModel } from '@cat-models/server/Servers';
@ApplyOptions<CatCommand.Options>({
	name: 'general.prefix.name',
	aliases: ['prefix'],
	runIn: ['GUILD_ANY'],
	requiredClientPermissions: ['SEND_MESSAGES'],
	requiredUserPermissions: ['ADMINISTRATOR'],
	subCommands: ['add', 'remove', { input: 'list', default: true }],
	preconditions: ['ServerCreated'],
	example: 'general.prefix.example',
	description: 'general.prefix.description'
})
export class PrefixCommand extends CatCommand {
	public async list(message: Message): Promise<Message | void> {
		const { trans } = this.container;
		const guildId = message.guildId;
		const server = catServers.get(guildId as string);
		if (server) {
			return message.channel.send(trans('general.prefix.list_prefixes', server.lng, { prefixes: server.prefixes.join(' | ') }));
		}
	}

	public async add(message: Message, args: Args): Promise<Message | void> {
		const { trans, client, emoji } = this.container;
		const guildId = message.guildId;
		const server = catServers.get(guildId as string);
		if (server) {
			const sLng = server.lng;
			const prefixes = server.prefixes;
			const failEmoji = client.emojis.cache.get(emoji('manager.fail'))!.toString();
			const successEmoji = client.emojis.cache.get(emoji('manager.success'))!.toString();
			const prefix = await args.rest('string');
			if (prefixes.includes(prefix))
				return message.channel.send(trans('general.prefix.duplicate_prefix', sLng, { prefix: prefix, icon: failEmoji }));
			const serverInfo = await server.getServerInfo(guildId as string);
			if (serverInfo) {
				serverInfo.prefixes.push(prefix);
				await this.updatePrefix(guildId as string, serverInfo.prefixes);
				return message.channel.send(trans('general.prefix.add', sLng, { prefix: prefix, icon: successEmoji }));
			}
		}
	}

	public async remove(message: Message, args: Args): Promise<Message | void> {
		const { trans, emoji, client } = this.container;
		const guildId = message.guildId;
		const server = catServers.get(guildId as string);
		if (server) {
			const prefixes = server.prefixes;
			const sLng = server.lng;
			const failEmoji = client.emojis.cache.get(emoji('manager.fail'))!.toString();
			const successEmoji = client.emojis.cache.get(emoji('manager.success'))!.toString();
			const prefix = await args.rest('string');
			if (!prefixes.includes(prefix))
				return message.channel.send(trans('general.prefix.not_found_prefix', sLng, { prefix: prefix, icon: failEmoji }));
			if (prefixes.length === 1) return message.channel.send(trans('general.prefix.can_not_remove', sLng, { prefix: prefix, icon: failEmoji }));
			const serverInfo = await server.getServerInfo(guildId as string);
			if (serverInfo) {
				serverInfo.prefixes.splice(serverInfo.prefixes.indexOf(prefix), 1);
				server.prefixes = serverInfo.prefixes;
				serverInfo && (await this.updatePrefix(guildId as string, serverInfo.prefixes));
				return message.channel.send(trans('general.prefix.remove', sLng, { prefix: prefix, icon: successEmoji }));
			}
		}
	}

	public async updatePrefix(guildId: string, prefixes: string[]): Promise<void> {
		await ServerModel.updateOne({ guildId }, { $set: { prefixes } });
	}
}
