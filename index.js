const Discord = require("discord.js");
const client = new Discord.Client();

const {
	token,
	default_prefixes,
} = require("./config.json");

const fs = require("fs");
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./Commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./Commands/${file}`);
	client.commands.set(command.name, command);
}

client.login(token);

client.once("ready", () => {
	console.log("Ready!");
});

client.on("message", message => {
	let hasPrefix = false;

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

	if (!client.commands.has(commandName)) {
		return message.reply("That command does not exist!");
	}

	const command = client.commands.get(commandName);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply("There was an issue executing that command!");
	}
});