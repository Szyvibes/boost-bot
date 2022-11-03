import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import { PrismaClient } from '@prisma/client';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Fetches the available stock & other information.'),
    Execute: async (_client, _prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        await interaction.guild.members.fetch();

        const customerRole = interaction.guild.roles.cache.get(guild?.customer_role);
        
        const stockEmbed = Embed(
            guild?.embed_config,
            'ℹ️ ・ Server Information',
            `**Tokens**: \`\`${guild.discord_tokens.length}\`\`\n**Boosts**: \`\`${guild.discord_tokens.reduce((p, c) => p + c.boosts_available, 0)}\`\`\n**Proxies**: \`\`${guild.proxies.length}\`\`\n**Whitelisted Users**: \`\`${guild.whitelisted_users.length}\`\`${customerRole ? `\n**Customers**: \`\`${customerRole?.members?.size}\`\`` : ''}`,
        );

        await reply({ embeds: [stockEmbed] });
    }
});
