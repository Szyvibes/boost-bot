import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('removepaymentoption')
        .setDescription('Remove a payment option from this server.')
        .addStringOption((o) => o
            .setName('name')
            .setDescription('Name of the payment option (e.g. PayPal, CashApp).')
            .setRequired(true)),
    Execute: async (_client, prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const options = interaction?.options;
        const name = options.getString('name', true);

        const noName = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            'Invalid name provided.',
            Colors.Red
        );

        if (!name) return await reply({ embeds: [noName], ephemeral: true });

        const removedPaymentEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Removed Payment Option',
            `Removed the **${name}** payment option.`
        );

        const paymentDoesntExistsEmbed = Embed(
            guild?.embed_config,
            '⚠️ ・ Payment Option Does Not Exist',
            `Cannot remove the **${name}** payment option as it does not exist.`,
            Colors.Orange
        );

        if (!guild?.payment_options?.find((p) => p.name === name)) return await reply({ embeds: [paymentDoesntExistsEmbed] });

        const errorEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to add the **${name}** payment option.\nTry again or report the problem to a developer.`,
            Colors.Red
        );

        prisma.paymentOption.deleteMany({ where: { name: { equals: name, mode: 'insensitive' }, guild_id: guild?.id } })
            .then(async () => await reply({ embeds: [removedPaymentEmbed] }))
            .catch(async () => await reply({ embeds: [errorEmbed] }));
    },
    WhitelistRequired: true
});
