import type { Message, Client, Interaction, User } from "discord.js";
import { commanderError } from "./error";
import type { Options } from "./options";

type ExecuteFunction = (client: ExtendedClient, interaction: unknown) => void;

export interface DataCommandBuilder {
	type?: 1 | 2 | 3;
	name?: string;
	description?: string;
	execute?: ExecuteFunction;
	options?: OptionsCommandBuilder[];
	// (msg | interaction)
	iso?: "msg" | "int";
}
// TODO - Improve CommandBuilder

export type ExtendedClient = {
	slashcmd?: Map<string, DataCommandBuilder>;
} & Client;

interface OptionMessages {
	integer?: string;
	string?: string;
	boolean?: string;
	user?: string;
	channel?: string;
	role?: string;
	attachment?: string;
}

export interface ConfigOptions {
	client: ExtendedClient;
	directory: string;
	prefix: string;
	no_option_message?: string;
	option_messages?: OptionMessages;
}

export interface DataSlashCommand {
	data: DataCommandBuilder;
}

export interface DataOptionMessageCommand {
	name: string;
}

export type ExtendedMessage = {
	isMsg: boolean;
	user: User;
	options: Options | [];
} & Message;

type DataOptionMessageCommandRetorned = {
	type: string;
} & DataOptionMessageCommand;

export type DataOptionMessageCommandRetornedArray =
	DataOptionMessageCommandRetorned[];

interface DataContextMenuBuilder {
	type?: 1 | 2 | 3;
	name?: string;
	execute?: ExecuteFunction;
}

interface DataMessageMenuBuilder {
	type?: 1 | 2 | 3;
	name?: string;
	execute?: ExecuteFunction;
}

export type ExtendedInteraction = {
	isMsg: boolean;
	author: User;
} & Interaction;

export enum CommandType {
	Message = 1,
	Interaction = 2,
}

type OptionTypeNumber = 3 | 4 | 5 | 6 | 7 | 8 | 11;

export const OptionTypes = {
	String: 3 as const,
	Integer: 4 as const,
	Boolean: 5 as const,
	User: 6 as const,
	Channel: 7 as const,
	Role: 8 as const,
	Attachment: 11 as const,
};

export const OptionTypesByNumber = {
	3: "String" as const,
	4: "Integer" as const,
	5: "Boolean" as const,
	6: "User" as const,
	7: "Channel" as const,
	8: "Role" as const,
	11: "Attachment" as const,
};

export interface OptionsCommandBuilder {
	name: string;
	description: string;
	type: OptionTypeNumber;
	required: boolean;
}

interface OptionCommandBuilder {
	name: string;
	description: string;
	required?: boolean;
}

export class CommandBuilder {
	data: DataCommandBuilder = {};
	setName(name: string): CommandBuilder {
		if (!name) throw new commanderError("No argument provided for 'name'");
		this.data.name = name;
		this.data.type = 1;
		return this;
	}

	setDescription(description: string): CommandBuilder {
		if (!description)
			throw new commanderError("No argument provided for 'description'");
		this.data.description = description;
		return this;
	}

	setExecute(execute: ExecuteFunction): CommandBuilder {
		if (!execute)
			throw new commanderError("No argument provided for 'execute'");
		this.data.execute = execute;
		return this;
	}

	addStringOption({
		name,
		description,
		required,
	}: OptionCommandBuilder): CommandBuilder {
		if (!name) throw new commanderError("No argument provided for 'name'");
		if (!description)
			throw new commanderError("No argument provided for 'description'");
		if (!this.data.options) this.data.options = [];
		this.data.options.push({
			name: `${name}`,
			description: `${description}`,
			type: OptionTypes.String,
			required: required ?? false,
		});
		return this;
	}

	addUserOption({
		name,
		description,
		required,
	}: OptionCommandBuilder): CommandBuilder {
		if (!name) throw new commanderError("No argument provided for 'name'");
		if (!description)
			throw new commanderError("No argument provided for 'description'");
		if (!this.data.options) this.data.options = [];
		this.data.options.push({
			name: `${name}`,
			description: `${description}`,
			type: OptionTypes.User,
			required: required ?? false,
		});
		return this;
	}

