import type { DataCommandBuilder, ExtendedClient } from "../classes/classes";

export async function reload(
	client: ExtendedClient,
	data: DataCommandBuilder,
): Promise<Response | undefined> {
	if (!client.user) return;
	const request = await fetch(
		`https://discord.com/api/v10/applications/${client.user.id}/commands`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bot ${client.token}`,
			},
			body: JSON.stringify(data),
		},
	);
	return request;
}
