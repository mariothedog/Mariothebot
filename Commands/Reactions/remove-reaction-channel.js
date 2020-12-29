const db = require("quick.db");

module.exports = {
	name: "remove-reaction-channel",
	usage: "<channel>",
	permissions: ["MANAGE_CHANNELS"],
	description: "Removes the specified channel from the list of reaction channels",
	async execute(message, args) {
		let channelID = args[0];
		if (!channelID) {
			channelID = message.channel.id;
		}

		channelID = channelID.replace(/[\\<>@#&!]/g, "");

		const dbPath = `reactionChannels.${message.guild.id}`;
		const dbReactionChannels = db.get(dbPath);
		if (!(channelID in dbReactionChannels)) {
			return message.reply("No reaction channel found!");
		}

		delete dbReactionChannels[channelID];
		db.set(dbPath, dbReactionChannels);

		return message.reply("The reaction channel has been removed.");
	},
};