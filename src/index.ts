const moduleAlias = require('module-alias');

moduleAlias.addAliases({
	'@cat-lib': __dirname + '/lib/',
	'@cat-commands': __dirname + '/commands/',
	'@cat-customs': __dirname + '/customs/',
	'@cat-utils': __dirname + '/utils/',
	'@cat-models': __dirname + '/models/',
	'@cat-modules': __dirname + '/modules/',
	'@cat-services': __dirname + '/services/',
	'@cat-scripts': __dirname + '/scripts/',
	'@cat-configs': __dirname + '/configs/',
	'@cat-storage': __dirname + '/storage/'
});
import './lib/setup';
import { LogLevel } from '@sapphire/framework';
import { CatClient } from '@cat-customs/sapphire/CatClient';
import './locales/i18n.config';
import { CatServer, catServers } from '@cat-storage/CatServer';
import { ServerModel } from '@cat-models/server/Servers';
import '@cat-models/db';

const client = new CatClient({
	defaultPrefix: process.env.PREFIX,
	fetchPrefix: (message) => {
		return catServers.get(message.guildId as string)?.prefixes || ['?'];
	},
	regexPrefix: /^(hey +)?bot[,! ]/i,
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
	},
	shards: 'auto',
	intents: [
		'GUILDS',
		'GUILD_MEMBERS',
		'GUILD_BANS',
		'GUILD_EMOJIS_AND_STICKERS',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'DIRECT_MESSAGES',
		'DIRECT_MESSAGE_REACTIONS'
	]
});

const main = async () => {
	try {
		client.i18n();
		client.logger.info('Logging in');
		await client.login();
		client.logger.info(`logged in as ${client!.user!.username}`);
		const countServer = await ServerModel.countDocuments({});
		for (let i = 0; i < Math.ceil(countServer / 1000); i++) {
			const serversInfo = await ServerModel.find({
				skip: 1000 * i,
				take: 1000
			}).lean();
			serversInfo.forEach((server) => catServers.set(server.guildId as string, new CatServer(server.guildId, server.lng, server.prefixes)));
		}
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();
