import { Client, CommandInteraction, InteractionCollector, InteractionReplyOptions, ModalSubmitInteraction } from 'discord.js';
import { Commands } from '../Commands';
import { ModalSubmits } from '../ModalSubmits';
import Event from '../Interfaces/Event';
import { PrismaClient } from '@prisma/client';
import Colors from '../Lib/EmbedColors';
import Embed from '../Lib/Embed';
import Config from '../Config';
import { AddLimitedUser, FindLimitedUser } from '../Lib/LimitedUsers';
import CreateGuild from '../Lib/Guild/Create';

const HandleSlashCommand = async (client: Client, prisma: PrismaClient, guild, interaction: CommandInteraction, reply) => {
    const SlashCommand = Commands.find((c) => c.Command.name === interaction.commandName);
    const RateLimited = FindLimitedUser(interaction?.member?.user?.id);
    const Whitelisted = guild?.whitelisted_users?.find((u) => u.user_id === interaction?.user?.id);
    const Administrator = Config.Bot.Administrators.includes(interaction?.user?.id);

    const LimitEmbed = Embed(
        guild?.embed_config,
        '❌ ・ Command Disallowed',
        `You are being rate-limited.\nThere is a ${Config.Bot.CommandLimit.toString()} second cooldown.`,
        Colors.Red
    );

    const GuildWhitelistEmbed = Embed(
        guild?.embed_config,
        '❌ ・ Command Disallowed',
        `This guild is not whitelisted.\nYou cannot proceed with this command.`,
        Colors.Red
    );

    const WhitelistEmbed = Embed(
        guild?.embed_config,
        '❌ ・ Command Disallowed',
        `You are not whitelisted nor the owner.\nYou cannot proceed with this command.`,
        Colors.Red
    );

    const AdministratorEmbed = Embed(
        guild?.embed_config,
        '❌ ・ Command Disallowed',
        `You are not a bot administrator.\nYou cannot proceed with this command.`,
        Colors.Red
    );

    const CommandFailedEmbed = Embed(
        guild?.embed_config,
        '❌ ・ Command Failed',
        `Something went wrong.\nTry again or report the problem to a developer.`,
        Colors.Red
    );

    if (!SlashCommand) return await interaction.reply({ embeds: [CommandFailedEmbed], ephemeral: true }).catch();
    if (!guild?.whitelisted && !Administrator && !Config.Bot.Administrators.includes(interaction?.guild?.ownerId)) return await interaction.reply({ embeds: [GuildWhitelistEmbed], ephemeral: true }).catch();
    if (SlashCommand.AdministratorRequired && !Administrator) return await interaction.reply({ embeds: [AdministratorEmbed], ephemeral: true }).catch();
    if (SlashCommand.WhitelistRequired && (interaction?.user?.id !== interaction?.guild?.ownerId && !Whitelisted && !Administrator)) return await interaction.reply({ embeds: [WhitelistEmbed], ephemeral: true }).catch();
    if (!SlashCommand || !guild) return await interaction.reply({ embeds: [CommandFailedEmbed], ephemeral: true }).catch();
    if (RateLimited) return await interaction.reply({ embeds: [LimitEmbed], ephemeral: true }).catch();

    if (!SlashCommand.DoNotDefer) await interaction.deferReply();

    SlashCommand.Execute(client, prisma, guild, interaction, reply);
    AddLimitedUser(interaction?.member?.user?.id);
};

const HandleModalSubmit = async (client: Client, prisma: PrismaClient, guild, interaction: ModalSubmitInteraction, reply) => {
    const ModalSubmit = ModalSubmits.find((m) => m.Name === interaction?.customId);

    await interaction.deferReply().catch();

    ModalSubmit.Execute(client, prisma, guild, interaction, reply);
};

export const Event: Event = ({
    Name: 'interactionCreate',
    Execute: async (client: Client, prisma: PrismaClient, interaction: any) => {
        const guild = await CreateGuild(interaction?.guildId, prisma);

        const reply = async (ReplyOptions: InteractionReplyOptions) => {
            await interaction.deleteReply().catch();
            return await interaction.followUp({ ...ReplyOptions, content: `<@${interaction?.user?.id}>${ReplyOptions.content ? `\n${ReplyOptions.content}` : ''}` }).catch();
        };

        if (interaction.isModalSubmit() && interaction?.customId) HandleModalSubmit(client, prisma, guild, interaction, reply);
        else if (interaction?.isCommand() || interaction?.isContextMenuCommand()) await HandleSlashCommand(client, prisma, guild, interaction, reply);
    }
});