import type { IServer } from '@cat-models/server/Servers';
import { language } from '@cat-configs/language';
import { ServerModel } from '@cat-models/server/Servers';

export class CatServer {
	public guildId: string;
	public lng: string = language[0];
	public prefixes: string[] = [process.env.PREFIX || '?'];

	constructor(guildId: string, lng: string, prefixes: string[]) {
		this.guildId = guildId;
		this.lng = lng;
		this.prefixes = prefixes;
	}

	public async getServerInfo(guildId: string): Promise<IServer | null> {
		const serverInfo = await ServerModel.findOne({ guildId }).lean();
		this.lng = serverInfo!.lng;
		this.prefixes = serverInfo!.prefixes;
		return serverInfo;
	}
}

export const catServers = new Map<string, CatServer>();
