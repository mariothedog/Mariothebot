module.exports = {
	name: "help",
	aliases: ["commands"],
	usage: "<optional specific command>",
	description: "Returns a list of commands and their function",
	execute(message, args, prefixUsed) {
		const commandName = args[0];
		if (commandName) {
			const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
			if (!command) {
				message.reply("That command does not exist!");

				const data = getCommandList(message.client, prefixUsed);
				return message.channel.send(data, { split: true });
			}

			const data = [];
			data.push(`__**${commandName.charAt(0).toUpperCase() + commandName.slice(1)} Command**__`);
			data.push(`**Description:** ${command.description}`);
			if (command.aliases) {
				data.push(`**Aliases:** ${command.aliases.join(", ")}`);
			}
			data.push(`**Usage:** ${prefixUsed}${commandName} ${command.usage}`);

			return message.channel.send(data, { split: true });
		}

		const data = getCommandList(message.client, prefixUsed);
		return message.channel.send(data, { split: true });
	},
};

function getCommandList(client, prefix) {
	const commands = client.commands;

	const data = [];
	data.push("__**Commands list:**__");
	data.push(commands.map(command => `**${prefix}${command.name}** - ${command.description}`).join("\n"));

	return data;
}