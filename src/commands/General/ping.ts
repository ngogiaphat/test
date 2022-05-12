import { CatCommand } from '@cat-customs/sapphire/CatCommand';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';
@ApplyOptions<CatCommand.Options>({
	name: 'general.ping.name',
	example: 'general.ping.example',
	aliases: ['ping'],
	description: 'general.ping.description',
	hidden: true
})
export class PingCommand extends CatCommand {
	public async run(message: Message) {
		// throw new Error
		const msg = await send(message, 'Ping?');

		const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
			(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)
		}ms.`;

		return send(message, content);
	}
}
