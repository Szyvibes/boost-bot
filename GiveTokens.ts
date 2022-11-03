import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('givetokens')
        .setDescription('Gives a specified user tokens.')
        .addUserOption((o) => o
            .setName('user')
            .setDescription('User to whitelist.')
            .setRequired(true))
        .addIntegerOption((o) => o
            .setName('tokens')
            .setDescription('The amount of tokens to give.')
            .setRequired(true)
            .setMinValue(1)),
    Execute: async (_client, prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const options = interaction?.options;
        const user = options.getUser('user', true);
        const tokens = options.getInteger('tokens', true);

        const noUser = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Couldn't fetch the specified user.`,
            Colors.Red
        );

        const noTokens = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Invalid amount of tokens specified.`,
            Colors.Red
        );

        if (!user) return await reply({ embeds: [noUser], ephemeral: true });
        if (!tokens) return await reply({ embeds: [noTokens], ephemeral: true });

        const givenTokens = Embed(
            guild?.embed_config,
            '✅ ・ Given Tokens',
            `DMed <@${user.id}> (id: ${user.id}) **${tokens}** tokens.`
        );

        const notEnoughTokensEmbed = Embed(
            guild?.embed_config,
            '⚠️ ・ Not Enough Tokens',
            `Cannot give <@${user.id}> (id: ${user.id}) **${tokens}** tokens since there are not enough.`,
            Colors.Orange
        );

        const dmsClosedEmbed = Embed(
            guild?.embed_config,
            '⚠️ ・ User DMs are closed',
            `Cannot give <@${user.id}> (id: ${user.id}) **${tokens}** tokens since their dms are closed.`,
            Colors.Orange
        );

        const errorEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to give <@${user.id}> (id: ${user.id}) **${tokens}** tokens.\nTry again or report the problem to a developer.`,
            Colors.Red
        );

        const dmEmbed = (tokensToGive) => Embed(
            guild?.embed_config,
            `✅ ・ You were given ${tokens} tokens`,
            `<@${interaction?.user?.id}> (id: ${interaction?.user?.id}) has given you ${tokens} tokens:\n\n${tokensToGive.map((t) => `\`\`${t}\`\`\n`).join('')}`.split('').splice(0, 4000).join('')
        );

        const testDmEmbed = Embed(
            guild?.embed_config,
            `✅ ・ Checking DMs`,
            `You will receive **${tokens}** tokens from <@${interaction?.user?.id}> (id: ${interaction?.user?.id}).`
        );

        const notEnoughTokens = tokens > guild?.discord_tokens?.length;

        if (notEnoughTokens) return await reply({ embeds: [notEnoughTokensEmbed] });

        const TokensToGive = guild?.discord_tokens?.slice(0, tokens);

        user.send({ embeds: [testDmEmbed] })
            .then(() => prisma.discordToken.deleteMany({ where: { OR: TokensToGive.map((t) => ({ token: t.token })) } })
                .then(() => user.send({ embeds: [dmEmbed(TokensToGive.map((t) => t.token))] })
                    .then(async () => await reply({ embeds: [givenTokens] }))
                    .catch(async () => await reply({ embeds: [dmsClosedEmbed] })))
                .catch(async () => await reply({ embeds: [errorEmbed] })))
            .catch(async () => await reply({ embeds: [dmsClosedEmbed] }));
    },
    WhitelistRequired: true
});
