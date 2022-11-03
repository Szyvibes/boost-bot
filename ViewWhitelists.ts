import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('viewwhitelists')
        .setDescription('View the server whitelists.'),
    Execute: async (_client, _prisma: PrismaClient, guild, _interaction: ChatInputCommandInteraction, reply) => {
        const whitelistsEmbed = (whitelists) => Embed(
            guild?.embed_config,
            '📝 ・ User Whitelists',
            `Here is a list of **${whitelists.length}** whitelists:\n\n${whitelists.map((u) => `<@${u.user_id}> (id: ${u.user_id})\n`).join('')}`.split('').splice(0, 4000).join('')
        );

        await reply({ embeds: [whitelistsEmbed(guild?.whitelisted_users)] });
    },
    WhitelistRequired: true
});
