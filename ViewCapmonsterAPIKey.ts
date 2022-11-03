import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('viewcapmonsterapikey')
        .setDescription('Views the capmonster api key for this server.'),
    Execute: async (_client, _prisma: PrismaClient, guild, _interaction: ChatInputCommandInteraction, reply) => {
        const apiKey = guild?.capmonster_api_key;

        const fetchEmbed = Embed(
            guild?.embed_config,
            '✅ ・ API Key',
            `Your capmonster cloud api key is: **${apiKey}**.`
        );

        const noKeyEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `You have not set the capmonster cloud api key.`,
            Colors.Red
        );

        if (!apiKey || apiKey === '') await reply({ embeds: [noKeyEmbed], ephemeral: true });
        else await reply({ embeds: [fetchEmbed], ephemeral: true });
    },
    WhitelistRequired: true
});
