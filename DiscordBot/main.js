// Default invite: ç

// INITIATIONS & CONSTANTS
const Discord  = require('discord.js');
const fs = require('fs')
const { Client, GatewayIntentBits, REST, Routes, quote } = require('discord.js');
const { request } = require('undici');

allTokens = importTokens();
const TOKEN = allTokens[0]
const CLIENT_ID = allTokens[1]
const GUILD_ID = allTokens[2]

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
  ]
})

const rest = new REST({ version: '10' }).setToken(TOKEN);

// Functions:
function randomNum(n) {
    return String(Math.floor(Math.random() * (n) ));
}

function textFile(a) {
    let text = fs.readFileSync(''+ a + '_words.txt','utf8')
    text = text.split('\n')

    for (i = 0; i < text.length; i ++) {
        text[i] = text[i].trim()
    }
    return text
}

function importTokens() {
    let raw = fs.readFileSync('tokens.txt', 'utf8')
    let holder = raw.split(' ')

    return holder
}

// // // // // // // // // // // // // //

client.once('ready', () => {

    console.log('###########################################')
    console.log('JortBot is online, all vitals nominal.')
    console.log('Bot created by zuofx')
    console.log('http://github.com/zuofx')
    console.log('https://github.com/zuofx/JortBot')
    console.log('###########################################')

})

async function main() {
    const commands = [
        {
            name: 'newdj',
            description: 'get a new dj!',
        },
        {
            name: 'lennyorban',
            description: 'Lenny or ban? Lets see.'
        },
        {
            name: 'quote',
            description: 'Get a random quote!'
        },
        {
            name: 'coinflip',
            description: 'Flip a coin',
        },
        {
            name: 'help',
            description: 'List commands'
        }
    ];

    try{
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        
    } catch (err) {
        console.log(err)
    }
}

client.on('interactionCreate', async interaction => {
    if (interaction.commandName === 'newdj') {
        console.log("(*) recieved /newdj command.")
        await interaction.reply("Generating...")

        let d_list = textFile("d")
        let j_list = textFile("j")
        let d_word = d_list[(randomNum(d_list.length))]
        let j_word = j_list[(randomNum(j_list.length))]

        interaction.editReply("DJ? More like: "+ d_word +" "+ j_word + "");
        console.log("(*) finished executing /newdj")
      }

    if (interaction.commandName === 'lennyorban') {
        await interaction.reply("Hold on...")
        console.log("(*) recieved /lennyorban command")

        let coin = randomNum(2)

        if (coin == 0) {
            interaction.editReply("We eat at: BAN");
        }
        if (coin == 1) {
            interaction.editReply("We eat at: LENNY");
        }
        console.log("(*) finished executing /lennyorban")
    }

    if (interaction.commandName === 'quote') {

        console.log("(*) recieved /quote command")
        await interaction.reply("Hold on, loading your quote...");

        const output = await request('https://api.quotable.io/random');
        const quote = await output.body.json();

        interaction.editReply("*\""+ quote.content + "\"* - " + quote.author + "");
        console.log("(*) finished executing /quote")
    }

    if (interaction.commandName === 'coinflip') {
        console.log("(*) recieved /coinflip command")
        await interaction.reply("Flipping...")
        let coin = randomNum(2)
        if (coin == 0) {
            interaction.editReply("The coin says: ***HEADS***")
        }
        if (coin == 1) {
            interaction.editReply("The coin says: ***TAILS***")
        }
        console.log("(*) finished executing /coinflip")
    }

    if (interaction.commandName === 'help') {
        interaction.reply("DM'd you the help guide.")
        interaction.user.send("```Available Commands: \n > /newdj: get a new DJ acronym \n > /lennyorban: pick between lenny or ban \n > /coinflip: flip a coin \n > /quote: get a random quote \n```")
    }
  });

main();

client.login(TOKEN)
