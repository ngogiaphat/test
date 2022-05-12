import { catServers } from '@cat-storage/CatServer';
import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { envParseArray } from '../lib/env-parser';

const OWNERS = envParseArray('OWNERS');

export class OwnerOnlyPrecondition extends Precondition {
	public async run(message: Message) {
		const { client, trans, emoji } = this.container;
		const sLng = catServers.get(message.guildId as string)?.lng;
		const failEmoji = client.emojis.cache.get(emoji('manager.fail'))?.toString();
		return OWNERS.includes(message.author.id) ? this.ok() : this.error({ message: trans('precondition.owner_only', sLng, {
			icon: failEmoji, 
			author: message.author.tag
		}) });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		OwnerOnly: never;
	}
}
