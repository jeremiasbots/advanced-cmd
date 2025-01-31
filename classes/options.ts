import type {
	Attachment,
	Client,
	GuildBasedChannel,
	GuildMember,
	Message,
	Role,
	User,
} from "discord.js";
import { AdvancedErrors, commanderError } from "./error";

type OptionsCommandBuilder = {
	name: string;
	description: string;
	type: number;
	required: boolean;
	joined?: boolean;
};

export type AdvancedError = number;

export class Options {
	// Opt => Options, Msg => Message, Args => Arguments, Client => Client
	constructor(
		private client: Client,
		private msg: Message,
		private args: Array<string>,
		private opt: Array<OptionsCommandBuilder>,
	) {}
	getBoolean(name: string): AdvancedError | boolean {
		if (name === undefined)
			throw new commanderError("No argument provided for 'name'");
		const name_option = this.opt.find((b) => b.name === name && b.type === 5);
		if (name_option === undefined)
			throw new commanderError("No boolean option found with that name");

		const option_object = this.opt.indexOf(name_option);

		const message_content = this.args[option_object];

		const type = {
			true: true,
			false: false,
		};

		if (message_content === undefined) return AdvancedErrors.ErrorNotOption;

		const message_content_type = type[message_content as "true" | "false"];

		if (message_content_type === undefined)
			return AdvancedErrors.ErrorOptionNotBoolean;

		return message_content_type;
	}
	getString(name: string): AdvancedError | string {
		if (name === undefined)
			throw new commanderError("No argument provided for 'name'");
		const filter_option_string = this.opt.find(
			(s) => s.name === name && s.type === 3,
		);
		if (filter_option_string === undefined)
			throw new commanderError("No string option found with that name");

		const string_option_index = this.opt.indexOf(filter_option_string);
		let content = this.args[string_option_index];

		if (content === undefined) return AdvancedErrors.ErrorNotOption;

		if (filter_option_string === this.opt.pop())
			content = this.args.slice(string_option_index).join(" ");

		return content;
	}
	getUser(name: string): AdvancedError | User {
		const filter_option_user = this.opt.find(
			(u) => u.name === name && u.type === 6,
		);
		if (filter_option_user === undefined)
			throw new commanderError("No user option found with that name");

		const index_option_user = this.opt.indexOf(filter_option_user);
		const content = this.args[index_option_user].slice(2, -1);
		if (content === undefined) return AdvancedErrors.ErrorNotOption;

		const user = this.client.users.resolve(content);
		if (user === null) return AdvancedErrors.ErrorOptionNotUser;

		return user;
	}
	getInteger(name: string): AdvancedError | number {
		const filter_option_integer = this.opt.find(
			(i) => i.name === name && i.type === 4,
		);
		if (filter_option_integer === undefined)
			throw new commanderError("No integer option found with that name");

		const index_option_integer = this.opt.indexOf(filter_option_integer);

		const integer = this.args[index_option_integer];

		if (integer === undefined) return AdvancedErrors.ErrorNotOption;

		if (Number.isNaN(Number.parseInt(integer)))
			return AdvancedErrors.ErrorOptionNotInteger;

		return Number(integer);
	}
	getChannel(name: string): AdvancedError | GuildBasedChannel {
		const filter_option_channel = this.opt.find(
			(c) => c.name === name && c.type === 7,
		);
		if (filter_option_channel === undefined)
			throw new commanderError("No channel option found with that name");

		const index_option_channel = this.opt.indexOf(filter_option_channel);

		if (this.msg.guild === null) return AdvancedErrors.ErrorNotGuild;
		const channel_string = this.args[index_option_channel];
		if (channel_string === undefined) return AdvancedErrors.ErrorNotOption;
		const channel = this.msg.guild.channels.cache.get(
			channel_string.slice(2, -1),
		);
		if (channel === undefined) return AdvancedErrors.ErrorOptionNotChannel;

		return channel;
	}
	getRole(name: string): AdvancedError | Role {
		const filter_option_role = this.opt.find(
			(c) => c.name === name && c.type === 8,
		);
		if (!filter_option_role)
			throw new commanderError("No role option found with that name");
		const index_option_role = this.opt.indexOf(filter_option_role);

		const role_string = this.args[index_option_role];
		if (!role_string) return AdvancedErrors.ErrorNotOption;
		if (!this.msg.guild) return AdvancedErrors.ErrorNotGuild;
		const role = this.msg.guild.roles.cache.get(role_string.slice(3, -1));

		if (!role) return AdvancedErrors.ErrorOptionNotRole;

		return role;
	}
	getAttachment(name: string): AdvancedError | Attachment {
		const filter_option_attachment = this.opt.find(
			(c) => c.name === name && c.type === 11,
		);
		if (!filter_option_attachment)
			throw new commanderError("No attachment option found with that name");

		const attachments_array = this.msg.attachments.toJSON();
		const index = this.opt
			.filter((c) => c.type === 11)
			.indexOf(filter_option_attachment);
		const file = attachments_array[index];
		if (!file) return AdvancedErrors.ErrorOptionNotAttachment;

		return file;
	}
	getMember(name: string): AdvancedError | GuildMember {
		const filter_member_option = this.opt.find(
			(u) => u.name === name && u.type === 6,
		);
		if (!filter_member_option)
			throw new commanderError("No member option found with that name");

		const index_option_member = this.opt.indexOf(filter_member_option);
		const content = this.args[index_option_member].slice(2, -1);
		if (content === undefined) return AdvancedErrors.ErrorNotOption;
		if (this.msg.guild === null) return AdvancedErrors.ErrorNotGuild;
		const member = this.msg.guild.members.cache.get(content);
		if (member === undefined) return AdvancedErrors.ErrorOptionNotUser;

		return member;
	}
}
