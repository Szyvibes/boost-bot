import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('setcapmonsterapikey')
        .setDescription('Sets the capmonster api key for this server.')
        .addStringOption((o) => o
            .setName('api_key')
            .setDescription('Your capmonster cloud api key (32-digit-key).')
            .setRequired(true)),
    Execute: async (_client, prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const options = interaction?.options;
        const apiKey = options.getString('api_key', true);

        const noAPIKey = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            'Invalid API Key provided.',
            Colors.Red
        );

        if (!apiKey) return await reply({ embeds: [noAPIKey], ephemeral: true });

        const setEmbed = Embed(
            guild?.embed_config,
            '✅ ・ API Key Set',
            `Set the capmonster cloud api key to **${apiKey}**.`
        );

        const failedToSetEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to set the capmonster cloud api key to **${apiKey}**.`,
            Colors.Red
        );

        prisma.guild.update({ where: { id: guild?.id }, data: { capmonster_api_key: apiKey } })
            .then(async () => await reply({ embeds: [setEmbed], ephemeral: true }))
            .catch(async () => await reply({ embeds: [failedToSetEmbed], ephemeral: true }));
    },
    WhitelistRequired: true
});
