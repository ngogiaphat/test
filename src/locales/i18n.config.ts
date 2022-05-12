import { preloadLanguage } from '@cat-configs/language';
import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import * as path from 'path';

i18next
	.use(
		resourcesToBackend((language: String, namespace: String, callback: Function) => {
			import(path.join(__dirname, `../../src/locales/${language}/${namespace}.json`))
				.then((resources) => {
					callback(null, resources);
				})
				.catch((error) => {
					callback(error, null);
				});
		})
	)
	.init({
		lng: 'en',
		fallbackLng: 'en',
		preload: preloadLanguage,
		initImmediate: false,
		debug: false,
		ns: ['translation', 'emoji'],
		defaultNS: 'translation'
	});
