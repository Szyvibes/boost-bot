import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import { PrismaClient } from '@prisma/client';
import Colors from '../../Lib/EmbedColors';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('viewserverwhitelists')
        .setDescription('View all bot server whitelists.'),
    Execute: async (client, prisma: PrismaClient, guild, _interaction: ChatInputCommandInteraction, reply) => {
        const whitelistsEmbed = (servers) => Embed(
            guild?.embed_config,
            '📝 ・ Server Whitelists',
            `Here is a list of **${servers.length}** whitelists:\n\n${servers.map((s) => `\`\`${s?.name ?? 'Unable to fetch'}\`\` (id: ${s?.id})\n`).join('')}`.split('').splice(0, 4000).join('')
        );

        const failedFetchEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            'Couldn\'t fetch all server whitelists.',
            Colors.Red
        );

        prisma.guild.findMany({ where: { whitelisted: true } })
            .then(async (whitelists) => await reply({ embeds: [whitelistsEmbed(whitelists.map((w) => ({ id: w.guild_id, name: client?.guilds?.cache?.get(w.guild_id)?.name })))] }))
            .catch(async () => await reply({ embeds: [failedFetchEmbed], ephemeral: true }));
    },
    AdministratorRequired: true
});
