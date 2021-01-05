const db = require("quick.db");
const util = require("../../util.js");

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
		const emojis = emojiArgs.join("");

		const emojisValidRaw = util.removeDuplicates(emojis.match(util.PATTERN_EMOJI));
		const emojisValid = emojisValidRaw.map(e => e.replace(/[:<>a-zA-Z]/g, ""));

		if (emojisValid.length > 20) {
			message.reply("Messages cannot have more than 20 reactions!");
			return true;
		}

		const dbPath = `reactionChannels.${message.guild.id}`;
		const dbReactionChannels = db.get(dbPath) || {};
		dbReactionChannels[channelID] = emojisValid;
		db.set(dbPath, dbReactionChannels);

		message.reply(`The reaction channel has been added with the following emojis: ${emojisValidRaw.join(", ")}`);
		return true;
	},
};