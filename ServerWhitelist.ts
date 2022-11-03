import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';
import CreateGuild from '../../Lib/Guild/Create';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('serverwhitelist')
        .setDescription('Whitelists a specified server.')
        .addStringOption((o) => o
            .setName('server_id')
            .setDescription('Server to whitelist.')
            .setRequired(true)),
    Execute: async (client, prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const options = interaction?.options;
        const serverId = options.getString('server_id', true);
        const server = client?.guilds?.cache.get(serverId);

        const noServer = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Couldn't fetch the specified server.`,
            Colors.Red
        );

        if (!server) return await reply({ embeds: [noServer], ephemeral: true });

        const whitelistedEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Server Whitelisted',
            `**${server?.name}** (id: ${server?.id}) has been whitelisted.`
        );

        const alreadyWhitelistedEmbed = Embed(
            guild?.embed_config,
            '⚠️ ・ Already Whitelisted',
            `**${server?.name}** (id: ${server?.id}) has already been whitelisted.`,
            Colors.Orange
        );

        const errorEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to whitelist **${server?.name}** (id: ${server?.id}).\nTry again or report the problem to a developer.`,
            Colors.Red
        );

        const guildDb = await CreateGuild(server?.id, prisma);

        if (guildDb?.whitelisted) return await reply({ embeds: [alreadyWhitelistedEmbed] });

        prisma.guild.update({ where: { guild_id: server?.id }, data: { whitelisted: true } })
            .then(async () => await reply({ embeds: [whitelistedEmbed] }))
            .catch(async () => await reply({ embeds: [errorEmbed] }));
    },
    AdministratorRequired: true
});
