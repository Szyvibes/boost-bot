import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('clearwhitelists')
        .setDescription('Clears the current whitelists.'),
    Execute: async (_client, prisma: PrismaClient, guild, _interaction: ChatInputCommandInteraction, reply) => {
        const clearedEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Cleared Whitelists',
            `All whitelists has been cleared for this server.`
        );

        const errorEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to clear whitelists.\nTry again or report the problem to a developer.`,
            Colors.Red
        );

        prisma.whitelistedUser.deleteMany({ where: { guild_id: guild?.id } })
            .then(async () => await reply({ embeds: [clearedEmbed] }))
            .catch(async () => await reply({ embeds: [errorEmbed] }));
    },
    WhitelistRequired: true
});
