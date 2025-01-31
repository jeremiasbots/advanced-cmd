import fs from "node:fs";
import { Options } from "./options";
import {
	OptionTypes,
	type ExtendedClient,
	type ConfigOptions,
	OptionTypesByNumber,
	type DataOptionMessageCommandRetornedArray,
	type DataOptionMessageCommand,
	type ExtendedMessage,
	type ExtendedInteraction,
	type DataSlashCommand,
	type DataCommandBuilder,
} from "./classes.js";
import { reload } from "../core/core";
import path from "node:path";

export async function ConfigAdvancedCMD({
	client,
	directory,
	prefix,
	no_option_message,
	option_messages,
}: ConfigOptions) {
	client.slashcmd = new Map();
	const slashCarpet = fs.readdirSync(path.join(process.cwd(), directory));
	for (let i = 0; i < slashCarpet.length; i++) {
		const slashFiles = fs
			.readdirSync(path.join(process.cwd(), directory, slashCarpet[i]))
			.filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
		for (let f = 0; f < slashFiles.length; f++) {
			const slash: DataSlashCommand = (
				await import(
					path.join(process.cwd(), directory, slashCarpet[i], slashFiles[f])
				)
			).default;
			if (slash.data?.name === undefined) return;
			client.slashcmd?.set(slash.data.name, slash.data);
		}
	}
	client.on("interactionCreate", async (interaction) => {
		if (
			interaction.isChatInputCommand() ||
			interaction.isContextMenuCommand() ||
			interaction.isMessageContextMenuCommand()
		) {
			if (!interaction.guild) return;
			if (!client.slashcmd) return;
			const cmds = client.slashcmd.get(interaction.commandName);
			if (!cmds) return;
			if (cmds.iso === "msg") return;

			try {
				(interaction as ExtendedInteraction).isMsg = false;
				(interaction as ExtendedInteraction).author = interaction.user;
				if (!cmds.execute) return;
				await cmds.execute(client, interaction);
			} catch (error) {
				console.error(error);
			}
		}
	});
	client.on("messageCreate", async (message) => {
		if (!message.content.startsWith(prefix)) return;
		if (message.author.bot || !message.guild) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift()?.toLowerCase();

		if (!client.slashcmd || !command) return;
		const cmd = client.slashcmd.get(command);
		if (!cmd) return;

		if (cmd) {
			if (cmd.iso === "int") return;
			if (cmd.type !== 1) return;
			const requiredOptions: DataOptionMessageCommandRetornedArray = [];
			const usersOptions: DataOptionMessageCommand[] = [];
			const channelsOptions: DataOptionMessageCommand[] = [];
			const rolesOptions: DataOptionMessageCommand[] = [];
			const integersOptions: DataOptionMessageCommand[] = [];
			const booleanOptions: DataOptionMessageCommand[] = [];
			(message as ExtendedMessage).isMsg = true; // Set the interaction type to message
			(message as ExtendedMessage).user = message.author; // Set the user property to author property
			if (cmd.options !== null && cmd.options !== undefined) {
				cmd.options.map((option) => {
					if (option.required && typeof no_option_message === "string") {
						if (option.type === OptionTypes.Attachment) {
							const attachmentsArray = message.attachments.toJSON();
							const index = cmd.options
								?.filter((c) => c.type === 11)
								.indexOf(option);
							if (!index) return undefined;
							const file = attachmentsArray[index];
							if (file === undefined)
								requiredOptions.push({
									name: option.name,
									type: OptionTypesByNumber[option.type],
								});
							return undefined;
						}
						const indexOption = cmd.options
							?.filter((x) => x.type !== OptionTypes.Attachment)
							.indexOf(option);
						if (indexOption === undefined) return undefined;

						if (args[indexOption] === undefined)
							requiredOptions.push({
								name: option.name,
								type: OptionTypesByNumber[option.type],
							});
					}
					if (
						option.type === OptionTypes.Boolean &&
						typeof option_messages?.boolean === "string"
					) {
						const indexBooleanOption = cmd.options
							?.filter((x) => x.type !== OptionTypes.Attachment)
							.indexOf(option);
						if (indexBooleanOption === undefined) return undefined;

						if (args[indexBooleanOption] === undefined) return undefined;

						const condition = ["true", "false"].some((element) =>
							args[indexBooleanOption].includes(element),
						);
						if (!condition) booleanOptions.push({ name: option.name });
					}

					if (
						option.type === OptionTypes.Integer &&
						typeof option_messages?.integer === "string"
					) {
						const indexIntegerOption = cmd.options
							?.filter((x) => x.type !== OptionTypes.Attachment)
							.indexOf(option);
						if (indexIntegerOption === undefined) return undefined;

						if (args[indexIntegerOption] === undefined) return undefined;

						if (
							Number.isNaN(Number.parseInt(args[indexIntegerOption])) ||
							!Number.isInteger(Number(args[indexIntegerOption]))
						)
							return integersOptions.push({ name: option.name });
					}

					if (
						option.type === OptionTypes.User &&
						typeof option_messages?.user === "string"
					) {
						const indexOptionUser = cmd.options
							?.filter((x) => x.type !== OptionTypes.Attachment)
							.indexOf(option);
						if (indexOptionUser === undefined) return undefined;

						if (args[indexOptionUser] === undefined) return undefined;

						if (message.guild === null) return undefined;
						const user = message.guild.members.cache.get(
							args[indexOptionUser].slice(2, -1),
						);

						if (user === undefined) usersOptions.push({ name: option.name });
					}

					if (
						option.type === OptionTypes.Channel &&
						typeof option_messages?.channel === "string"
					) {
						const indexOptionChannel = cmd.options
							?.filter((x) => x.type !== OptionTypes.Attachment)
							.indexOf(option);
						if (indexOptionChannel === undefined) return undefined;

						if (args[indexOptionChannel] === undefined) return undefined;

						if (message.guild === null) return undefined;
						const channel = message.guild.channels.cache.get(
							args[indexOptionChannel].slice(2, -1),
						);

						if (channel === undefined)
							channelsOptions.push({ name: option.name });
					}
					if (
						option.type === OptionTypes.Role &&
						typeof option_messages?.role === "string"
					) {
						const indexOptionRole = cmd.options
							?.filter((x) => x.type !== OptionTypes.Attachment)
							.indexOf(option);
						if (indexOptionRole === undefined) return undefined;

						if (args[indexOptionRole] === undefined) return undefined;

						if (message.guild === null) return undefined;
						const role = message.guild.roles.cache.get(
							args[indexOptionRole].slice(3, -1),
						);

						if (role === undefined) rolesOptions.push({ name: option.name });
					}
				});
				(message as ExtendedMessage).options = new Options(
					client,
					message,
					args,
					cmd.options,
				); // Set the options property to a new Options class
			} else {
				(message as ExtendedMessage).options = []; // If the command has no options, set the options property to an empty array
			}
			if (requiredOptions.length !== 0) {
				const returnOptionText = requiredOptions
					.map((y) => `\`${y.name}: ${y.type}\``)
					.join("\n");
				if (no_option_message === undefined) return;
				await message.reply(
					no_option_message.replace("{options}", returnOptionText),
				);
				return;
			}
			if (booleanOptions.length !== 0) {
				const booleanOptionText = booleanOptions
					.map((y) => `\`${y.name}\``)
					.join("\n");
				if (option_messages?.boolean === undefined) return;
				await message.reply(
					option_messages.boolean.replace("{options}", booleanOptionText),
				);
				return;
			}
			if (integersOptions.length !== 0) {
				const integerOptionText = integersOptions
					.map((y) => `\`${y.name}\``)
					.join("\n");
				if (option_messages?.integer === undefined) return;
				await message.reply(
					option_messages.integer.replace("{options}", integerOptionText),
				);
				return;
			}
			if (usersOptions.length !== 0) {
				const usersOptionText = usersOptions
					.map((y) => `\`${y.name}\``)
					.join("\n");
				if (option_messages?.user === undefined) return;
				await message.reply(
					option_messages.user.replace("{options}", usersOptionText),
				);
				return;
			}
			if (channelsOptions.length !== 0) {
				const channelsOptionText = channelsOptions
					.map((y) => `\`${y.name}\``)
					.join("\n");
				if (option_messages?.channel === undefined) return;
				await message.reply(
					option_messages?.channel?.replace("{options}", channelsOptionText),
				);
				return;
			}
			if (rolesOptions.length !== 0) {
				const roleOptionText = rolesOptions
					.map((y) => `\`${y.name}\``)
					.join("\n");
				if (option_messages?.role === undefined) return;
				await message.reply(
					option_messages.role.replace("{options}", roleOptionText),
				);
				return;
			}

			if (cmd.execute === undefined) return;
			cmd.execute(client, message); // Execute the command
		}
	});
}

