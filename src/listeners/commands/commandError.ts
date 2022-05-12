import { catServers } from '@cat-storage/CatServer';
import { CommandErrorPayload, Events, Listener } from '@sapphire/framework';

export class CommandError extends Listener<typeof Events.CommandError> {
	public async run(error: Error, payload: CommandErrorPayload) {
		const { message } = payload;
		const { logger, trans, emoji, client } = this.container;
		const server = catServers.get(message.guildId as string);
		if (server) {
			const failEmoji = client.emojis.cache.get(emoji('manager.fail'))!.toString();
			message.channel.send(trans('event.global_error', server.lng, { icon: failEmoji, author: message.author.username }));
		}
		// if (typeof error === 'string') {
		// }
		// if (error instanceof ArgumentError) {
		// }
		// if (error instanceof UserError) {
		// }
		// if (error.name === 'AbortError' || error.message === 'Internal Server Error') {
		// 	logger.warn(`${this.getWarnError(message)} (${message.author.id}) | ${error.constructor.name}`);
		// }
		// if (error instanceof DiscordAPIError || error instanceof HTTPError)
		// else logger.warn(`${this.getWarnError(message)} (${message.author.id}) | ${error.constructor.name}`);
		return logger.fatal(`[ERROR] ${error.stack || error.message}`);
	}
}
