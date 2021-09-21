aoijs = require('aoi.js');

const bot = new aoijs.Bot({
	token: process.env['TOKEN'], //Discord Bot Token
	prefix: '$getServerVar[Prefix]' //Discord Bot Prefix
});
bot.onMessage(); //Allows to execute Commands

const fs = require('fs');

const folders = fs.readdirSync('./commands/');

for (const files of folders) {
	const folder = fs
		.readdirSync(`./commands/${files}/`)
		.filter(file => file.endsWith('.js'));

	for (const commands of folder) {
		const command = require(`./commands/${files}/${commands}`);
		bot.command({
			name: command.name,
			aliases: command.aliases,
			code: command.code
		});
	}
}

bot.command({
	name: 'ping', //Trigger name (command name)
	code: `Pong! $pingms` //Code
});

bot.readyCommand({
	channel: '885879642676953168',
	code: `$title[aoi.js project]
    $description[\`the bot was rebooted by a dev or suffered a server crash, bot online ping\`: **$ping**]
  $color[RANDOM]
  $addTimestamp`
});

bot.command({
	name: 'cpu', //Trigger name (command name)
	code: `CPU: $cpu` //Code
});
bot.status({
	text: 's/help https;//dsc.gg/sinon-bot',
	type: 'PLAYING',
	status: 'online',
	time: 12
});

bot.status({
	text: '$allMembersCount',
	type: 'WATCHING',
	status: 'online',
	time: 12
});

const keepAlive = require('./server');
const Monitor = require('ping-monitor');

keepAlive();
const monitor = new Monitor({
	website: '',
	title: 'NAME',
	interval: 2 // minutes
});

monitor.on('up', res => console.log(`${res.website} está encedido.`));
monitor.on('down', res =>
	console.log(`${res.website} se ha caído - ${res.statusMessage}`)
);
monitor.on('stop', website => console.log(`${website} se ha parado.`));
monitor.on('error', error => console.log(error));

//addemoji command

