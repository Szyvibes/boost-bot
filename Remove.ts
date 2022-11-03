import { PrismaClient } from '@prisma/client';
import { ModalSubmitInteraction } from 'discord.js';
import Embed from '../Embed';
import Colors from '../EmbedColors';

export default async (Guild, Tokens, Prisma: PrismaClient, Interaction: ModalSubmitInteraction) => {
    const deletedEmbed = (deleted?, failed?) => Embed(
        Guild?.embed_config,
        '✅ ・ Deleted Tokens',
        `Processed all tokens.\n\nTotal Tokens: \`\`${Tokens.length}\`\`\nDeleted Tokens: \`\`${deleted}\`\`\nFailed To Delete Tokens: \`\`${failed}\`\`\nProcessed Tokens: \`\`${(deleted + failed)}\`\`/\`\`${Tokens.length}\`\`\n\nA total of \`\`${deleted}\`\`/\`\`${Tokens.length}\`\` tokens have been deleted.`,
        Colors.Green
    );

    const errorEmbed = Embed(
        Guild?.embed_config,
        '❌ ・ Error Occurred',
        `An unexpecting problem occurred.\nTry again or report the problem to a developer.`,
        Colors.Red
    );

    Prisma.discordToken.deleteMany({ where: { OR: Tokens.map((p) => ({ token: p, guild_id: Guild?.id })) } })
        .then(async (d) => await Interaction.editReply({ embeds: [deletedEmbed(d.count ?? 0, Tokens.length - d.count ?? 0)] }).catch())
        .catch(async () => await Interaction.editReply({ embeds: [errorEmbed] }).catch());
};