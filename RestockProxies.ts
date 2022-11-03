import { ChatInputCommandInteraction, SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';
import Command from '../../Interfaces/Command';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('restockproxies')
        .setDescription('Allows for you to add proxy stock.'),
    Execute: async (_client, _prisma: PrismaClient, _guild, interaction: ChatInputCommandInteraction) => {
        const restockModal = new ModalBuilder()
            .setCustomId('restock_proxies')
            .setTitle('Restock Guild');

        const restockInput: TextInputBuilder = new TextInputBuilder()
            .setCustomId(`restock_proxies`)
            .setLabel('PROXIES (FORMAT: IP:PORT:USER:PASS)')
            .setStyle(TextInputStyle.Paragraph)

        const restockActionRow: any = new ActionRowBuilder()
            .addComponents(restockInput);

        restockModal.addComponents(restockActionRow);

        await interaction.showModal(restockModal).catch();
    },
    WhitelistRequired: true,
    DoNotDefer: true
});
