import { REST } from '@discordjs/rest';
import { Client, Routes } from 'discord.js';

import { Commands } from '../Commands';
import Event from '../Interfaces/Event';

import Config from '../Config';

const rest = new REST({ version: '10' }).setToken(Config.Bot?.Token);

export const Event: Event = ({
    Name: 'ready',
    Execute: async (client: Client) => {
        if (!(client.user || client.application)) return;

        await rest.put(Routes.applicationCommands(client.user.id), { body: Commands.map((c) => c.Command) });

        console.log(`${client.user?.tag} is ready.`);
    }
});