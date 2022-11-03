import { PrismaClient } from '@prisma/client';
import { ModalSubmitInteraction } from 'discord.js';
import Embed from '../Embed';
import Colors from '../EmbedColors';
import Verify from '../DiscordTokens/Verify';
import GetBoosts from '../DiscordTokens/GetBoosts';
import GetHeaders from '../DiscordTokens/GetHeaders';

export default async (Guild, Tokens, Prisma: PrismaClient, Interaction: ModalSubmitInteraction) => {
    const ValidTokens = [];
    const InvalidTokens = [];

    const addingEmbed = (valid?, invalid?) => Embed(
        Guild?.embed_config,
        ((valid + invalid) >= Tokens.length) ? '✅ ・ Added Tokens' : '⏰ ・ Adding Tokens',
        `${((valid + invalid) >= Tokens.length) ? `Processed all tokens.` : `Please wait. Validating and adding tokens.`}\n\nTotal Tokens: \`\`${Tokens.length}\`\`\nValid Tokens: \`\`${valid}\`\`\nInvalid Tokens: \`\`${invalid}\`\`\nProcessed Tokens: \`\`${(valid + invalid)}\`\`/\`\`${Tokens.length}\`\`\n\nA total of \`\`${valid}\`\`/\`\`${Tokens.length}\`\` tokens have been added.`,
        ((valid + invalid) >= Tokens.length) ? Colors.Green : Colors.Orange
    );

    const errorEmbed = Embed(
        Guild?.embed_config,
        '❌ ・ Error Occurred',
        `An unexpecting problem occurred.\nTry again or report the problem to a developer.`,
        Colors.Red
    );

    const updateEmbed = async () => await Interaction.editReply({ embeds: [addingEmbed(ValidTokens.length, InvalidTokens.length)] }).catch();

    await Interaction.editReply({ embeds: [addingEmbed(ValidTokens.length, InvalidTokens.length)] }).catch();

    await Promise.all(Tokens.map(async (t) => {
        const { token: Token, proxy: Proxy } = t;

        const Invalid = (Token) => {
            InvalidTokens.push(Token);
            updateEmbed();
        };

        const Valid = (Token, Boosts) => {
            ValidTokens.push({ token: Token, boosts_available: Boosts?.length });
            updateEmbed();
        };

        const Verified = await Verify(Token, Proxy);
        if (!Verified) return Invalid(Token);

        const Headers = await GetHeaders(Token, Proxy);
        if (!Headers) return Invalid(Token);

        const Boosts = (await GetBoosts(Proxy.split(':'), Headers)).map((b) => b.id);
        if (!Boosts || Boosts?.length < 1) return Invalid(Token);

        return Valid(Token, Boosts);
    }))
        .catch(async () => await Interaction.editReply({ embeds: [errorEmbed] }).catch());

    Prisma.discordToken.createMany({ data: [...new Set([...Guild?.discord_tokens, ...ValidTokens])].map(({ token, boosts_available }) => ({ token, boosts_available, guild_id: Guild?.id })), skipDuplicates: true })
        .catch(async () => await Interaction.editReply({ embeds: [errorEmbed] }).catch());
};