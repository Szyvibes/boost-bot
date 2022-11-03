import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

export default ([Host, Port, Username, Password]) => client.get('https://discord.com', {
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
    .then((Result) => {
        const cookies = Result?.config?.jar?.store?.idx[Host]['/'];

        if (!(cookies && cookies.__dcfduid && cookies.__sdcfduid)) return false;

        const dcf = cookies.__dcfduid.toString().split('__dcfduid=')[1].split(';')[0];
        const sdc = cookies.__sdcfduid.toString().split('__sdcfduid=')[1].split(';')[0];

        return { dcf, sdc };
    })
    .catch(() => false);