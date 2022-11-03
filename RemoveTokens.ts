import { ChatInputCommandInteraction, SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';
import Command from '../../Interfaces/Command';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('removetokens')
        .setDescription('Allows for you to remove token stock.'),
    Execute: async (_client, _prisma: PrismaClient, _guild, interaction: ChatInputCommandInteraction) => {
        const restockModal = new ModalBuilder()
            .setCustomId('remove_tokens')
            .setTitle('Remove Stock');

        const restockInput: TextInputBuilder = new TextInputBuilder()
            .setCustomId(`remove_tokens`)
            .setLabel('TOKENS (FORMAT: TOKEN)')
            .setStyle(TextInputStyle.Paragraph)

        const restockActionRow: any = new ActionRowBuilder()
            .addComponents(restockInput);

        restockModal.addComponents(restockActionRow);

        await interaction.showModal(restockModal).catch();
    },
    WhitelistRequired: true,
    DoNotDefer: true
});
