const db = require("quick.db");

module.exports = {
	name: "add-reaction-channel",
	usage: "<channel>",
	permissions: ["MANAGE_CHANNELS"],
	description: "Makes the specified channel a reaction channel which means every message will automatically have a reaction added to it",
	async execute(message, args) {
		let channelID = args[0];
		if (!channelID) {
			channelID = message.channel.id;
		}

		channelID = channelID.replace(/[\\<>@#&!]/g, "");

		db.push(`reactionChannels.${message.guild.id}`, channelID);

		return message.reply("The reaction channel has been added.");
	},
};