bot.command({
	name: 'addemoji',
	aliases: 'ad',
	code: `
 Emoji $addEmoji[https://cdn.discordapp.com/emojis/$replaceText[$replaceText[$checkCondition[$checkContains[$message[1];<]$checkContains[$message[1];:]$checkContains[$message[1];>]==truetruetrue]$isNumber[$message[1]];truefalse;$replaceText[$advancedTextSplit[$message[1];:;3];>;]];falsetrue;$message[1]];$message[2];yes] added with the name -> **$message[2]**
 $onlyIf[$charCount[$message[2]]>=2;⛔ **You must put a longer name over than \`2 chars\`**]
 $onlyIf[$message[2]!=;**Usage**: \`addemoji <emoji | emojiID> <name>\`]
$onlyPerms[manageemojis;**You dont have the permission to use this command**]
$onlyBotPerms[manageemojis;**I dont have the permission to use this command**]
$suppressErrors $onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

//userinfo command

bot.command({
	name: 'info',
	aliases: ['i', 'whois', 'userinfo', 'useri', 'ui'],
	code: `
    $argsCheck[>1;pls mentioned one user]
$if[$findMembers[$message;10;{position}]!=1]
$author[$userTag[$authorID];$authorAvatar]
$description[Please choose the following...
$findMembers[$message;10;**{position}.)** [{tag}](https://youtu.be/Qskm9MTz2V4=16)]]
$color[BLUE]
$awaitMessages[$authorID;1m;everything;userinfo;$getVar[no] Cancelled]
$setUserVar[userinf;$findMembers[$message;10;{id}]]
$elseIf[$findMembers[$message;10;{position}]==1]
$author[$userTag[$get[id]];$userAvatar[$get[id]]]
$thumbnail[$userAvatar[$get[id]]]
$description[
$addField[Roles[$userRoleCount[$get[id]]];$replaceText[$replaceText[$checkCondition[$userRoleCount[$get[id]]==0];true;Undefined];false;$userRoles[$get[id];mentions;, ]];yes]
$addField[Creation Date:;$creationDate[$get[id]]
\`$creationDate[$get[id];time]\`;yes]
$addField[Join Date:;$memberJoinedDate[$get[id]]
\`$memberJoinedDate[$get[id];time]\`;yes]
$addField[Nickname:;$replaceText[$replaceText[$checkCondition[$djsEval[guild.members.fetch("$get[id]").then(d=>d.nickname);yes]==null];true;Undefined];false;$djsEval[guild.members.fetch("$get[id]").then(d=>d.nickname);yes]];yes]
$addField[Tag:;$discriminator[$get[id]];yes]
$addField[Username:;$username[$get[id]];yes]
$addField[ID:;\`$get[id]\`;yes]
]
$color[BLUE]
$let[id;$findMembers[$message;10;{id}]]
$endElseIf
$endIf
$onlyIf[$message!=;$get[err]]
$onlyIf[$findMembers[$message;10;{id}]!=;$get[err]]
$let[err;{author:$userTag[$get[idb]]:$userAvatar[$get[idb]]}{thumbnail:$userAvatar[$get[idb]]}
{field:ID#COLON#:\`$get[idb]\`:yes}
{field:Username#COLON#:$username[$get[idb]]:yes}
{field:Tag#COLON#:$discriminator[$get[idb]]:yes}
{field:Nickname#COLON#:$replaceText[$replaceText[$checkCondition[$djsEval[guild.members.fetch("$get[idb]").then(d=>d.nickname);yes]==null];true;Undefined];false;$djsEval[guild.members.fetch("$get[idb]").then(d=>d.nickname);yes]]:yes}
{field:Join Date#COLON#:$memberJoinedDate[$get[idb]]
\`$memberJoinedDate[$get[idb];time]\`:yes}
{field:Creation Date#COLON#:$creationDate[$get[idb]]
\`$creationDate[$get[idb];time]\`:yes}
{field:Roles[$userRoleCount[$get[idb]]]:$replaceText[$replaceText[$checkCondition[$userRoleCount[$get[idb]]==0];true;Undefined];false;$userRoles[$get[idb];mentions;, ]]:yes}
{color:BLUE}]
$let[idb;$findUser[$message]]
$suppressErrors[{author:$userTag[$authorID]:$authorAvatar}{description:$getVar[no] An error occurred, please try again}{color:RED}]
$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.awaitedCommand({
	name: 'userinfo',
	code: `
$if[$isNumber[$message[1]]==true]
$author[$userTag[$get[st]];$userAvatar[$get[st]]]
$thumbnail[$userAvatar[$get[st]]]
$description[
$addField[Roles[$userRoleCount[$get[st]]];$replaceText[$replaceText[$checkCondition[$userRoleCount[$get[st]]==0];true;Undefined];false;$userRoles[$get[st];mentions;, ]];yes]
$addField[Creation Date:;$creationDate[$get[st]]
\`$creationDate[$get[st];time]\`;yes]
$addField[Joined Date:;$memberJoinedDate[$get[st]]
\`$memberJoinedDate[$get[st];time]\`;yes]
$addField[Nickname:;$replaceText[$replaceText[$checkCondition[$djsEval[guild.members.fetch("$get[st]").then(d=>d.nickname);yes]==null];true;Undefined];false;$djsEval[guild.members.fetch("$get[st]").then(d=>d.nickname);yes]];yes]
$addField[Tag:;$discriminator[$get[st]];yes]
$addField[Username:;$username[$get[st]];yes]
$addField[ID;\`$get[st]\`;yes]
]
$color[BLUE]
$let[st;$splitText[$message[1]]]
$textSplit[$getUserVar[userinf];\n]
$elseIf[$toLowercase[$message[1]]==cancel]
$getVar[no] Cancelled
$endElseIf
$else
$getVar[no] Cancelled
$endIf
$suppressErrors[$getVar[no] Cancelled]
$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});
bot.variables({
	Userinf: '0',
	no: 'X'
});

//logs command

//ban command

bot.command({
	name: 'ban',
	code: `$color[RANDOM] 
$author[<:se:881287844767891476>   Banned successfully]
$addField[About:;
Reason:
> $replaceText[$replaceText[$checkCondition[$messageSlice[1]==];true;A reason wasn't provided.];false;$messageSlice[1]]
Date:
> $day $month $year
]
$addField[User information;
$userTag[$findUser[$message[1]]] - $findUser[$message[1]]]
$addField[Moderator;
$userTag - $authorID]
$thumbnail[$userAvatar[$findUser[$message[1]]]]
$ban[$findUser[$message[1]];$userTag: $replaceText[$replaceText[$checkCondition[$messageSlice[1]==];true;A reason wasn't provided.];false;$messageSlice[1]];7]
$if[$memberExists[$findUser[$message[1]]]==true]
$onlyIf[$rolePosition[$highestRole[$findUser[$message[1]]]]>$rolePosition[$highestRole];⛔ - To use this you need to have a higher rank than the mentioned user.]
$onlyIf[$findUser[$message[1]]!=$authorID;**⛔ - You can't ban yourself (Or else, I couldn't find that user)**]
$onlyIf[$findUser[$message[1]]!=$clientID;**⛔ - I can't ban myself, that's ilegal**]
$onlyIf[$findUser[$message[1]]!=$ownerID;**⛔ - I can't ban the owner of the server**]
$elseIf[$memberExists[$findUser[$message[1]]]==false]
$onlyIf[$findUser[$message[1]]!=$authorID;**⛔ - You can't ban yourself (Or else, I couldn't find that user)**]
$endelseIf
$endif
$onlyIf[$isBanned[$findUser[$message[1]]]==false;**⛔ - This user has already been banned on this server**]
$onlyIf[$message!=;**⛔ - Please specify the user you want to ban. Correct usage:** \`prefix ban <@User> [Reason\\]\`
$onlyPerms[ban;**⛔ - To use this you require the \`BAN_MEMBERS\` permission**]
 $onlyBotPerms[ban;**⛔ - I don't have enough perms to execute this command. Permissions missing:** \`BAN_MEMBERS\`] $onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

//unban command

bot.command({
	name: 'unban',
	code: `$unban[$message[1];By $userTag[$authorID] Reason: $sliceMessage[1]]
$username[$message[1]] **has been unbanned ✅**
$onlyBotPerms[ban;**⛔ I don't have ban perms]
$argsCheck[>1;**⛔ Please Provide User ID To Unban**]
$onlyPerms[ban;**⛔ You need ban permission**]
$suppressErrors[**⛔ I can't find that user**] $onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

//kick command

bot.command({
	name: 'kick',
	code: `$kick[$findUser[$message[1]]]
 $title[Kick]
 $description[
 Successfully kicked the user
 **Tag:** $userTag[$findUser[$message[1]]]
 **Mention:** <@$findUser[$message[1]]>
 **ID:** $findUser[$message[1]]]
 $footer[Kicked by $username[$authorID]]
 $addTimestamp
 $color[RANDOM]
$onlyIf[$findUser[$message[1]]!=$clientID;**❌ I can't kick my self**]
$onlyIf[$findUser[$message[1]]!=$authorID;**❌ You can't kick yourself**]
$onlyIf[$rolePosition[$highestRole[$authorID]]<$rolePosition[$highestRole[$findUser[$message[1]]]];**❌ You can't kick someone with higher or the same roles as you**]
$onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$highestRole[$findUser[$message[1]]]];**❌ I can't kick someone with higher or the same roles as me**]
$onlyIf[$memberExists[$findUser[$message[1]]]==true;**❌ Couldn't find a member with this ID/name/mention in the server**]
$onlyIf[$findUser[$message[1]]!=$ownerID;**❌ I can't modify the server owner**]
$onlyIf[$message[1]!=;**❌ Please mention someone to kick**]
$onlyBotPerms[kick;**❌ The bot doesn't have enough permissions**]
$onlyPerms[kick;**❌ You don't have enough permission**] $onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

//system warn command

bot.command({
	name: 'warn',
	code: `
$color[RANDOM]
$title[Warned]
$description[**$username** has warned **$username[$mentioned[1;yes]]** for \`$noMentionMessage\`
he now has \`$getUserVar[warn;$findUser[$message]]\` Warnings
]
$setUserVar[reason;$getUserVar[reason;$mentioned[1]]/**$date+:$hour:$minute:$second**+> $noMentionMessage+;$mentioned[1]]
$setUserVar[warn;$sum[$getUserVar[warn;$mentioned[1]];1];$mentioned[1]]
$onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$highestRole[$mentioned[1;yes]]];**⛔ That user is higher than me on role position**]
$onlyIf[$rolePosition[$highestRole[$authorID]]<$rolePosition[$highestRole[$mentioned[1;yes]]];**⛔ That user is higher/equal than you on role position**]
$onlyIf[$message[2]!=;**⛔ Provide a reason**]
$onlyIf[$mentioned[1]!=;**⛔ Mention the user you want to warn and provide a reason**]
$onlyIf[$mentioned[1]!=$ I'yourself**]
$onlyIf[$isBot[$mentioned[1;yes]]!=true;**⛔ You can't warn a bot**]
$onlyBotPerms[manageroles;⛔ **I don't have** \`MANAGAGE_ROLES\` perms]
$onlyPerms[manageroles;⛔ **You don't have** \`MANAGAGE_ROLES\` perms] $onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.command({
	name: 'warnings',
	code: `$color[RANDOM]
$title[Warnings]
$description[
**$username[$mentioned[1;yes]]** has
\`$getUserVar[warn;$findUser[$message]]\` warnings
 
**Warnings User**
<@$mentioned[1;yes]> 
(\`$mentioned[1;yes]\`)]
$onlyIf[$getUserVar[warn;$findUser[$message]]>0;**⛔ The warnings of this user is already at 0**]
$onlyIf[$mentioned[1]!=;**⛔ You must mention someone**]
$onlyIf[$isBot[$mentioned[1;yes]]!=true;**⛔ You can't warn a bot, so they don't have warnings**] $onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.command({
	name: 'unwarn',
	code: `
$color[RANDOM]
$title[Removed Warn]
$description[**$username** has removed a warn from **$username[$mentioned[1;yes]]** 
he now has \`$getUserVar[warn;$findUser[$message]]\` Warnings]
$setUserVar[warn;$sub[$getUserVar[warn;$findUser[$message]];1];$findUser[$message]]
$removeSplitTextElement[$getTextSplitLength]
$onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$highestRole[$mentioned[1;yes]]];**⛔ That user is higher than me on role position**]
$onlyIf[$rolePosition[$highestRole[$authorID]]<$rolePosition[$highestRole[$mentioned[1;yes]]];**⛔ That user is higher/equal than you on role position**]
$onlyIf[$getUserVar[warn;$findUser[$message]]>0;**⛔ The Warnings of this User is already at 0**]
$onlyIf[$mentioned[1]!=$authorID;**⛔ You can't unwarn yourself**]
$onlyIf[$mentioned[1]!=;**⛔ You must mention someone**, Correct usage: \`prefix unwarn <@user>\`]
$onlyPerms[manageroles;⛔ **I don't have** \`MANAGAGE_ROLES\` perms**]
$onlyBotPerms[manageroles;⛔ **I don't have** \`MANAGAGE_ROLES\` perms**] $onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});
bot.variables({
	warn: '0',
	reason: '0'
});

//ticket command

bot.command({
	name: 'setup',
	code: `
 $awaitMessages[$authorID;30s;everything;tsp2;Command has been cancelled]
 $sendMessage[**Which Category Do you want to make For Ticket System.
 Provide the Category ID. 
 This Command will be cancelled after** \`30 seconds\`.;no]
 $onlyPerms[admin;Only Users with \`ADMIN\` perms can use this{delete:10s}]
 $suppressErrors[] $onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.awaitedCommand({
	name: 'tsp2',
	code: `
**✅ Setup ticket is complete**
 $setServerVar[ticketchannel;$message]
 $onlyIf[$channelExists[$message]==true;Provided Category Doesn't Exist{delete:10s}]
 $onlyIf[$isNumber[$message]==true;Please provide Category ID{delete:10s}]`
});

bot.command({
	name: 'ticket',
	code: `
$newTicket[ticket-$username[$authorID];{title:Ticket opened!}{description:Hello, <@$authorID>. Here is your ticket!:tickets: Please give the information about your problem or feedback. 
Thanks in advance for being patient}{footer:Use $getServerVar[Prefix]close to close your ticket};$getServerVar[ticketchannel];no;<@$authorID>, I failed to create your ticket! Try again]
$sendMessage[Ticket Successfully opened! Hello, <@$authorID>. Go to **$toLowercase[#$username$discriminator]** to describe your issue!;Something went wrong] $onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.command({
	name: 'close',
	code: `
$closeTicket[This is not a ticket]
$onlyIf[$checkContains[$channelName;ticket]==true;This command can only be used in  tickets{delete:10s}]
$suppressErrors $onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted`
});

bot.variables({
	ticketchannel: ''
});

//role command

bot.command({
	name: 'removerole',
	code: `$color[RANDOM]
$takeRoles[$mentioned[1];$mentionedRoles[1]]
$title[Removed role]
$description[**$username** has taken <@&$mentionedRoles[1]> **role to** $username[$mentioned[1;yes]]]
$onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$highestRole[$mentioned[1;yes]]];**⛔ That user is higher than me on role position**]
$onlyIf[$rolePosition[$highestRole[$authorID]]<$rolePosition[$highestRole[$mentioned[1;yes]]];**⛔ That user is higher/equal than you on role position**]
$onlyIf[$mentionedRoles[1]!=;⛔ **Mention a role**]
$onlyIf[$mentioned[1]!=;**⛔ You must mention someone**]
$onlyBotPerms[manageroles;⛔ **I don't have** \`MANAGAGE_ROLES\` perms]
$onlyPerms[manageroles;⛔ **You don't have** \`MANAGAGE_ROLES\` perms]$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.command({
	name: 'giverole',
	code: `$color[RANDOM]
$giveRoles[$mentioned[1];$mentionedRoles[1]]
$title[Role given]
$description[**$username** has given <@&$mentionedRoles[1]> **role to** $username[$mentioned[1;yes]]]
$onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$highestRole[$mentioned[1;yes]]];**⛔ That user is higher than me on role position**]
$onlyIf[$rolePosition[$highestRole[$authorID]]<$rolePosition[$highestRole[$mentioned[1;yes]]];**⛔ That user is higher/equal than you on role position**]
$onlyIf[$mentionedRoles[1]!=;⛔ **Mention a role**]
$onlyIf[$mentioned[1]!=;**⛔ You must mention someone**]
$onlyBotPerms[manageroles;⛔ **I don't have** \`MANAGAGE_ROLES\` perms$onlyPerms[manageroles;⛔ **You don't have** \`MANAGAGE_ROLES\` perms]
$onlyPerms[manageroles;⛔ **You don't have** \`MANAGAGE_$onlyPerms[manageroles;⛔ **You don't have** \`MANAGAGE_ROLES\` perms]
$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

//blacklist command

bot.command({
	name: 'blacklist',
	code: `$setGlobalUserVar[Blacklist;true;$mentioned[1]]
**$username[$mentioned[1]]#$discriminator[$mentioned[1]] you are blacklisted now**
$onlyIf[$mentioned[1]!=;You must mention someone]
$onlyIf[$mentioned[1]!=$authorID;**⛔ You can't blacklist yourself**]
$onlyForIDs[840980840258600971;**⛔ Only the owner can use this command**]`
});

bot.command({
	name: 'unblacklist',
	code: `$setGlobalUserVar[Blacklist;false;$mentioned[1]]
**$username[$mentioned[1]]#$discriminator[$mentioned[1]] ✅ You are no longer on the blacklist**
$onlyIf[$mentioned[1]!=;You must mention someone]
$onlyIf[$mentioned[1]!=$authorID;**⛔ You can't blacklist yourself, so you can't unblacklist yourself**]
$onlyForIDs[840980840258600971;**⛔ You are not the owner**]`
});
bot.variables({
	Blacklist: 'false'
});

//guess number command
bot.command({
	name: 'guess-number',
	aliases: 'gn',
	code: `$title[Guess The Number Winning Number]
$description[The winning number for GTN is $getservervar[winning_number].]
$onlyPerms[manageserver;You need to be an manage server to use this.]
$suppressErrors
$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.command({
	name: 'gtnstats',
	aliases: ['gtns'],
	code: `$title[Guess The Number Stats]
$description[GTN commands: disableGtn, gtnstats, gtn]
$addField[GTN Status;$getservervar[gtnstatus];yes]
$addField[GTN Channel;<#$getservervar[guess_the_number_channel]>;yes]
$addField[Wins;$getglobaluservar[gtnwins;$findmember[$message]];yes]
$addField[Total Attempts/Wins;$getglobaluservar[gtnattempts;$findmember[$message]];yes]
$thumbnail[$useravatar[$findmember[$message]]]
$suppressErrors
$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.command({
	name: 'guessthenumber',
	aliases: ['gtn'],
	code: `$setservervar[winning_number;$random[$message[1];$message[2]]]
$setservervar[guess_the_number_channel;$channelid]
$setservervar[gtn;true]
$setservervar[n1;$message[1]]
$setservervar[n2;$message[2]]
$setservervar[gtnstatus;There is an ongoing game of GTN in <#$channelID>]
$author[Guess the number!;$servericon]
$title[Alrighty!]
$description[I have got the number in mind. I have DMed you the number.]
$color[BLUE]
$channelSendMessage[$channelID;Guess the number has started! The number is from __$message[1] to $message[2]__. Good luck everybody!]
$sendDM[$authorID;The number for Guess The Number is $random[$message[1];$message[2]].
__Why are you getting this DM?__
You started a Guess The Number event in your server $servername.]
$onlyif[$isuserdmenabled==true;Your DMs are disabled. but the number is $random[$message[1];$message[2]]. Keep that number somewhere safe! {delete:5s}]
$onlyif[$message[1]<$message[2];You have provided the wrong input, please make sure the first number is the min number and the second the max number.]
$onlyif[$message[2]>=5;The max number has to be at least 5!]
$onlyif[$checkcontains[$message;q;w;e;r;t;y;u;i;o;p;a;s;d;f;g;h;j;k;lz;x;c;v;b;n;m]==false;You only need to use numbers as input.]
$argscheck[>2;Please provide a min number and a max number]
$onlyperms[manageserver;you don't have the manageserver permission]
$suppressErrors
$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.command({
	name: '$alwaysExecute',
	code: `$setservervar[winning_number;Ended. start again with the gtn command.]
$setglobaluserVar[gtnwins;$sum[$getglobaluserVar[gtnwins];1]]
$setservervar[gtntries;0]
$setservervar[gtnstatus;Unfortunately, the last GTN round has ended.]
$setservervar[gtn;false]
$title[$randomText[Winner winner, chicken dinner.;Well well well.;We have a winner!;Congratulations!;You have won the GTN Event.;Woah, great job!;We're proud of you;Guess The Number has ended.;GTN;Woop woop.]]
$description[Looks like we have a winner..]
$addField[Correct Number;$getservervar[winning_number];yes]
$addField[Winner;$usertag;yes]
$addField[Tries;$getServerVar[gtntries];yes]
$color[BLUE]
$thumbnail[$authoravatar]
$footer[Guess The Number! +1 gtn wins added. Check stats with the gtnStats command!]
$onlyif[$message[1]==$getservervar[winning_number];Wrong number $usertag, it's not $message]
$setServerVar[gtntries;$sum[$getServerVar[gtntries];1]]
$setglobaluserVar[gtnattempts;$sum[$getglobaluserVar[gtnattempts];1]]
$onlyif[$message[1]>=$getservervar[n1];The number is a random number from $getservervar[n1] to $getservervar[n2]. You provided a number smaller than $getservervar[n1].]
$onlyif[$message[1]<=$getservervar[n2];The number is a random number from $getservervar[n1] to $getservervar[n2]. You provided a number bigger than $getservervar[n2].]
$onlyif[$getservervar[winning_number]!=Ended. start again with the gtn command.;Looks like the last gtn has ended, you will have to get a staff to re-set it up.]
$onlyif[$isNumber[$message]==true;]
$onlyif[$channelid==$getservervar[guess_the_number_channel];]
$onlyIf[$getservervar[gtn]==true;]
$suppressErrors`
});

bot.command({
	name: 'disable-guessthenumber',
	aliases: 'dgtn',
	code: `Disabled.
$setservervar[gtntries;0]
$setservervar[guess_the_number_channel;Not set]
$setservervar[winning_number;0]
$suppressErrors
$onlyperms[manageserver;No thanks, you don't have the manageserver permission]$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});
bot.variables({
	guess_the_number_channel: '',
	winning_number: '',
	gtntries: '0',
	gtn: 'false',
	gtnwins: '0',
	gtnattempts: '0',
	gtnstatus: 'No ongoing game.',
	n1: '',
	n2: ''
});

//set prefix command
bot.command({
	name: 'setprefix',
	code: `
$description[my new prefix on the server is \`$message\`, now use! \`$messagehelp\`]
$footer[prefix changed to @$username]
$color[RANDOM]
$addTimestamp
$setServerVar[Prefix;$message]
$argsCheck[>1;Use: \`prefix setprefix <NewPrefix>\`]
$onlyPerms[manageserver;you need permission to manage server!]`
});

bot.variables({
	Prefix: 's/'
});

//reload command

//mute command

bot.command({
	name: 'setmuterole',
	aliases: 'muterole',
	usage: '`$getServerVar[Prefix]setmuterole <role>`',
	description: 'Sets the specified role as the muterole of the server.',
	category: 'Moderation',
	code: `$setServerVar[mute;$findRole[$message]]
$title[Mute Role Set!!]
$description[$username set <@&$findRole[$message]> as the mute role!!]
$thumbnail[$authorAvatar]
$color[RANDOM]
$addTimestamp
$onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$findRole[$message]];**⛔ That role is higher/equal than me on role position!!**]
$onlyIf[$roleExists[$findRole[$message]]==true;Please specify a valid role!!]
$onlyIf[$getServerVar[mute]==;**⛔ Your mute role is already set to <@&$getServerVar[mute]>.Please reset that for setting a new mute role!!**]
$onlyIf[$message!=;**⛔ Please specify a role for setting it as mute role!!**]
$onlyPerms[manageserver;You dont have \`MANAGE SERVER\` perms to perform this action!!]$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});
bot.variables({
	mute: '0'
});

bot.command({
	name: 'resetmute',
	aliases: 'rmrole',
	usage: '`$getServerVat[Prefix]resetmute`',
	description: 'Resets the mute system of the server.',
	category: 'Moderation',
	code: `$setServerVar[mute;]
$title[Reset MuteRole]
$description[**$userTag[$authorID]** has reset the mute role of this server!!]
$thumbnail[$authorAvatar]
$color[RANDOM]
$addTimestamp
$onlyIf[$getServerVar[mute]!=;**⛔ Your mute role is already reset. Please set it first to reset it again!!**]
$onlyPerms[manageserver;**⛔ You dont have \`MANAGE SERVER\` perms to perform this action!!**]$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.command({
	name: 'mute',
	aliases: 'muted',
	usage: '`$getServerVar[Prefix]mute <user> (reason)`',
	description: 'Mutes the specified user. Reason is optional.',
	category: 'Moderation',
	code: `$giveRoles[$findUser[$message[1]];$findRole[$getServerVar[mute]]]
$title[Muted $userTag[$findUser[$message[1]]]]
$description[**$username** **has muted** $userTag[$findUser[$message[1]]]
**Reason:** $message[2]]
$color[RANDOM]
$onlyIf[$roleExists[$findRole[$getServerVar[mute]]]==true;<@$authorID>,**⛔ Please set a mute role first!!**]
$onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$findRole[$getServerVar[mute]]];**⛔ Cant mute that user as the mute role is higher/equal than me on role position!!**]
$onlyIf[$rolePosition[$highestRole[$authorID]]<$rolePosition[$findRole[$getServerVar[mute]]];**⛔ You cant mute as the role is higher/equal than your highest role position!!**]
$onlyIf[$rolePosition[$highestRole[$authorID]]<$rolePosition[$highestRole[$findUser[$message[1]]]];**⛔ That user is higher/equal than you on role position!!**]
$onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$highestRole[$findUser[$message[1]]]];**⛔ That user is higher/equal than me on role position!!**]
$onlyIf[$findUser[$message[1];no]!=undefined;**⛔ Please specify a valid user!!**]
$onlyIf[$message[1]!=;**⛔ Please specify a user!! To mute a user type \`$getServerVar[Prefix]mute <user> <reason>\`**]
$onlyBotPerms[manageroles;**⛔ I don't have \`MANAGAGE_ROLES\` perms!!**]
$onlyPerms[manageroles;**⛔ You don't have \`MANAGAGE_ROLES\` perms!!**]
$onlyIf[$getServerVar[mute]!=;**⛔ You have not set a \`mute\` role. Please set it by typing \`$getServerVar[Prefix] setmuterole\`.**]$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.command({
	name: 'unmute',
	usage: '`$getServerVar[Prefix]unmute <user> (reason)`',
	description: 'Unmutes the specified user.',
	category: 'Moderation',
	code: `$takeRoles[$findUser[$message[1]];$findRole[$getServerVar[mute]]]
$title[UnMuted $userTag[$findUser[$message[1]]]]
$description[**$username** **has unmuted** $userTag[$findUser[$message[1]]]
**Reason:** $message[2]]
$color[RANDOM]
$onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$findRole[$getServerVar[mute]]];**⛔ Cant unmute that user as the mute role is higher/equal than me on role position!!**]
$onlyIf[$rolePosition[$highestRole[$authorID]]<$rolePosition[$findRole[$getServerVar[mute]]];**⛔ You cant unmute as the role is higher/equal than your highest role position!!**]
$onlyIf[$rolePosition[$highestRole[$authorID]]<$rolePosition[$highestRole[$findUser[$message[1]]]];**⛔ That user is higher/equal than you on role position!!**]
$onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$highestRole[$findUser[$message[1]]]];**⛔ That user is higher/equal than me on role position!!**]
$onlyIf[$findUser[$message[1];no]!=undefined;**⛔ Please specify a valid user!!**]
$onlyIf[$message[1]!=;**⛔ Please specify a user!! To unmute a user type \`$getServerVar[Prefix]unmute <user> <reason>\`**]
$onlyBotPerms[manageroles;**⛔ I don't have \`MANAGAGE_ROLES\` perms!!**]
$onlyPerms[manageroles;**⛔ You don't have \`MANAGAGE_ROLES\` perms!!**]
$onlyIf[$getServerVar[mute]!=;**⛔ You have not set a \`mute\` role. Please set it by typing \`$getServerVar[Prefix] setmuterole\`.**]$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.command({
	name: 'tempmute',
	aliases: 'tmute',
	usage: '`$getServerVar[Prefix]tempmute <user> <time>`',
	description: 'Mutes the specified user temporarily for the time specified.',
	category: 'Moderation',
	code: `$channelSendMessage[$channelID;<@$findUser[$message[1]]>, I unmuted you, time's up]
$takeRoles[$findUser[$message[1]];$findRole[$getServerVar[mute]]]
$wait[$replaceText[$replaceText[$checkCondition[$message[2]==];true;24d];false;$message[2]]]
$channelSendMessage[$channelID;{description::white_check_mark: | $userTag[$findUser[$message[1]]] has been muted by $userTag[$authorID]
For \`$replaceText[$replaceText[$checkCondition[$message[2]==];true;undefined time];false;$message[2]]\`}{color:RANDOM}]
$giveRoles[$findUser[$message[1]];$findRole[$getServerVar[mute]]]
$suppressErrors[{title:An error occured}{description:Looks like I can't find the role}{color:RED}]
$onlyIf[$rolePosition[$highestRole[$clientID]]<$rolePosition[$findRole[$getServerVar[mute]]];**⛔ Cant perform the action as the mute role is higher/equal than me on role position!!**]
$onlyIf[$rolePosition[$highestRole[$authorID]]<$rolePosition[$highestRole[$findUser[$message[1]]]];**⛔ You cant mute someone who is higher/equal than you on role position!!**]
$onlyIf[$rolePosition[$highestRole[$authorID]]<$rolePosition[$findRole[$getServerVar[mute]]];**⛔ You cant mute someone as the mute role is higher/equal than you on role position!!**]
$onlyIf[$roleExists[$findRole[$getServerVar[mute]]]==true;**⛔ You have not set a mute role!! Set it by typing \`$getServerVar[Prefix] setmuterole <role>\`!!**]
$onlyIf[$userExists[$findUser[$message[1];no]]==true;**⛔ Please specify a valid user!!**]
$onlyIf[$message[1]!=;**⛔ Specify a user whom you want to mute!!**]
$onlyBotPerms[manageroles;{title:Missing Permissions}{color:RANDOM}{description:I don't have \`MANAGE_ROLES\` permissions to use this command}]
$onlyPerms[manageroles;{title:Missing Permissions}{color:RANDOM}{description:You don't have \`MANAGE_ROLES\` permissions to use this command}]$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

//custom command
bot.command({
	name: 'add-cmd',
	code: `
$setservervar[ccmd;$replacetext[$replacetext[$checkcondition[$getservervar[ccmd]!=];false;$tolowercase[$message[1]]/];true;$getservervar[ccmd]$tolowercase[$message[1]]/]]
$setservervar[cdes;$getservervar[cdes]$messageslice[1;10]/]
Successfully added $replacetext[$replacetext[\`$tolowercase[$message[1]]\`;#right_click#;>];#left_click#;<] to the commands list, type \`$getServerVar[Prefix] cmd-list\` to see all available commands
$onlyif[$findtextsplitindex[$tolowercase[$message[1]]]==0;{description:Command \`$tolowercase[$message[1]]\` is available in the command list}{color:ff2050}]
$textsplit[$getservervar[ccmd];/]
$onlyif[$checkcontains[$message;#RIGHT#;#LEFT#;#RIGHT_BRACKET#;#LEFT_BRACKET#;/]==false;{description:Please don't use it \`symbol\` for trigger and response}{color:ff2050}]

$argscheck[>2;{description:Correct use \n\`\`\`\n$getServerVar[Prefix] add-cmd <trigger> <response>\n\`\`\`}{color:ff2050}]$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.command({
	name: 'del-cmd',
	code: `
$setservervar[ccmd;$replacetext[$getservervar[ccmd];$advancedtextsplit[$getservervar[ccmd];/;$findtextsplitindex[$tolowercase[$message]]]/;]]
$setservervar[cdes;$replacetext[$getservervar[cdes];$advancedtextsplit[$getservervar[cdes];/;$findtextsplitindex[$tolowercase[$message]]]/;]]
Successfully cleared command $replacetext[$replacetext[\`$tolowercase[$message[1]]\`;#right_click#;>];#left_click#;<]
$onlyif[$findtextsplitindex[$tolowercase[$message]]!=0;{description:Command \`$tolowercase[$message]\` not available in the command list}{color:ff2050}]
$textsplit[$getservervar[ccmd];/]
$onlyif[$checkcontains[$message;#RIGHT#;#LEFT#;#RIGHT_BRACKET#;#LEFT_BRACKET#;/]==false;{description:Please don't use it \`symbol\` for trigger and response}{color:ff2050}]
$argscheck[>1;{description:Correct use \n\`\`\`\n$getservervar[Prefix]del-cmd <trigger>\n\`\`\`}{color:ff2050}]$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]
`
});

bot.command({
	name: 'cmd-list',
	code: `
$title[**__Custom Commands__**]
$color[RANDOM]
$thumbnail[$servericon]
$description[\`$replacetext[$replacetext[$replacetext[$getservervar[ccmd];#right_click#;>];#left_click#;<];/;, ]\`]
$addtimestamp
$onlyif[$gettextsplitlength>=2;{description:There are no custom commands on the server \`$servername\`}{color:ff2050}]
$textsplit[$getservervar[ccmd];/]$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**] 
`
});
bot.command({
	name: '$alwaysExecute',
	code: `
$advancedtextsplit[$getservervar[cdes];/;$findtextsplitindex[$tolowercase[$message]]]
$onlyif[$findtextsplitindex[$tolowercase[$message]]!=0;]
$onlyif[$isbot[$authorid]==false;]
$textsplit[$getservervar[ccmd];/]
`
});

bot.command({
	name: 'del-all-cmd',
	aliases: 'del-acmd',
	code: `$title[del all commands]
 $description[cleared all commands correctly]
 $color[RANDOM]
 $resetservervar[ccmd]
 $addtimestamp`
});

bot.variables({
	ccmd: '',
	cdes: ''
});

//join command//

bot.command({
	name: 'set-join',
	aliases: ['set-welcome', 'welcome-on', 'join-on'],
	code: `$onlyPerms[managechannels;you need to be able to manage the channels]
$argsCheck[> 1;correct use \`$getServerVar[Prefix]set-join <#channel>\`]
$setServerVar[wChannel;$mentionedChannels[1]]
\`joins successfully activated in \`<#$mentionedChannels[1]>
$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]
`
});

bot.command({
	name: 'set-joinmsg',
	aliases: ['setmsg-joins', 'set-welcomemsg', 'setmsg-welcome'],
	code: `$onlyPerms[managechannels;you need to be able to manage channels]
	$argsCheck[> 1;correct use \`$getServerVar[Prefix]set-joinmsg <message>\`]
$onlyIf[$getServerVar[wChannel]!=;there is no established channel first use \`$getServerVar[Prefix]set-join <#channel>\`]
	$setServerVar[wMessage;$message]
	excellent now you can use \`$getServerVar[Prefix]join-test\`
	$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.command({
	name: 'join-test',
	code: `$onlyIf[$getServerVar[wChannel]!=;there is no established channel first use \`$getServerVar[Prefix]set-join <#channel>\`]
	$onlyIf[$getServerVar[wMessage]!=;I don't know a message has been set first use \`$getServerVar[Prefix]set-joinmsg <message>\`]
	Channel: <#$getServerVar[wChannel]>
	
	
	Message: **$getServerVar[wMessage]**
	$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
});

bot.command({
	name: "reset-joinmsg",
	aliases: ["re-joinmsg", "joinmsg-reset", "msg-joinr"],
	code:`$resetServerVar[wMessage]
	$onlyIf[$getServerVar[wChannel]!=;there is no established channel first use \`$getServerVar[Prefix]set-join <#channel>\`]
	$onlyIf[$getServerVar[wMessage]!=;I don't know a message has been set first use \`$getServerVar[Prefix]set-joinmsg <message>\`]
	\`message reset correctly\`
	$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
	
})

bot.joinCommand({
	channel: '$getServerVar[wChannel]',
	code: `$getServerVar[wMessage]`
})
bot.onJoined()

bot.variables({
	wChannel: '',
	wMessage: ''
});


//welcome command//

//giveaway command//

bot.command({
    name: "giveaway",
    code: `
$if[$message==]
$author[$userTag[$authorID];$authorAvatar]
$title[Giveaway options]
$description[
$addField[End;End a giveaway using a message ID or URL
> \`giveaway end <message ID/URL>\`;yes]
 
$addField[Reroll;Reroll giveaway using a message ID or URL
> \`giveaway reroll <message ID/URL>\`;yes]
 
$addField[Start;Start a giveaway
> \`giveaway start <prize>?-<description>?-<time>\`;yes]
]
$color[BLUE]
$elseIf[$toLowercase[$message[1]]==start]
$setTimeout[$get[replace];messageID: $get[id]
channelID: $channelID
guildID: $guildID
description: $splitText[2]
prize: $get[replace2]
time: $get[time]]
$setMessageVar[giveawayisgiveaway;true;$get[id]]
$setMessageVar[giveawaytime;$get[time];$get[id]]
$setMessageVar[giveawaydescription;$splitText[2];$get[id]]
$setMessageVar[giveawayprize;$get[replace2];$get[id]]
$setMessageVar[giveawaychannelid;$channelID;$get[id]]
$setMessageVar[giveawayguildid;$guildID;$get[id]]
$let[id;$sendMessage[{author:$userTag[$authorID]:$authorAvatar}
{title:A giveaway has been started!}
{field:Prize#COLON#:\`$get[replace2]\`:yes}
{field:Description#COLON#:$splitText[2]:yes}
{field:Time#COLON#:<t#COLON#$get[time]#COLON#R> <t#COLON#$get[time]#COLON#T>:yes}
{footer:React with 🔵 to participate}
{timestamp}
{color:BLUE}
{reactions:🔵};yes]]
$let[time;$truncate[$divide[$djsEval[$ms[$get[replace]] + $dateStamp;yes];1000]]]
$onlyIf[$djsEval[require('ms')("$get[replace]") ? true : false;yes]==true;{author:$userTag[$authorID]:$authorAvatar}
{description:$get[no] Invalid \`<time>\` argument given.
 
Usage:
$get[usage]}
{color:RED}]
$onlyIf[$splitText[2]!=;$get[err]]
$onlyIf[$get[replace2]!=;$get[err]]
$let[replace2;$advancedTextSplit[$messageSlice[1];?-;1]]
$let[replace;$djsEval["$replaceText[$splitText[3]; ;]" || '1 hour';yes]]
$let[err;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] Too few arguments given.
 
Usage:
$get[usage]
$let[usage;\`giveaway start <prize>?-<description>?-<time>\`]}
{color:RED}]
$textSplit[$message;?-]
$endElseIf
$elseIf[$toLowercase[$message[1]]==reroll]
$replaceText[$replaceText[$checkCondition[$get[st]==$clientID];true;Nobody];false;<@$get[st]> has] won the giveaway!
$author[$userTag[$get[st]];$userAvatar[$get[st]]]
$title[A giveaway has been rerolled!;https://discord.com/channels/$getMessageVar[giveawayguildid;$get[id]]/$getMessageVar[giveawaychannelid;$get[id]]/$get[id]]
$description[
$addField[Time:;<t:$getMessageVar[giveawaytime;$get[id]]:R> <t:$getMessageVar[giveawaytime;$get[id]]:T>;yes]
 
$addField[Description:;$getMessageVar[giveawaydescription;$get[id]];yes]
 
$addField[Prize:;\`$getMessageVar[giveawayprize;$get[id]]\`;yes]
]
$addTimestamp
$color[BLUE]
$let[st;$splitText[$get[random]]]
$let[random;$djsEval[Math.floor(Math.random() * $getTextSplitLength) + 1;yes]]
$textSplit[$getMessageVar[giveawayparticipants;$get[id]]; ]
$onlyIf[$getMessageVar[giveawayisfinished;$get[id]]==true;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] Please wait until giveaway [$get[id]](https://discord.com/channels/$getMessageVar[giveawayguildid;$get[id]]/$getMessageVar[giveawaychannelid;$get[id]]/$get[id]) ends, or do \`$getServerVar[Prefix]giveaway end $get[id]\` to end.}
{color:RED}]
$onlyIf[$getMessageVar[giveawayisgiveaway;$get[id]]==true;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] \`$get[id]\` is not a valid giveaway}
{color:RED}]
$let[id;$replaceText[$replaceText[$checkCondition[$get[split]==];true;$message[2]];false;$get[split]]]
$onlyIf[$get[if]==true;$get[err]]
$onlyIf[$message[2]!=;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] Too few arguments given.
 
Usage:
\`$get[usage]\`}
{color:RED}]
$let[if;$replaceText[$replaceText[$checkCondition[$isNumber[$message[2]]==true];true;$checkCondition[$charCount[$message[2]]==18]];false;$replaceText[$replaceText[$checkCondition[$isNumber[$get[split]]==true];true;$checkCondition[$charCount[$get[split]]==18]];false;false]]]
$let[split;$advancedTextSplit[$message[2];//;2;/;5]]
$let[err;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] Invalid \`<message ID/URL>\` given.
 
Usage:
$get[usage]}
{color:RED}]
$let[usage;\`giveaway reroll <message ID/URL>\`]
$endElseIf
$elseIf[$toLowercase[$message[1]]==end]
$setMessageVar[giveawaytime;$get[time];$get[id]]
$setMessageVar[giveawayisfinished;true;$get[id]]
$setMessageVar[giveawayparticipants;$get[participants];$get[id]]
$replaceText[$replaceText[$checkCondition[$get[st]==$clientID];true;Nobody];false;<@$get[st]> has] won the giveaway!
$author[$userTag[$get[st]];$userAvatar[$get[st]]]
$title[A giveaway has been ended!;https://discord.com/channels/$getMessageVar[giveawayguildid;$get[id]]/$getMessageVar[giveawaychannelid;$get[id]]/$get[id]]
$description[
$addField[Time:;<t:$get[time]:R> <t:$get[time]:T>;yes]
 
$addField[Description:;$getMessageVar[giveawaydescription;$get[id]];yes]
 
$addField[Prize:;\`$getMessageVar[giveawayprize;$get[id]]\`;yes]
]
$addTimestamp
$color[BLUE]
$let[time;$truncate[$divide[$datestamp;1000]]]
$let[st;$splitText[$get[random]]]
$let[random;$djsEval[Math.floor(Math.random() * $getTextSplitLength) + 1;yes]]
$textSplit[$get[participants]; ]
$let[participants;$replaceText[$replaceText[$getReactions[$getMessageVar[giveawaychannelid;$get[id]];$get[id];🔵;id];$clientID,;];,; ]]
$onlyIf[$getMessageVar[giveawayisfinished;$get[id]]==false;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] Giveaway [$get[id]](https://discord.com/channels/$getMessageVar[giveawayguildid;$get[id]]/$getMessageVar[giveawaychannelid;$get[id]]/$get[id]) has already been ended}
{color:RED}]
$onlyIf[$getMessageVar[giveawayisgiveaway;$get[id]]==true;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] \`$get[id]\` is not a valid giveaway}
{color:RED}]
$let[id;$replaceText[$replaceText[$checkCondition[$get[split]==];true;$message[2]];false;$get[split]]]
$onlyIf[$get[if]==true;$get[err]]
$onlyIf[$message[2]!=;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] Too few arguments given.
 
Usage:
\`$get[usage]\`}
{color:RED}]
$let[if;$replaceText[$replaceText[$checkCondition[$isNumber[$message[2]]==true];true;$checkCondition[$charCount[$message[2]]==18]];false;$replaceText[$replaceText[$checkCondition[$isNumber[$get[split]]==true];true;$checkCondition[$charCount[$get[split]]==18]];false;false]]]
$let[split;$advancedTextSplit[$message[2];//;2;/;5]]
$let[err;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] Invalid \`<message ID/URL>\` given.
 
Usage:
$get[usage]}
{color:RED}]
$let[usage;\`giveaway end <message ID/URL>\`]
$endElseIf
$endIf
$onlyBotPerms[addreactions;{author:$userTag[$authorID]:$auhorAvatar}
{description:$getVar[no] I dont have the permission to use this command.
 
Missing:
\`add reactions\`}
{color:RED}]
$onlyPerms[managechannels;{author:$userTag[$authorID]:$authorAvatar}
{description:$getVar[no] You dont have the permission to use this command.
 
Missing:
\`manage channels\`}
{color:RED}]
$onlyIf[$getGlobalUserVar[Blacklist;$authorID]==false;**⛔ You are blacklisted**]`
})
 
bot.timeoutCommand({
    code: `
$setMessageVar[giveawayisfinished;true;$get[id]]
$setMessageVar[giveawayparticipants;$get[participants];$get[id]]
$channelSendMessage[$timeoutData[channelID];$replaceText[$replaceText[$checkCondition[$get[st]==$clientID];true;Nobody];false;<@$get[st]> has] won the giveaway!
{author:$userTag[$get[st]]:$userAvatar[$get[st]]}
{title:A giveaway has ended!}
{url:https://discord.com/channels/$timeoutData[guildID]/$timeoutData[channelID]/$get[id]}
{field:Prize#COLON#:\`$timeoutData[prize]\`:yes}
{field:Description#COLON#:$timeoutData[description]:yes}
{field:Time#COLON#:<t#COLON#$timeoutData[time]#COLON#R> <t#COLON#$timeoutData[time]#COLON#T>:yes}
{timestamp}
{color:BLUE}]
$let[id;$timeoutData[messageID]]
$let[st;$splitText[$get[random]]]
$let[random;$djsEval[Math.floor(Math.random() * $getTextSplitLength) + 1;yes]]
$textSplit[$get[participants]; ]
$let[participants;$replaceText[$replaceText[$getReactions[$timeoutData[channelID];$timeoutData[messageID];🔵;id];$clientID,;];,; ]]
$onlyIf[$getMessageVar[giveawayisfinished;$timeoutData[messageID]]==false;]
`
})

bot.variables({
	giveawaychannelid: 0,
giveawayguildid: 0,
giveawayprize: "",
giveawaydescription: "",
giveawaytime: 0,
giveawayparticipants: "",
giveawayisfinished: "false",
giveawayisgiveaway: "false",
no: "❌"
})
