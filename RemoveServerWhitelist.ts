import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('removeserverwhitelist')
        .setDescription('Removes whitelist from a specified server.')
        .addStringOption((o) => o
            .setName('server_id')
            .setDescription('Server to remove whitelist from.')
            .setRequired(true)),
    Execute: async (client, prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const options = interaction?.options;
        const serverId = options.getString('server_id', true);

        const removedWhitelistEmbed = (serverName) => Embed(
            guild?.embed_config,
            '✅ ・ Removed Whitelist',
            `Removed whitelist from **${serverName ?? 'Unable to fetch'}** (id: ${serverId}).`
        );

        const notWhitelistedEmbed = (serverName) => Embed(
            guild?.embed_config,
            '⚠️ ・ Not Whitelisted',
            `**${serverName ?? 'Unable to fetch'}** (id: ${serverId}) is not whitelisted.`,
            Colors.Orange
        );

        const errorEmbed = (serverName) => Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to remove whitelist from **${serverName ?? 'Unable to fetch'}** (id: ${serverId}).\nTry again or report the problem to a developer.`,
            Colors.Red
        );

        const server = await prisma.guild.findFirst({ where: { guild_id: serverId, whitelisted: true } });
        const discordServer = client?.guilds?.cache?.get(serverId)

        if (!server) return await reply({ embeds: [notWhitelistedEmbed(discordServer?.name)] });

        prisma.guild.delete({ where: { id: server?.id } })
            .then(async () => discordServer.leave()
                .then(async () => await reply({ embeds: [removedWhitelistEmbed(discordServer?.name)] })))
                .catch(async () => await reply({ embeds: [removedWhitelistEmbed(discordServer?.name)] }))
            .catch(async () => await reply({ embeds: [errorEmbed(discordServer?.name)] }));
    },
    AdministratorRequired: true
});
