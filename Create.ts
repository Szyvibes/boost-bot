export default async (GuildId, Prisma) => {
    const GetGuild = async () => await Prisma.guild.findUnique({
        where: {
            guild_id: GuildId
        },
        include: {
            discord_tokens: true,
            whitelisted_users: true,
            proxies: true,
            payment_options: true,
            embed_config: true
        }
    });

    return await GetGuild() ?? Prisma.guild.create({ data: {
        guild_id: GuildId
    }})
        .then(async () => await GetGuild() ?? false)
        .catch(console.error);
};