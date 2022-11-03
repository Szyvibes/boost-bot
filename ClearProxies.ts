import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('clearproxies')
        .setDescription('Clears the available proxy stock.'),
    Execute: async (_client, prisma: PrismaClient, guild, _interaction: ChatInputCommandInteraction, reply) => {
        const clearedEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Cleared Proxy Stock',
            `All proxy stock has been cleared for this server.`
        );

        const errorEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to clear proxy stock.\nTry again or report the problem to a developer.`,
            Colors.Red
        );

        prisma.proxy.deleteMany({ where: { guild_id: guild?.id } })
            .then(async () => await reply({ embeds: [clearedEmbed] }))
            .catch(async () => await reply({ embeds: [errorEmbed] }));
    },
    WhitelistRequired: true
});
