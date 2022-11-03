import GetCookies from './GetCookies';
import GetFingerprint from './GetFingerprint';
import GetSuperProperties from './GetSuperProperties';

export default async (Token, Proxy) => {
    const Cookies: any = await GetCookies(Proxy.split(':'))
    const Fingerprint = await GetFingerprint(Proxy.split(':'));
    const SuperProperties = GetSuperProperties();

    if (!(Cookies || Fingerprint)) return false;

    return {
        'authority': 'discord.com',
        'method': 'POST',
        'path': '/api/v9/users/@me/channels',
        'scheme': 'https',
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate',
        'accept-language': 'en-US',
        'authorization': Token,
        'cookie': `__dcfduid=${Cookies?.dcf}; __sdcfduid=${Cookies?.sdc}`,
        'origin': 'https://discord.com',
        'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
        'x-debug-options': 'bugReporterEnabled',
        'x-fingerprint': Fingerprint,
        'x-super-properties': SuperProperties,
    };
};