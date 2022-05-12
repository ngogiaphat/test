import { connection, connect } from 'mongoose';
import { cyan, magenta } from 'colorette';
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

let dbUrl = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

if (DB_USER !== '' && DB_PASSWORD !== '' && DB_USER && DB_PASSWORD) {
	dbUrl = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

(async () => {
	try {
		await connect(dbUrl);
	} catch (error) {
		const status = `${magenta('Failed to connect')} on port ${magenta(DB_PORT!)}`;
		const errorString = JSON.parse(JSON.stringify(error));
		console.log(`[${cyan('MongoDB')}] - ${magenta(DB_NAME!)} - ${status} -`, errorString);
		return;
	}
})();

connection.on('error', (error) => {
	const status = `${magenta('Failed to connect')} on port ${magenta(DB_PORT!)}`;
	const errorString = JSON.parse(JSON.stringify(error));
	console.log(`[${cyan('MongoDB')}] - ${magenta(DB_NAME!)} - ${status} -`, errorString);
});

connection.on('connected', () => {
	console.log(`[${cyan('MongoDB')}] - Connected[${cyan(DB_NAME!)}] on port[${cyan(DB_PORT!)}]`);
});
