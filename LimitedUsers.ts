import Config from '../Config';

let LimitedUsers = [];

export const FindLimitedUser = (UserId) => LimitedUsers.find((i) => i === UserId);

export const RemoveLimitedUser = (UserId) => (LimitedUsers = LimitedUsers
	.filter((i) => i !== UserId));

export const AddLimitedUser = (UserId) => {
    if (!FindLimitedUser(UserId)) LimitedUsers.push(UserId) && setTimeout(() => RemoveLimitedUser(UserId), Config.Bot.CommandLimit * 1000);
};