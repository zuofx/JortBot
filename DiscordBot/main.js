// Default invite: https://discord.com/oauth2/authorize?client_id=1062794185779990609&scope=bot&permissions=277025601560

// Constants: MAKE SURE TO UPDATE API TOKENS
const TOKEN = ''
const CLIENT_ID = ''
const GUILD_ID = ''


const Discord  = require('discord.js');
const fs = require('fs')
const { Client, GatewayIntentBits, REST, Routes, quote } = require('discord.js');
const { request } = require('undici');


// Functions:
function randomNum(n) {
    return String(Math.floor(Math.random() * (n) ));
}

function tf_export(stuff) {
    return stuff
}

function textFile(a) {
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
        {
            name: 'quote',
            description: 'Get a random quote!'
        },
    ];

    try{
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
        
    } catch (err) {
        console.log(err)
    }

}

client.on('interactionCreate', async interaction => {
  
    if (interaction.commandName === 'newdj') {

        let d_list = textFile("d")
        let j_list = textFile("j")

        let d_word = d_list[(randomNum(d_list.length))]
        let j_word = j_list[(randomNum(j_list.length))]

        await interaction.reply("DJ? More like: "+ d_word +" "+ j_word + "");
      }

    if (interaction.commandName === 'lennyorban') {

        let coin = randomNum(2)

        if (coin == 0) {
            await interaction.reply("We eat at: BAN");
        }
        if (coin == 1) {
            await interaction.reply("We eat at: LENNY");
        }

    }

    if (interaction.commandName === 'quote') {

        interaction.reply("Hold on, loading your quote...");

        const output = await request('https://api.quotable.io/random');
        const quote = await output.body.json();

        interaction.editReply("*\""+ quote.content + "\"* - " + quote.author + "");

    }

  });

main();

client.login(TOKEN)
