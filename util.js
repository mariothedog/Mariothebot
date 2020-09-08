module.exports = {
	async getUserOrDefault(guild, name, defaultUser, caseSensitive) {
		let member;
		if (caseSensitive) {
			member = await guild.members.cache.find(m =>
				m.user.username === name ||
				(m.nickname && m.nickname === name));
		}
		else {
			member = await guild.members.cache.find(m =>
				m.user.username.toLowerCase() === name.toLowerCase() ||
				(m.nickname && m.nickname.toLowerCase() === name.toLowerCase()));
		}

		if (member) {
			return member.user;
		}

		return defaultUser;
	},
};