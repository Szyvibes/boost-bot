import axios from 'axios';

export default ([Host, Port, Username, Password]) => axios.get('https://discord.com/api/v9/experiments', {
    proxy: {
        host: Host,
        port: Port,
        auth: {
            username: Username ?? '',
            password: Password ?? ''
        }
    },
    timeout: 5000
})
    .then((Result) => Result?.data?.fingerprint ?? false)
    .catch(() => false);