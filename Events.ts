import { globby } from 'globby';
import Event from './Interfaces/Event';

const files = await globby(`./Events/*.ts`);

const events = async () => await Promise.all(files
    .map(async (eventPath) => (await import(eventPath))?.Event));

export const Events: Event[] = await events();