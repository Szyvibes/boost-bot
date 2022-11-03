import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('viewembedconfig')
        .setDescription('Views the embed configuration for this server.'),
    Execute: async (_client, _prisma: PrismaClient, guild, _interaction: ChatInputCommandInteraction, reply) => {
        const viewEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Embed Config ',
            `The embed configuration for this server is:\n\n${Object.entries(guild?.embed_config).filter(([k, v]) => v && !['id', 'guild_id'].includes(k)).map(([key, value]) => `**${key}**: \`\`${value}\`\``).join('\n')}`
        );

        const noConfigEmbed = Embed(
            guild?.embed_config,
            '⚠️ ・ Error Occurred',
            'There is no embed configuration for this server.',
            Colors.Orange
        );

        if (!guild?.embed_config) return await reply({ embeds: [noConfigEmbed], ephemeral: true });
        else return await reply({ embeds: [viewEmbed], ephemeral: true });
    },
    AdministratorRequired: true
});
