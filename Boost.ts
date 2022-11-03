import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Interfaces/Command';
import Embed from '../../Lib/Embed';
import Colors from '../../Lib/EmbedColors';
import { PrismaClient } from '@prisma/client';
import Boost from '../../Lib/BoostServer';

export const Command: Command = ({
    Command: new SlashCommandBuilder()
        .setName('boost')
        .setDescription('Boosts the specified server.')
        .addStringOption((o) => o
            .setName('invite')
            .setDescription('The invite code to the server (e.g. gmSimf, xemSil, kWiuSm).')
            .setRequired(true))
        .addIntegerOption((o) => o
            .setName('boosts')
            .setDescription('Amount of boosts to boost the server with.')
            .setRequired(true)
            .setMinValue(1)),
    Execute: async (_client, prisma: PrismaClient, guild, interaction: ChatInputCommandInteraction, reply) => {
        const shuffle = (i) => i.map((v) => ({ v, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ v }) => v);
        const options = interaction?.options;
        const invite = options.getString('invite', true);
        const boosts = options.getInteger('boosts', true);

        const noInvite = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Invalid invite code specified.`,
            Colors.Red
        );

        const noBoosts = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `Invalid amount of boosts specified.`,
            Colors.Red
        );

        if (!invite) return await reply({ embeds: [noInvite], ephemeral: true });
        if (!boosts) return await reply({ embeds: [noBoosts], ephemeral: true });

        const inviteFormatted = invite.includes('/') ? invite.split('/').pop() : invite;
        const tokens = shuffle(guild?.discord_tokens)?.filter((t) => !t.using).sort((a, b) => b.boosts_available - a.boosts_available).reduce((p, c) => p.reduce((p, c) => p + c.boosts_available, 0) + c.boosts_available <= boosts ? [...p, c] : p, []);

        const notAmountEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `There are not exactly **${boosts}** boosts available.`,
            Colors.Red
        );

        if (tokens.reduce((p, c) => p + c.boosts_available, 0) !== boosts) return await reply({ embeds: [notAmountEmbed], ephemeral: true });

        const notEnoughProxies = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `There aren't enough proxies in this server for **${tokens.length}** tokens. Try lower the amount of tokens.`,
            Colors.Red
        );

        const proxies = shuffle(guild?.proxies)?.slice(0, tokens.length);

        if (proxies.length < tokens.length) return await reply({ embeds: [notEnoughProxies], ephemeral: true });

        const noCapmonsterApiKeyEmbed = Embed(
            guild?.embed_config,
            '❌ ・ Error Occurred',
            `You haven't set a capmonster api key. Create one [here](https://capmonster.cloud) and set it via **/setcapmonsterapikey [api_key]**.`,
            Colors.Red
        );

        if (!guild?.capmonster_api_key || guild?.capmonster_api_key === '') return await reply({ embeds: [noCapmonsterApiKeyEmbed], ephemeral: true });

        Boost(inviteFormatted, tokens.map((t, idx) => ({ token: t?.token, proxy: proxies[idx]?.proxy, boosts: t?.boosts_available })), interaction, prisma, guild);
    },
    WhitelistRequired: true
});
