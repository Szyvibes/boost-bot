import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('removecustomerrole')
        .setDescription('Removes the customer role for this server.'),
    Execute: async (_client, prisma: PrismaClient, guild, _interaction: ChatInputCommandInteraction, reply) => {
        const removeEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Customer Role Removed',
            `Removed the customer role.`
        );

        const failedToRemoveEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to remove the customer role.`,
            Colors.Red
        );

        prisma.guild.update({ where: { id: guild?.id }, data: { customer_role: '' } })
            .then(async () => await reply({ embeds: [removeEmbed], ephemeral: true }))
            .catch(async () => await reply({ embeds: [failedToRemoveEmbed], ephemeral: true }));
    },
    WhitelistRequired: true
});
