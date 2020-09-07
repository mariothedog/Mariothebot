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

		const newList = db.get(`reactionChannels.${message.guild.id}`).filter(function(value) {
			return value != channelID;
		});
		db.set(`reactionChannels.${message.guild.id}`, newList);

		return message.reply("The reaction channel has been removed.");
	},
};