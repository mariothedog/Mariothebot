const Discord = require("discord.js");
const Canvas = require("canvas");
const util = require("../../util.js");

module.exports = {
	name: "thonk",
	aliases: ["think", "thonkify"],
	usage: "<user>",
	description: "Thonkifies the user specified",
	async execute(message, args) {
		const mention = message.mentions.members.first();
		let user;
		if (mention) {
			user = mention.user;
		}
		else if (args.length > 0) {
			user = await util.getUserOrDefault(message.guild, args[0], message.author, false);
		}
		else {
			user = message.author;
		}

		const userAvatar = user.displayAvatarURL({ format: "png", size: 256 });

		const canvas = Canvas.createCanvas(256, 256);
		const ctx = canvas.getContext("2d");

		const background = await Canvas.loadImage(userAvatar);

		ctx.save();

		ctx.beginPath();
		ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(background, 0, 0, 256, 256);

		ctx.restore();
		const think_hand = await Canvas.loadImage("Images/think_hand.png");
		ctx.drawImage(think_hand, 0, 0, 256, 256);

		const attachment = new Discord.MessageAttachment(canvas.toBuffer());
		message.reply(attachment);
		return true;
	},
};