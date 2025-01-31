export class commanderError extends Error {
	constructor(message: string) {
		super(message);

		this.name = "[ADVANCED-CMD ERROR]";
	}
}

export enum AdvancedErrors {
	ErrorNotOption = 369,
	ErrorOptionNotBoolean = 370,
	ErrorOptionNotUser = 371,
	ErrorOptionNotInteger = 372,
	ErrorNotGuild = 373,
	ErrorOptionNotChannel = 374,
	ErrorOptionNotRole = 375,
	ErrorOptionNotAttachment = 376,
}
