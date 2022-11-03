import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('removecapmonsterapikey')
        .setDescription('Removes the capmonster api key for this server.'),
    Execute: async (_client, prisma: PrismaClient, guild, _interaction: ChatInputCommandInteraction, reply) => {
        const removeEmbed = Embed(
            guild?.embed_config,
            '✅ ・ API Key Removed',
            `Removed the capmonster cloud api key.`
        );

        const failedToRemoveEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to remove the capmonster cloud api key.`,
            Colors.Red
        );

        prisma.guild.update({ where: { id: guild?.id }, data: { capmonster_api_key: '' } })
            .then(async () => await reply({ embeds: [removeEmbed], ephemeral: true }))
            .catch(async () => await reply({ embeds: [failedToRemoveEmbed], ephemeral: true }));
    },
    WhitelistRequired: true
});
