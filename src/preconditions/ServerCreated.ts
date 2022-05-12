import { ServerModel } from '@cat-models/server/Servers';
import { catServers } from '@cat-storage/CatServer';
import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class ServerCreatedPrecondition extends Precondition {
	public async run(message: Message) {
		const { logger, client, trans, emoji } = this.container;
		try {
			if (message.guildId) {
				let condition = {};
				if (message.guildId) {
					condition = { guildId: message.guildId };
				}
				let serverInfo = await ServerModel.findOne(condition).lean();
				if (!serverInfo) {
					await ServerModel.create({
						guildId: message.guildId
					});
				}
			}
			return this.ok();
		} catch (error) {
			logger.error(logger);
			const guildId = message.guildId;
			const server = catServers.get(guildId as string);
			const sLng = server!.lng;
			const failEmoji = client.emojis.cache.get(emoji('manager.fail'))?.toString();
			return this.error({
				message: trans('precondition.server_created.error', sLng, {
					icon: failEmoji,
					author: message.author.tag
				})
			});
		}
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		ServerCreated: never;
	}
}
