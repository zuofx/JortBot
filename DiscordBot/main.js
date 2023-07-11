// Default invite: 

// INITIATIONS & CONSTANTS
const Discord  = require('discord.js');
const fs = require('fs')
const { Client, GatewayIntentBits, REST, Routes, quote } = require('discord.js');
const { request } = require('undici');
const { type } = require('os');
const { stringify } = require('querystring');

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

function openJson(name) {
    let rawJson = fs.readFileSync("people.json")
    let parseJson = JSON.parse(rawJson)

    return parseJson
}

function updateJason(newJson) {

    var writeJson = JSON.stringify(newJson)

    fs.writeFile("people.json", writeJson, function(err, result) {
        if (err) console.log('error', err)

    })

}

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
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
        },
        {
            name: 'notfunny',
            description: 'They weren\'t being funny',
            options: [
                {
                    name: 'name',
                    description: 'Who to update?',
                    type: 3,
                    required: true,
                },{
                    name: 'amount',
                    description: 'How much to update?',
                    type: 3,
                    required: true,
                }
            ]
        },
        {
            name: 'howunfunny',
            description: 'How many times was this person unfunny?',
            options: [
                {
                    name: 'name',
                    description: 'Who to look for?',
                    type: 3,
                    required: true,
                }
            ]
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

    if (interaction.commandName === 'notfunny') {
        await interaction.reply("Hold on...");
        let person = interaction.options.getString('name').toUpperCase().trim();
        let rawAmo = interaction.options.getString('amount')

        let check = isNumeric(rawAmo)

        let amo = 0;
        if (check) {
            amo = parseInt(rawAmo);
            console.log(1)
        }else if (!check) {
            amo = 0
            console.log(0)
        }
        

        console.log("Added " + String(amo) + " to " + person + "'s NotFunny Counter.")

        let jason = openJson(person);
        console.log(jason.people[0].name)
        
        let size = jason.people.length

        let found = false;
        for (let i = 0; i < size; i ++) {
            if (jason.people[i].name === person) {
                found = true;
            }
        }
        
        if (found) {
            for (let i = 0; i < size; i ++) {
                if (jason.people[i].name === person) {
                    jason.people[i].counter = jason.people[i].counter + amo;
                }
            }

            updateJason(jason);

        }else if (!found) {
            let newPerson = {name:person, counter:amo}
            jason.people.push(newPerson)
            updateJason(jason);
        }

        if (check) {
            if (found) {
                interaction.editReply("Added " + String(amo) + " to " + person + "'s Not Funny counter.");
            }else if (!found) {
                interaction.editReply("Did not find an existing entry for: " + person + ", adding a new entry with counter: " + String(amo))
            }
        }else if (!check) {
            interaction.editReply("Nothing changed, no valid amount was given.")
        }
    }

    if (interaction.commandName === "howunfunny") {
        await interaction.reply("Hold on...")
        let person = interaction.options.getString('name').trim().toUpperCase();

        let jason = openJson(person);
        let size = jason.people.length

        let found = false;
        for (let i = 0; i < size; i ++) {
            if (jason.people[i].name === person) {
                found = true;
            }
        }

        if (found) {
            let amount = 0
            for (let i = 0; i < size; i ++) {
                if (jason.people[i].name === person) {
                    amount = parseInt(jason.people[i].counter);
                }
            }
            interaction.editReply(person + "'s Unfunny Counter is at: " + amount)
        }else if (!found) {
            interaction.editReply("Could not find this person.")
        }

    }

  });

main();

client.login(TOKEN)
