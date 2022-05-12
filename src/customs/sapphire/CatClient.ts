import { emoji, trans } from '@cat-services/i18n';
import { container, SapphireClient } from '@sapphire/framework';

declare module '@sapphire/pieces' {
	interface Container {
		trans: Function;
		emoji: Function;
	}
}

export class CatClient extends SapphireClient {
	public i18n = () => {
		container.trans = trans;
		container.emoji = emoji;
	};
}
