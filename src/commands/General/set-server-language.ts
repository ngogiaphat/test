import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';
import { catServers } from '@cat-storage/CatServer';
import { language } from '@cat-configs/language';
import { CatCommand } from '@cat-customs/sapphire/CatCommand';
import type { Args } from '@sapphire/framework';
import { ServerModel } from '@cat-models/server/Servers';


@ApplyOptions<CatCommand.Options>({
	name: 'general.set_server_lng.name',
	aliases: ['set_server_language', 'ssl'],
	runIn: ['GUILD_ANY'],
	requiredClientPermissions: ['SEND_MESSAGES'],
	requiredUserPermissions: ['ADMINISTRATOR'],
	preconditions: ['ServerCreated'],
	example: 'general.set_server_lng.example',
	description: 'general.set_server_lng.description'
})
export class SetServerLanguageCommand extends CatCommand {
	public async run(message: Message, args: Args): Promise<Message | void> {
		const { trans, client, emoji } = this.container;
		const guildId = message.guildId;
		let server = catServers.get(guildId as string);
		if (server) {
			let sLng = server.lng;
			const failEmoji = client.emojis.cache.get(emoji('manager.fail'))!.toString();
			const successEmoji = client.emojis.cache.get(emoji('manager.success'))!.toString();
			const curLng = await (await args.rest('string')).toLowerCase();
			if (!language.includes(curLng)) {
				return message.channel.send(
					trans('general.set_server_lng.no_support_lng', sLng, { botName: client!.user!.username, icon: failEmoji })
				);
			}
			const serverInfo = await server.getServerInfo(guildId as string);
			if (serverInfo) {
				await this.setLng(guildId as string, curLng);
				server.lng = curLng;
				catServers.set(guildId as string, server);
				sLng = curLng;
				return message.channel.send(trans('general.set_server_lng.success', sLng, { lng: sLng, icon: successEmoji }));
			}
		}
	}

	private async setLng(guildId: string, lng: string): Promise<void> {
		await ServerModel.updateOne({ guildId }, { $set: { lng: lng } });
	}
}
