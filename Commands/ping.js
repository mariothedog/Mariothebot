module.exports = {
	name: "ping",
	description: "Ping Command",
	execute(message) {
		message.channel.send("Pinging...").then(msg => {
			msg.edit(`Pong with a latency of ${msg.createdTimestamp - message.createdTimestamp}ms!`);
		});
	},
};