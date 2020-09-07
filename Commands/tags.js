const nHentaiAPI = require("nhentai-api-js");
const api = new nHentaiAPI();

module.exports = {
	name: "tags",
	aliases: ["get-tags"],
	usage: "<nhentai code>",
	description: "Returns a list of a specified nhentai doujin's tags",
	nsfw: true,
	async execute(message, args) {
		return message.reply("This command is currently broken 😭 Blame the nHentai JS API!");

		const code = args[0];

		let doujin;
		try {
			doujin = await api.g(parseInt(code));
		}
		catch (error) {
			return message.reply("Please specify a valid nhentai code!");
		}

		const tags = [];
		for (const tag of doujin.tags) {
			tags.push(tag["name"]);
		}

		return message.reply(`The tags for ${code} are: ||${tags.join(", ")}||`);
	},
};