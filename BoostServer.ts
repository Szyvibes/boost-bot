import axios from 'axios';

export default ([Host, Port, Username, Password], Headers, BoostIds, ServerId) => axios.put(`https://discord.com/api/v9/guilds/${ServerId}/premium/subscriptions`, {
    user_premium_guild_subscription_slot_ids: BoostIds
}, {
    proxy: {
        host: Host,
        port: Port,
        auth: {
            username: Username ?? '',
            password: Password ?? ''
        }
    },
    headers: {
        ...Headers,
        'content-type': 'application/json',
        'content-length': JSON.stringify({ user_premium_guild_subscription_slot_ids: BoostIds }).length.toString()
    },
    timeout: 5000
})
    .then((Result) => Result?.status === 201 ? Result?.data : false)
    .catch(() => false);