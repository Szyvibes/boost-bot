import Config from './Config';
import { Events } from './Events';
import prisma from './Lib/Prisma';

const client = Config.Bot?.Client;

Events.forEach((event) => client.on(event.Name, (...args) => event.Execute(client, prisma, ...args)));

client.login(Config.Bot?.Token);