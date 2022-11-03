import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('addpaymentoption')
        .setDescription('Add a payment option for this server.')
        .addStringOption((o) => o
            .setName('name')
            .setDescription('Name of the payment option (e.g. PayPal, CashApp).')
            .setRequired(true))
        .addStringOption((o) => o
            .setName('value')
            .setDescription('Value of the payment option (e.g. $Cashapp_Username or paypal_email@gmail.com).')
            .setRequired(true)),
    Execute: async (_client, prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const options = interaction?.options;
        const name = options.getString('name', true);
        const value = options.getString('value', true);

        const noName = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            'Invalid name provided.',
            Colors.Red
        );

        const noValue = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            'Invalid value provided.',
            Colors.Red
        );

        if (!name) return await reply({ embeds: [noName], ephemeral: true });
        if (!value) return await reply({ embeds: [noValue], ephemeral: true });

        const addedPaymentEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Added Payment Option',
            `Added the **${name}** payment option.`
        );

        const paymentExistsEmbed = Embed(
            guild?.embed_config,
            '⚠️ ・ Payment Option Exists',
            `Cannot add the **${name}** payment option as it already exists.`,
            Colors.Orange
        );

        if (guild?.payment_options?.find((p) => p.name === name)) return await reply({ embeds: [paymentExistsEmbed] });

        const errorEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to add the **${name}** payment option.\nTry again or report the problem to a developer.`,
            Colors.Red
        );

        prisma.paymentOption.create({ data: { name, value, guild_id: guild?.id } })
            .then(async () => await reply({ embeds: [addedPaymentEmbed] }))
            .catch(async () => await reply({ embeds: [errorEmbed] }));
    },
    WhitelistRequired: true
});
