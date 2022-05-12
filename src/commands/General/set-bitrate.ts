import { CatCommand } from '@cat-customs/sapphire/CatCommand';
import { catServers } from '@cat-storage/CatServer';
import { ApplyOptions } from '@sapphire/decorators';
import type { Args } from '@sapphire/framework';
import { Message, StageChannel, VoiceChannel } from 'discord.js';

@ApplyOptions<CatCommand.Options>({
	name: 'general.set_bitrate.name',
	example: 'general.set_bitrate.example',
	aliases: ['set_bitrate', 'vcbitrate'],
	description: 'general.set_bitrate.description',
	requiredUserPermissions: ['MANAGE_CHANNELS']
})
export class SetBitRateCommand extends CatCommand {
	public async run(message: Message, args: Args): Promise<Message | void> {
		const { trans, emoji, client } = this.container;
		const failEmoji = client.emojis.cache.get(emoji('manager.fail'))!.toString();
		const successEmoji = client.emojis.cache.get(emoji('manager.success'))!.toString();
		const sLng = catServers.get(message.guildId as string)!.lng;
		const minBitrate = 8;
		const maxBitrate: number = 128 * Number(message!.guild!.premiumTier) || 96;
		const bitrate = await args.rest('number');
		const channel: VoiceChannel | StageChannel | null = message.member!.voice.channel;

		if (!channel) {
			return message.channel.send(
				trans('common.voice.not_joined', sLng, {
					username: message.author.tag,
					icon: failEmoji
				})
			);
		}

		if (bitrate < minBitrate || bitrate > maxBitrate) {
			return message.channel.send(
				trans('general.set_bitrate.illegal', sLng, {
					username: message.author.username,
					min_bitrate: minBitrate,
					max_bitrate: maxBitrate,
					icon: failEmoji
				})
			);
		}

		if (channel instanceof VoiceChannel) {
			await channel.setBitrate(bitrate * 1000);
			await message.react(successEmoji);
			return;
		}
	}
}
