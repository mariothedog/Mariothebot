const Discord = require("discord.js");
const Canvas = require("canvas");
const util = require("../../util.js");

const size = 256;

module.exports = {
	name: "child",
	usage: "<user 1> <user 2>",
	description: "Creates the child of two users",
	async execute(message, args) {
		let userOne;
		let userTwo;

		if (args.length == 0) {
			return message.reply("Please mention two users!");
		}

		const mentions = message.mentions.users.array();
		userOne = mentions[0];

		if (!userOne) {
			userOne = await util.getUserOrDefault(message.guild, args[0], null, false);

			if (!userOne) {
				return message.reply("Please mention a valid user!");
			}
		}

		if (args.length > 1) {
			userTwo = mentions[1];

			if (!userTwo) {
				userTwo = await util.getUserOrDefault(message.guild, args[1], null, false);
			}
		}

		if (userOne && !userTwo) {
			const tempUserOne = userOne;
			userOne = message.author;
			userTwo = tempUserOne;
		}

		const userOneAvatar = userOne.displayAvatarURL({ format: "png", size: size });
		const userTwoAvatar = userTwo.displayAvatarURL({ format: "png", size: size });

		const canvas = Canvas.createCanvas(size, size);
		const ctx = canvas.getContext("2d");

		const background = await Canvas.loadImage(userOneAvatar);
		ctx.drawImage(background, 0, 0, size, size);

		const avatar = await Canvas.loadImage(userTwoAvatar);

		ctx.beginPath();
		ctx.moveTo(size / 2, 0);
		ctx.lineTo(size, 0);
		ctx.lineTo(size, size);
		ctx.lineTo(size / 2, size);
		ctx.closePath();
		ctx.clip();

		ctx.drawImage(avatar, 0, 0, size, size);

		const attachment = new Discord.MessageAttachment(canvas.toBuffer());
		return message.reply(attachment);
	},
};