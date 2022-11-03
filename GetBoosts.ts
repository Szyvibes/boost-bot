import axios from 'axios';

export default ([Host, Port, Username, Password], Headers) => axios.get('https://discord.com/api/v9/users/@me/guilds/premium/subscription-slots', {
    proxy: {
        host: Host,
        port: Port,
        auth: {
            username: Username ?? '',
            password: Password ?? ''
        }
    },
    headers: Headers,
    timeout: 5000
})
    .then((Result) => Result?.status === 200 ? Result?.data : false)
    .catch(() => false);