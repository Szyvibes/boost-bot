import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('clearserver')
        .setDescription('Clears all server information (proxies, whitelists, tokens).'),
    Execute: async (_client, prisma: PrismaClient, guild, _interaction: ChatInputCommandInteraction, reply) => {
        const clearedEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Cleared Server',
            `All information (including tokens, whitelists, and tokens) has been cleared.`
        );

        const errorEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to clear server.\nTry again or report the problem to a developer.`,
            Colors.Red
        );

        prisma.guild.delete({ where: { id: guild?.id } })
            .then(async () => await reply({ embeds: [clearedEmbed] }))
            .catch(async () => await reply({ embeds: [errorEmbed] }));
    },
    WhitelistRequired: true
});
