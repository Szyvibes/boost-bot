import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('removewhitelist')
        .setDescription('Removes whitelist from a specified user.')
        .addUserOption((o) => o
            .setName('user')
            .setDescription('User to remove whitelist from.')
            .setRequired(true)),
    Execute: async (_client, prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const options = interaction?.options;
        const user = options.getUser('user', true);

        const noUser = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Couldn't fetch the specified user.`,
            Colors.Red
        );

        if (!user) return await reply({ embeds: [noUser], ephemeral: true });

        const removedWhitelistEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Removed Whitelist',
            `Removed whitelist from <@${user.id}> (id: ${user.id}).`
        );

        const notWhitelistedEmbed = Embed(
            guild?.embed_config,
            '⚠️ ・ Not Whitelisted',
            `<@${user.id}> (id: ${user.id}) is not whitelisted.`,
            Colors.Orange
        );
        const errorEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to remove whitelist from <@${user.id}>.\nTry again or report the problem to a developer.`,
            Colors.Red
        );

        const cantWhitelistSelfEmbed = Embed(
            guild?.embed_config,
            '⚠️ ・ Cant Remove Whitelist',
            `You cannot remove whitelist from yourself.`,
            Colors.Orange
        );

        if (user?.id === interaction?.user?.id) return await reply({ embeds: [cantWhitelistSelfEmbed] });

        const whitelisted = await prisma.whitelistedUser.findFirst({ where: { user_id: user?.id } });

        if (!whitelisted) return await reply({ embeds: [notWhitelistedEmbed] });

        prisma.whitelistedUser.deleteMany({ where: { user_id: user?.id, guild_id: guild?.id } })
            .then(async () => await reply({ embeds: [removedWhitelistEmbed] }))
            .catch(async () => await reply({ embeds: [errorEmbed] }));
    },
    WhitelistRequired: true
});
