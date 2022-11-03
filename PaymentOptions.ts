import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
    .setName('paymentoptions')
    .setDescription('Lists available payment options.')
        .addUserOption((o) => o
            .setName('user')
            .setDescription('User to mention.')),
    Execute: async (_client, _prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const options = interaction?.options;
        const user = options.getUser('user');

        const paymentsEmbed = Embed(
            guild?.embed_config,
            '💸 ・ Payment Options',
            `${user ? `<@${user.id}>, o` : 'O'}ur payment options are as followed:`,
            null,
            guild?.payment_options?.map(({ name, value }) => ({ name, value }))
        );

        await reply({ embeds: [paymentsEmbed] });
    }
});
