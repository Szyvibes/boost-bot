import { Client, ModalSubmitInteraction } from 'discord.js';
import { PrismaClient } from '@prisma/client';

export default interface ModalSubmit {
    Name: string;
    Execute: (client: Client, prisma: PrismaClient, guild, interaction: ModalSubmitInteraction, reply: (info: InteractionReplyOptions) => void) => void;
};