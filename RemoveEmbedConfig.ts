import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('removeembedconfig')
        .setDescription('Removes the embed configuration for this server.'),
    Execute: async (_client, prisma: PrismaClient, guild, _interaction: ChatInputCommandInteraction, reply) => {
        const removedEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Embed Config Removed',
            'Removed the embed configuration for this server.'
        );

        const noConfigEmbed = Embed(
            guild?.embed_config,
            '⚠️ ・ Error Occurred',
            'There is no embed configuration for this server.',
            Colors.Orange
        );

        const failedToRemoveEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            'Failed to remove the embed config.',
            Colors.Red
        );

        if (!guild?.embed_config) return await reply({ embeds: [noConfigEmbed], ephemeral: true });

        prisma.embedConfig.delete({ where: { guild_id: guild?.id } })
            .then(async () => await reply({ embeds: [removedEmbed], ephemeral: true }))
            .catch(async () => await reply({ embeds: [failedToRemoveEmbed], ephemeral: true }));
    },
    AdministratorRequired: true
});