/**
 * Clone a Map
 * @param originalMap Original map
 * @returns The cloned map
 */
function cloneMap<T, E>(originalMap: Map<T, E>): Map<T, E> {
	const newMap = new Map();
	originalMap.forEach((valor, clave) => {
		newMap.set(clave, valor);
	});
	return newMap;
}

/**
 * Reload the slash commands of the bot
 * @param client The discord.js client of the bot
 * @returns true if the commands were reloaded successfully
 */
export async function ReloadCommands(client: ExtendedClient): Promise<boolean> {
	// biome-ignore lint/suspicious/noAsyncPromiseExecutor:
	return await new Promise(async (resolve, reject) => {
		if (!client.slashcmd) {
			reject(new Error("Commands not found"));
			return;
		}
		const commands = cloneMap(client.slashcmd);
		if (!commands) {
			reject(new Error("Commands not found"));
			return;
		}
		const newCommandsArray: DataCommandBuilder[] = [];
		const commandsArray = Array.from(commands.values());
		for (const simpleCommand of commandsArray) {
			simpleCommand.execute = undefined;
			if (simpleCommand.iso !== "msg") {
				newCommandsArray.push(simpleCommand);
			}
		}
		for (let i = 0; i < newCommandsArray.length; i++) {
			const reloadData = await reload(client, newCommandsArray[i]);
			if (reloadData?.status !== 200) {
				const json = await reloadData?.json();
				reject(json);
			}
		}
		resolve(true);
	});
}
