import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('vouch')
        .setDescription('Mentions user with information regarding how to vouch.')
        .addChannelOption((o) => o
            .setName('channel')
            .setDescription('Channel for user to vouch in.')
            .setRequired(true))
        .addUserOption((o) => o
            .setName('user')
            .setDescription('User to mention.')
            .setRequired(true)),
    Execute: async (_client, _prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const options = interaction?.options;
        const user = interaction.guild.members.cache.get(options.getUser('user', true)?.id);
        const channel = options.getChannel('channel', true);
        const customerRole = interaction.guild.roles.cache.get(guild?.customer_role);

        const noUser = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Couldn't fetch the specified user.`,
            Colors.Red
        );

        const noChannel = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Couldn't fetch the specified channel.`,
            Colors.Red
        );

        const failedRoleEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Couldn't give <@${user.id}> (id: ${user.id}) the customer role.`,
            Colors.Red
        );

        const vouchEmbed = Embed(
            guild?.embed_config,
            '🎉 ・ Thanks for using our services',
            `Thanks, <@${user.id}>, for using our services.\n\n✅ Don't forget to vouch us in <#${channel.id}>!`
        );

        if (!user) return await reply({ embeds: [noUser], ephemeral: true });
        if (!channel) return await reply({ embeds: [noChannel], ephemeral: true });

        if (customerRole) await user.roles.add(customerRole)
            .then(async () => await reply({ embeds: [vouchEmbed] }))
            .catch(async () => await reply({ embeds: [failedRoleEmbed], ephemeral: true }));
        else await reply({ embeds: [vouchEmbed] })
    }
});
