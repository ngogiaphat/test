import { catServers } from '@cat-storage/CatServer';
import { Events, Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class MessageCreate extends Listener<typeof Events.MessageCreate> {
	public async run(message: Message) {
		if (message.content.includes('discord.gg') || message.content.includes('discord.com/invite')) {
			const { trans, client, emoji } = this.container;
			const failEmoji = client.emojis.cache.get(emoji('manager.fail'))!.toString();
			const guildId = message.guildId;
			const server = catServers.get(guildId as string);
			if (server) {
				const sLng = server.lng;
				const inviteInfo = await this.container.client.fetchInvite(message.content);
				message.guildId !== inviteInfo.guild!.id &&
					message.reply(trans('event.message_create.warning_invite_link', sLng, { author: message.author.tag, icon: failEmoji }));
			}
		}
	}
}
