import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('setembedconfig')
        .setDescription('Sets the embed configuration for this server.')
        .addStringOption((o) => o
            .setName('author')
            .setDescription('Sets the author text (field at the top).'))
        .addStringOption((o) => o
            .setName('author_url')
            .setDescription('Sets the author url (link).'))
        .addStringOption((o) => o
            .setName('author_icon_url')
            .setDescription('Sets the author icon url (icon at top).'))
        .addStringOption((o) => o
            .setName('thumbnail_url')
            .setDescription('Sets the thumbnail url (small image).'))
        .addStringOption((o) => o
            .setName('image_url')
            .setDescription('Sets the image url (large image).'))
        .addStringOption((o) => o
            .setName('footer')
            .setDescription('Sets the footer text (field at the bottom).'))
        .addStringOption((o) => o
            .setName('footer_icon_url')
            .setDescription('Sets the footer icon url (icon at bottom).')),
    Execute: async (_client, prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const options = interaction?.options;
        
        const author = options.getString('author');
        const author_url = options.getString('author_url');
        const author_icon_url = options.getString('author_icon_url');
        const thumbnail_url = options.getString('thumbnail_url');
        const image_url = options.getString('image_url');
        const footer = options.getString('footer');
        const footer_icon_url = options.getString('footer_icon_url');

        const data = {
            ...(author && { author }),
            ...(author_url && { author_url }),
            ...(author_icon_url && { author_icon_url }),
            ...(thumbnail_url && { thumbnail_url }),
            ...(image_url && { image_url }),
            ...(footer && { footer }),
            ...(footer_icon_url && { footer_icon_url })
        };

        const setEmbed = Embed(
            guild?.embed_config,
            '✅ ・ Embed Config Set',
            `Set the embed config to:\n\n${Object.entries(data).map(([key, value]) => `**${key}**: \`\`${value}\`\``).join('\n')}`
        );

        const failedToSetEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Failed to set the embed config.`,
            Colors.Red
        );

        const command = guild?.embed_config ? prisma.embedConfig.update({ where: { guild_id: guild?.id }, data }) : prisma.embedConfig.create({ data: { ...data, guild_id: guild?.id } });

        command
            .then(async () => await reply({ embeds: [setEmbed], ephemeral: true }))
            .catch(async () => await reply({ embeds: [failedToSetEmbed], ephemeral: true }));
    },
    AdministratorRequired: true
});
