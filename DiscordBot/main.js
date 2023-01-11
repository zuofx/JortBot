//import { REST } from '@discordjs/rest';
// Default invite: https://discord.com/oauth2/authorize?client_id=1062794185779990609&scope=bot&permissions=277025601560


// Constants:
const TOKEN = 'CHANGE ME'
const CLIENT_ID = 'CHANGE ME'
const GUILD_ID = 'CHANGE ME'


const Discord  = require('discord.js');
const fs = require('fs')
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

// Functions:
function randomNum(n) {
    return String(Math.floor(Math.random() * (n) ));
}

function tf_export(stuff) {
    return stuff
}

function textfile(a) {
    let text = fs.readFileSync(''+ a + '_words.txt','utf8')
    text = text.split('\n')

    for (i = 0; i < text.length; i ++) {
        text[i] = text[i].trim()
    }

    return text

}

// // // // // // // // // // // // // //


const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
  ]
})

const rest = new REST({ version: '10' }).setToken(TOKEN);


client.once('ready', () => {

    console.log('AccroDJ is online')

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
    ];

    try{
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        
    } catch (err) {
        console.log(err)
    }

}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'newdj') {

        let d_list = textfile("d")
        let j_list = textfile("j")

        let d_word = d_list[(randomNum(d_list.length))]
        let j_word = j_list[(randomNum(j_list.length))]

        await interaction.reply("DJ? More like: "+ d_word +" "+ j_word + "");
      }

    if (interaction.commandName === 'lennyorban') {

        let coin = randomNum(2)

        if (coin === 1) {
            await interaction.reply("We eat at: BAN");
        }
        if (coin === 2) {
            await interaction.reply("We eat at: LENNY");
        }
        if (coin > 2) {
            await interaction.reply("Error: Try running command again.")
        }
    }

  });

main();

client.login(TOKEN)
