const { API } = require("nhentai-api");
const api = new API();

module.exports = {
	name: "tags",
	aliases: ["get-tags"],
	usage: "<nhentai code>",
	description: "Returns a list of a specified nhentai doujin's tags",
	nsfw: true,
	async execute(message, args) {
		const code = args[0];

		let doujin;
		try {
			doujin = await api.getBook(code);
		}
		catch (error) {
			return message.reply("Please specify a valid nhentai code!");
		}

		const tags = [];
		for (const tag of doujin.tags) {
			tags.push(tag.name);
		}

		return message.reply(`The tags for ${code} are: ||${tags.join(", ")}||`);
	},
};