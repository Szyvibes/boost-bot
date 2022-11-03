import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Whitelists a specified user.')
        .addUserOption((o) => o
            .setName('user')
            .setDescription('User to whitelist.')
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

        const whitelistedEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Whitelisted',
            `<@${user.id}> (id: ${user.id}) has been whitelisted.`
        );

        const alreadyWhitelistedEmbed = Embed(
            guild?.embed_config,
            '⚠️ ・ Already Whitelisted',
            `<@${user.id}> (id: ${user.id}) has already been whitelisted.`,
            Colors.Orange
        );

        const errorEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to whitelist <@${user.id}> (id: ${user.id}).\nTry again or report the problem to a developer.`,
            Colors.Red
        );

        const cantWhitelistSelfEmbed = Embed(
            guild?.embed_config,
            '⚠️ ・ Cant Whitelist',
            `You cannot whitelist yourself.`,
            Colors.Orange
        );

        if (user?.id === interaction?.user?.id) return await reply({ embeds: [cantWhitelistSelfEmbed] });

        const alreadyWhitelisted = await prisma.whitelistedUser.findFirst({ where: { user_id: user?.id } });

        if (alreadyWhitelisted) return await reply({ embeds: [alreadyWhitelistedEmbed] });

        prisma.whitelistedUser.create({ data: { user_id: user?.id, guild_id: guild?.id } })
            .then(async () => await reply({ embeds: [whitelistedEmbed] }))
            .catch(async () => await reply({ embeds: [errorEmbed] }));
    },
    WhitelistRequired: true
});
