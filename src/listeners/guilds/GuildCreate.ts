import { Events, Listener, ListenerOptions, LogLevel, PieceContext } from '@sapphire/framework';
import type { Guild } from 'discord.js';
import type { Logger } from '@sapphire/plugin-logger';
import { cyan } from 'colorette';
import { ServerModel } from '@cat-models/server/Servers';

export class UserEvent extends Listener<typeof Events.GuildCreate> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			event: Events.GuildCreate
		});
	}

	public async run(guild: Guild) {
		const { logger } = this.container;
		const { id, name, shardId } = guild;
		const serverInfo = await ServerModel.findOne({ guildId: id });
		if (!serverInfo) {
			await ServerModel.create({
				guildId: id
			});
		}
		const shard = `[${cyan(String(shardId ?? 0))}]`;
		logger.debug(`${shard} - ${cyan('Guild Invited')} - ${name}[${cyan(id)}]`);
	}

	public onLoad() {
		this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
		return super.onLoad();
	}
}
