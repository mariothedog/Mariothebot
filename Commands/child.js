const Discord = require("discord.js");
const Canvas = require("canvas");

module.exports = {
	name: "child",
	args: true,
	usage: "<user 1> <user 2>",
	description: "Creates the child of two users",
	async execute(message, args) {
		let userOne = args[0];
		let userTwo = args[1];

		if (!userOne) {
			return message.reply("Please mention two users.");
		}

		let userOneID;
		if (userOne && !userTwo) {
			userOneID = message.author.id;

			const tempUserTwo = userTwo;
			userTwo = userOne;
			userOne = tempUserTwo;
		}
		else {
			userOneID = userOne.replace(/[\\<>@#&!]/g, "");
		}

		const userTwoID = userTwo.replace(/[\\<>@#&!]/g, "");

		let user1;
		let user2;
		try {
			user1 = await message.client.users.fetch(userOneID);
			user2 = await message.client.users.fetch(userTwoID);
		}
		catch {
			return "Please mention two users.";
		}

		if (!user1 || !user2) {
			return "Please mention two users.";
		}

		const userOneAvatar = user1.displayAvatarURL({ format: "png", size: 256 });
		const userTwoAvatar = user2.displayAvatarURL({ format: "png", size: 256 });

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