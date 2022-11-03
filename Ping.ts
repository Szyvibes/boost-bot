import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Experimental test to view status of slash commands.'),
    Execute: async (_client, _prisma: PrismaClient, guild, _interaction: ChatInputCommandInteraction, reply) => {
        const pingEmbed = Embed(
            guild?.embed_config,
            '🏓 ・ Pong',
            'Slash commands seem to be running just fine.'
        );

        await reply({ embeds: [pingEmbed], ephemeral: true });
    }
});
