import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('clearpaymentoptions')
        .setDescription('Clears the server payment options.'),
    Execute: async (_client, prisma: PrismaClient, guild, _interaction: ChatInputCommandInteraction, reply) => {
        const clearedEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Cleared Payment Options',
            `All payment options have been cleared for this server.`
        );

        const errorEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to clear payment options.\nTry again or report the problem to a developer.`,
            Colors.Red
        );

        prisma.paymentOption.deleteMany({ where: { guild_id: guild?.id } })
            .then(async () => await reply({ embeds: [clearedEmbed] }))
            .catch(async () => await reply({ embeds: [errorEmbed] }));
    },
    WhitelistRequired: true
});
