import { Client, CommandInteraction, InteractionReplyOptions } from 'discord.js';
import { PrismaClient } from '@prisma/client';

export default interface Command {
    Command: any;
    WhitelistRequired?: boolean;
    AdministratorRequired?: boolean;
    DoNotDefer?: boolean;
    Execute: (client: Client, prisma: PrismaClient, guild, interaction: CommandInteraction, reply: (info: InteractionReplyOptions) => void) => void;
};