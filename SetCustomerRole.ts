import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('setcustomerrole')
        .setDescription('Sets the customer role for this server (gives user role when vouch command is ran).')
        .addRoleOption((o) => o
            .setName('customer_role')
            .setDescription('The customer role to give the user when vouch command is ran.')
            .setRequired(true)),
    Execute: async (_client, prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const options = interaction?.options;
        const customerRole = options.getRole('customer_role', true);

        const noCustomerRole = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            'Invalid Customer Role provided.',
            Colors.Red
        );

        if (!noCustomerRole) return await reply({ embeds: [noCustomerRole], ephemeral: true });

        const setEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Customer Role Set',
            `Set the customer role to **${customerRole.name}** (id: ${customerRole.id}).`
        );

        const failedToSetEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to set the customer role to **${customerRole.name}** (id: ${customerRole.id}).`,
            Colors.Red
        );

        prisma.guild.update({ where: { id: guild?.id }, data: { customer_role: customerRole?.id } })
            .then(async () => await reply({ embeds: [setEmbed], ephemeral: true }))
            .catch(async () => await reply({ embeds: [failedToSetEmbed], ephemeral: true }));
    },
    WhitelistRequired: true
});
