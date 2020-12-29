const db = require("quick.db");

module.exports = {
	name: "add-reaction-channel",
	usage: "<channel> <emoji 1> <emoji 2..>",
	permissions: ["MANAGE_CHANNELS"],
	description: "Makes the specified channel a reaction channel which means every message will automatically have a reaction added to it",
	async execute(message, args) {
		if (args.length == 0) {
			return false;
		}

		let channelID = args[0];

		channelID = channelID.replace(/[\\<>@#&!]/g, "");

		let emojiSpliceIndex = 1;
		if (!message.guild.channels.cache.find(c => c.id == channelID)) {
			channelID = message.channel.id;
			emojiSpliceIndex = 0;
		}

		const emojiArgs = args.splice(emojiSpliceIndex);
		const emojis = [];
		const invalidEmojis = [];
		for (const emojiArg of emojiArgs) {
			if (isEmoji(emojiArg)) {
				emojis.push(emojiArg);
				continue;
			}

			const emoji = message.client.emojis.cache.get(emojiArg);
			if (emoji) {
				emojis.push(emoji);
			}
			else {
				invalidEmojis.push(emojiArg);
			}
		}

		if (invalidEmojis.length > 0) {
			return message.reply(`${invalidEmojis.join(", ")} ${invalidEmojis.length == 1 ? "is" : "are"} invalid!`);
		}

		const dbPath = `reactionChannels.${message.guild.id}`;
		let dbReactionChannels = db.get(dbPath);
		if (!dbReactionChannels) {
			dbReactionChannels = {};
		}

		dbReactionChannels[channelID] = emojis;
		db.set(dbPath, dbReactionChannels);

		return message.reply(`The reaction channel has been added with the following emojis: ${emojis.join(", ")}`);
	},
};

function isEmoji(str) {
	const ranges = [
		"(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])",
		// U+1F680 to U+1F6FF
	];
	if (str.match(ranges.join("|"))) {
		return true;
	}
	else {
		return false;
	}
}