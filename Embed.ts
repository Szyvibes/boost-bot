import { ColorResolvable, EmbedAuthorData, EmbedBuilder, EmbedField, EmbedFooterData } from 'discord.js';
import Colors from './EmbedColors';
import { isWebUri } from 'valid-url';

export default (
    config,
    title: string,
    description: string,
    color?: ColorResolvable,
    fields?: EmbedField[],
    url?: string,
    author?: EmbedAuthorData,
    thumbnail?: string,
    image?: string,
    footer?: EmbedFooterData
) => {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color ?? Colors.Green);
    
    if (url) embed.setURL(url);
    if (author ?? config?.author) embed.setAuthor(config?.author ? {
        name: config?.author ?? '',
        ...(config?.author_url && isWebUri(config?.author_url) && ({ url: config?.author_url })),
        ...(config?.author_icon_url && isWebUri(config?.author_icon_url) && { iconURL: config?.author_icon_url })
    } : author);
    if (thumbnail ?? config?.thumbnail_url) embed.setThumbnail((config?.thumbnail_url && isWebUri(config?.thumbnail_url)) ? config?.thumbnail_url : thumbnail);
    if (fields) embed.setFields(fields);
    if (image ?? config?.image_url) embed.setImage((config?.image_url && isWebUri(config?.image_url)) ? config?.image_url : image);
    if (footer ?? config?.footer) embed.setFooter(config?.footer ? {
        text: config?.footer ?? '',
        ...(config?.footer_icon_url && isWebUri(config?.footer_icon_url) && { iconURL: config?.footer_icon_url })
    } : footer);

    return embed;
};