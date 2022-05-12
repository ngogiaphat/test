import { catServers } from '@cat-storage/CatServer';
import { Events, Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class UserEvent extends Listener<typeof Events.MentionPrefixOnly> {
	public async run(message: Message): Promise<Message | void> {
		const { trans } = this.container;
		const guildId = message.guildId;
		const server = catServers.get(message.guildId as string);
		if (server) {
			(!server.lng || !server.prefixes) && (await server.getServerInfo(guildId as string));
			const sLng = server.lng;
			const prefixes = server.prefixes;
			return message.channel.send(trans('event.mention_prefix', sLng, { prefixes: prefixes.join(' | ') }));
		}
	}
}
