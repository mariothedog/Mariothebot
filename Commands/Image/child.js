const Discord = require("discord.js");
const Canvas = require("canvas");
const util = require("../../util.js");

module.exports = {
	name: "child",
	usage: "<user 1> <user 2>",
	description: "Creates the child of two users",
	async execute(message, args) {
		let userOne;
		let userTwo;

		if (args.length == 0) {
			return message.reply("please mention two users!");
		}

		const mentions = message.mentions.users.array();
		userOne = mentions[0];

		if (!userOne) {
			userOne = await util.getUserOrDefault(message.guild, args[0], null, false);

			if (!userOne) {
				return message.reply("please mention a valid user!");
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

		const userOneAvatar = userOne.displayAvatarURL({ format: "png", size: 256 });
		const userTwoAvatar = userTwo.displayAvatarURL({ format: "png", size: 256 });

		const canvas = Canvas.createCanvas(256, 256);
		const ctx = canvas.getContext("2d");

		let background;
		try {
			background = await Canvas.loadImage(userOneAvatar);
		}
		catch (err) {
			return "Please mention two users.";
		}

		ctx.drawImage(background, 0, 0, 256, 256);

		let avatar;
		try {
			avatar = await Canvas.loadImage(userTwoAvatar);
		}
		catch (err) {
			return "Please mention two users.";
		}

		ctx.beginPath();
		ctx.moveTo(128, 0);
		ctx.lineTo(256, 0);
		ctx.lineTo(256, 256);
		ctx.lineTo(128, 256);
		ctx.closePath();
		ctx.clip();

		ctx.drawImage(avatar, 0, 0, 256, 256);

		const attachment = new Discord.MessageAttachment(canvas.toBuffer());
		return message.reply(attachment);
	},
};