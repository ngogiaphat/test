import { CatCommand } from '@cat-customs/sapphire/CatCommand';
import { catServers } from '@cat-storage/CatServer';
import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { Message, VoiceChannel } from 'discord.js';

@ApplyOptions<CatCommand.Options>({
	name: 'general.change_region.name',
	example: 'general.change_region.example',
	aliases: ['change_region', 'vcregion'],
	description: 'general.change_region.description',
	requiredUserPermissions: ['MANAGE_CHANNELS']
})
export class ChangeRegionCommand extends CatCommand {
	public async run(message: Message, args: Args) {
		const { trans, client, emoji } = this.container;
		const channel = message.member!.voice.channel;
		const server = catServers.get(message.guildId as string);
		if (server) {
			const sLng = server.lng;
			const failEmoji = client.emojis.cache.get(emoji('manager.fail'))!.toString();
			const successEmoji = client.emojis.cache.get(emoji('manager.success'))!.toString();
			const regions = await client.fetchVoiceRegions();
			const region = await (await args.rest('string')).toLowerCase();

			if (region === 'list') {
				return message.channel.send(`\`${regions.map((region) => region.name).join('`, `')}\``);
			}

			if (!channel) {
				return message.channel.send(
					trans('common.voice.not_joined', sLng, {
						username: message.author.username,
						icon: failEmoji
					})
				);
			}

			if (!regions.get(region as string)) {
				return message.channel.send(
					trans('general.change_region.illegal', sLng, {
						prefix: server.prefixes[0],
						username: message.author.username,
						icon: failEmoji
					})
				);
			}

			if (channel instanceof VoiceChannel) {
				await channel.setRTCRegion(region);
				await message.react(successEmoji);
			}
		}
		return;
	}
}
