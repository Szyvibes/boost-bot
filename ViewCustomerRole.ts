import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('viewcustomerrole')
        .setDescription('Views the customer role for this server.'),
    Execute: async (_client, _prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const customerRole = interaction.guild.roles.cache.get(guild?.customer_role);

        const fetchEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Customer Role',
            `Your customer role is: **${customerRole?.name}** (id: ${customerRole?.id}).`
        );

        const noKeyEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `You have not set the customer role.`,
            Colors.Red
        );

        if (!customerRole) await reply({ embeds: [noKeyEmbed], ephemeral: true });
        else await reply({ embeds: [fetchEmbed], ephemeral: true });
    },
    WhitelistRequired: true
});
