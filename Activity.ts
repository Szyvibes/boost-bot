import { ChatInputCommandInteraction, SlashCommandBuilder, ActivityType } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('activity')
        .setDescription('Sets the bot activity to specified text.')
        .addStringOption((o) => o
            .setName('activity')
            .setDescription('Put the text you want to display here.')
            .setMinLength(1)
            .setMaxLength(24)
            .setRequired(true))
        .addStringOption((o) => o
            .setName('type')
            .setDescription('The type of activity.')
            .addChoices(
                { name: 'COMPETING', value: 'Competing' },
                { name: 'LISTENING', value: 'Listening' },
                { name: 'PLAYING', value: 'Playing' },
                { name: 'STREAMING', value: 'Streaming' },
                { name: 'WATCHING', value: 'Watching' }
            ))
        .addStringOption((o) => o
            .setName('status')
            .setDescription('The status of the bot.')
            .addChoices(
                { name: 'DO NOT DISTURB', value: 'dnd' },
                { name: 'IDLE', value: 'idle' },
                { name: 'INVISIBLE', value: 'invisible' },
                { name: 'ONLINE', value: 'online' },
            )),
    Execute: async (client, _prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const options = interaction?.options;

        const activity = options.getString('activity', true);
        const type = options.getString('type');
        const status: any = options.getString('status');

        const activityEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Changed Activity',
            `The activity has been changed to **${activity}**.`
        );

        client.user.setPresence({ activities: [{ name: activity, type: ActivityType[type] ?? ActivityType.Watching }], status: status ?? 'idle' });

        await reply({ embeds: [activityEmbed], ephemeral: true });
    },
    AdministratorRequired: true
});
