const Discord = require("discord.js");
const client = new Discord.Client();

const {
	token,
	default_prefixes,
} = require("./config.json");

const fs = require("fs");
client.commands = new Discord.Collection();
const commandCategories = fs.readdirSync("./Commands");

for (const category of commandCategories) {
	const commandFiles = fs.readdirSync(`./Commands/${category}`);
	for (const file of commandFiles) {
		const command = require(`./Commands/${category}/${file}`);
		client.commands.set(command.name, command);
	}
}

const db = require("quick.db");

client.login(token);

client.once("ready", () => {
	client.user.setPresence({
		status: "online",
		game: { name: "m!help | Made by Mariothedog#4707" },
	});

	console.log("Ready!");
});

client.on("message", async message => {
	let hasPrefix = false;
	const channelID = message.channel.id;

	const reactionChannels = db.get(`reactionChannels.${message.guild.id}`);
	if (reactionChannels && channelID in reactionChannels) {
		const emojis = reactionChannels[channelID];
		for (const emoji of emojis) {
			await message.react(emoji);
		}
	}

	if (message.author.bot) {
		return;
	}

	let prefixUsed;
	for (const prefix of default_prefixes) {
		if (message.content.startsWith(prefix)) {
			hasPrefix = true;
			prefixUsed = prefix;
			break;
		}
	}

	if (!hasPrefix) {
		return;
	}

	const args = message.content.slice(prefixUsed.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) {
		return message.reply("That command does not exist!");
	}

	if (command.nsfw && !message.channel.nsfw) {
		return message.reply("That command can only be used in an NSFW channel 😳");
	}

	const permissions = command.permissions;
	const member = message.member;
	if (permissions && !member.hasPermission("ADMINISTRATOR")) {
		for (const permission of permissions) {
			if (!member.hasPermission(permission)) {
				return message.reply(`You need the ${permissions.join(", ")} permission${permissions.length > 1 ? "s" : ""} to use the ${commandName} command!`);
			}
		}
	}

	try {
		command.execute(message, args, prefixUsed);
	}
	catch (error) {
		console.error(error);
		message.reply("There was an issue executing that command!");
	}
});