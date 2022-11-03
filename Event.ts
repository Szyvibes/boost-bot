import { Client } from 'discord.js';

export default interface Event {
    Name: string;
    Execute: (client: Client, ...args: any) => void;
};