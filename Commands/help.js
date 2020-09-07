module.exports = {
	name: "help",
	aliases: ["commands"],
	description: "Returns a list of commands and their function",
	execute(message, args, prefixUsed) {
		const commands = message.client.commands;

		const data = [];
		data.push("__**Commands list:**__");
		data.push(commands.map(command => `**${prefixUsed}${command.name}** - ${command.description}`).join("\n"));

		return message.channel.send(data, { split: true });
	},
};