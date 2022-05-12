import i18next from 'i18next';

const trans = (key: string, lng = null, opts = null) => {
	let options: any = {
		lng: lng,
		ns: null
	};
	if (opts) {
		var objArr = Object.entries(opts).map(([key, value]) => ({ key, value }));
		objArr.forEach((val) => {
			options[val.key] = val.value;
		});
	}
	let content = i18next.t(key, options);
	return content;
};

const emoji = (key: string) => {
	let options = {
		lng: 'cat',
		ns: 'emoji'
	};
	let content = i18next.t(key, options);
	return content;
};

export { trans, emoji };