	addIntegerOption({
		name,
		description,
		required,
	}: OptionCommandBuilder): CommandBuilder {
		if (!name) throw new commanderError("No argument provided for 'name'");
		if (!description)
			throw new commanderError("No argument provided for 'description'");
		if (!this.data.options) this.data.options = [];
		this.data.options.push({
			name: `${name}`,
			description: `${description}`,
			type: OptionTypes.Integer,
			required: required ?? false,
		});
		return this;
	}

	addBooleanOption({
		name,
		description,
		required,
	}: OptionCommandBuilder): CommandBuilder {
		if (!name) throw new commanderError("No argument provided for 'name'");
		if (!description)
			throw new commanderError("No argument provided for 'description'");
		if (!this.data.options) this.data.options = [];
		this.data.options.push({
			name,
			description,
			type: OptionTypes.Boolean,
			required: required ?? false,
		});
		return this;
	}

	addChannelOption({
		name,
		description,
		required,
	}: OptionCommandBuilder): CommandBuilder {
		if (!name) throw new commanderError("No argument provided for 'name'");
		if (!description)
			throw new commanderError("No argument provided for 'description'");
		if (!this.data.options) this.data.options = [];
		this.data.options.push({
			name,
			description,
			type: OptionTypes.Channel,
			required: required ?? false,
		});
		return this;
	}

	addRoleOption({
		name,
		description,
		required,
	}: OptionCommandBuilder): CommandBuilder {
		if (!name) throw new commanderError("No argument provided for 'name'");
		if (!description)
			throw new commanderError("No argument provided for 'description'");
		if (!this.data.options) this.data.options = [];
		this.data.options.push({
			name,
			description,
			type: OptionTypes.Role,
			required: required ?? false,
		});
		return this;
	}

	addAttachmentOption({
		name,
		description,
		required,
	}: OptionCommandBuilder): CommandBuilder {
		if (!name) throw new commanderError("No argument provided for 'name'");
		if (!description)
			throw new commanderError("No argument provided for 'description'");
		if (!this.data.options) this.data.options = [];
		this.data.options.push({
			name,
			description,
			type: OptionTypes.Attachment,
			required: required ?? false,
		});
		return this;
	}

	isolate(type: CommandType): CommandBuilder {
		if (!type) throw new commanderError("No argument provided for 'type'");
		switch (type) {
			case 1:
				this.data.iso = "msg";
				break;
			case 2:
				this.data.iso = "int";
				break;
			default:
				throw new commanderError("Argument 'type' is not valid");
		}
		return this;
	}

	/** @deprecated */
	verify(): CommandBuilder {
		if (
			!this.data.options ||
			(this.data.options?.length > 1 &&
				this.data.options?.pop()?.type === OptionTypes.String)
		) {
			throw new commanderError(
				"Only one option can exist if there's one with 'joined' set to true",
			);
		}
		return this;
	}

	toJSON(): DataCommandBuilder {
		return this.data;
	}
}

export class ContextMenuBuilder {
	data: DataContextMenuBuilder = { type: 2 };
	setName(name: string): ContextMenuBuilder {
		if (!name) throw new commanderError("No argument provided for 'name'");
		this.data.name = name;
		return this;
	}

	setExecute(execute: ExecuteFunction): ContextMenuBuilder {
		if (!execute)
			throw new commanderError("No argument provided for 'execute'");
		this.data.execute = execute;
		return this;
	}

	toJSON() {
		return this.data;
	}
}

export class MessageMenuBuilder {
	data: DataMessageMenuBuilder = { type: 3 };
	setName(name: string): MessageMenuBuilder {
		if (!name) throw new Error("No argument provided for 'name'");
		this.data.name = name;
		return this;
	}

	setExecute(execute: ExecuteFunction): MessageMenuBuilder {
		if (!execute) throw new Error("No argument provided for 'execute'");
		this.data.execute = execute;
		return this;
	}

	toJSON() {
		return this.data;
	}
}
