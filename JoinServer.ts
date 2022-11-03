import axios from 'axios';
import { HCaptchaTask } from 'node-capmonster';

export default ([Host, Port, Username, Password], Headers, Invite, APIKey) => {
    if (!APIKey || APIKey === '') return;

    const captcha = new HCaptchaTask(APIKey);

    return captcha.createTask('https://discord.com/channels/@me', '76edd89a-a91d-4140-9591-ff311e104059')
        .then((id) => captcha.joinTaskResult(id)
            .then((response) => axios.post(`https://discord.com/api/v9/invites/${Invite}`, {
                captcha_key: response?.gRecaptchaResponse
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
                    'content-type': 'application/json'
                },
                timeout: 5000
            })
                .then((Result) => ({ guild: Result?.data?.guild ?? false }))
                .catch(() => false)))
            .catch(() => false)
        .catch((() => false));
};