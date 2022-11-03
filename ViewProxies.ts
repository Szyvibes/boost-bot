import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('viewproxies')
        .setDescription('View the server proxies.')
        .addIntegerOption((o) => o
            .setName('proxies')
            .setDescription('The amount of proxies to view.')
            .setMinValue(1)),
    Execute: async (_client, _prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const options = interaction?.options;
        const proxies = options.getInteger('proxies');

        const proxiesEmbed = (proxies) => Embed(
            guild?.embed_config,
            '📝 ・ Server Proxies',
            `Here is a list of **${proxies.length}** proxies:\n\n${proxies.map((p) => `\`\`${p.proxy}\`\`\n`).join('')}`.split('').splice(0, 4000).join('')
        );

        const notEnoughProxiesEmbed = Embed(
            guild?.embed_config,
            '⚠️ ・ Not Enough Proxies',
            `Cannot retrieve list of proxies since there are not enough, specify less.`,
            Colors.Orange
        );

        const notEnoughProxies = proxies > guild?.proxies?.length;

        if (notEnoughProxies && proxies) return await reply({ embeds: [notEnoughProxiesEmbed] });

        await reply({ embeds: [proxiesEmbed(proxies ? guild?.proxies?.slice(0, proxies) : guild?.proxies)], ephemeral: true });
    },
    WhitelistRequired: true
});
