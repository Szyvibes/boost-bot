import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('viewtokens')
        .setDescription('View the server tokens.')
        .addIntegerOption((o) => o
            .setName('tokens')
            .setDescription('The amount of tokens to view.')
            .setMinValue(1)),
    Execute: async (_client, _prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const options = interaction?.options;
        const tokens = options.getInteger('tokens');

        const tokensEmbed = (tokens) => Embed(
            guild?.embed_config,
            '📝 ・ Server Tokens',
            `Here is a list of **${tokens.length}** tokens:\n\n${tokens.map((t) => `\`\`${t.token}\`\`\n`).join('')}`.split('').splice(0, 4000).join('')
        );

        const notEnoughTokensEmbed = Embed(
            guild?.embed_config,
            '⚠️ ・ Not Enough Tokens',
            `Cannot retrieve list of tokens since there are not enough, specify less.`,
            Colors.Orange
        );

        const notEnoughTokens = tokens > guild?.discord_tokens?.length;

        if (notEnoughTokens && tokens) return await reply({ embeds: [notEnoughTokensEmbed] });

        await reply({ embeds: [tokensEmbed(tokens ? guild?.discord_tokens?.slice(0, tokens) : guild?.discord_tokens)], ephemeral: true });
    },
    WhitelistRequired: true
});
