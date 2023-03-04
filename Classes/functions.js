function config(client, directory, __dirname, prefix){
    const fs = require("fs-extra")
    const { Options } = require("./opciones.js")
    const { Collection } = require("discord.js")
    let path = require("path")
    if(process.platform === "win32"){
        path = require("path/win32")
    } 
    client.slashcmd = new Collection();
    const slashCarpet = fs.readdirSync(path.join(__dirname, directory))
    slashCarpet.map(folder => {
        const slashFiles = fs.readdirSync(path.join(__dirname, directory, folder)).filter(file => file.endsWith("js"))
        slashFiles.map(file => {
            const slash = require(path.join(__dirname, directory, folder, file))
            client.slashcmd.set(slash.data.name, slash.data)
        })
    })
    client.on("interactionCreate", async(interaction) => {
        if(interaction.isChatInputCommand() || interaction.isContextMenuCommand() || interaction.isMessageContextMenuCommand()){
    
        if(!interaction.guild) return;
    
        const cmds = client.slashcmd.get(interaction.commandName)
    
        if(!cmds) return;

        if(cmds.iso === "msg") return;
    
        try {
            interaction.isMsg = false
            interaction.author = interaction.user
            await cmds.execute(client, interaction)
        } catch (error){
            console.error(error)
        }
    }
    })
    client.on("messageCreate", async(message) => {
        if(!message.content.startsWith(prefix)) return;
    
        if(message.author.bot) return;
    
        if(!message.guild) return;
    
        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const command = args.shift().toLowerCase();
    
        let cmd = client.slashcmd.find((c) => c.name === command)
    
        if(cmd){
            if(cmd.iso === "int") return;
            if(cmd.type === 2 || cmd.type === 3) return;
            let retorned = []
            let users = []
            let channels = []
            let roles = []
            let integers = []
            let boolean = []
            message.isMsg = true
            message.user = message.author
            if(cmd.options){
                cmd.options.map(x => {
                    if(x.required && x.required === true){
                        if(x.type === 11) return;
                        const si = cmd.options.indexOf(x)
    
                        if(!args[si]){
                            retorned.push({ name: x.name })
                        }
                    }

                    if(x.type === 5){
                        const xd = cmd.options.indexOf(x)

                        if(!args[xd]){
                            return;
                        }

                        const boolean_type = args[xd]

                        const boolean_array = ["true", "false"]

                        if(!boolean_array.some(element => boolean_type.includes(element))){
                            boolean.push({ name: x.name })
                        }
                    }

                    if(x.type === 4){
                        const xd = cmd.options.indexOf(x)

                        if(!args[xd]){
                            return;
                        }

                        const integer_type = args[xd]

                        if(isNaN(integer_type)){
                            integers.push({ name: x.name })
                            return;
                        }

                        const numero = Number(integer_type)

                        if(!Number.isInteger(numero)){
                            integers.push({ name: x.name })
                        }
                    }
    
                    if(x.type === 6){
    
                        const xd = cmd.options.indexOf(x)
    
                        if(!args[xd]){
                            return;
                        }
    
                        const argos = args[xd]
    
                        const user = message.guild.members.cache.get(argos.slice(2, -1))
    
                        if(user === null || user === undefined){
                            users.push({ name: x.name })
                        }
                    }
                    if(x.type === 7){
                        const xd = cmd.options.indexOf(x)
    
                        if(!args[xd]){
                            return;
                        }
    
                        const argos = args[xd]
    
                        const channel = message.guild.channels.cache.get(argos.slice(2, -1))
    
                        if(channel === null || channel === undefined){
                            channels.push({ name: x.name })
                        }
                    }
                    if(x.type === 8){
                        const indexrole = cmd.options.indexOf(x)
    
                        if(!args[indexrole]) return;
    
                        const argument = args[indexrole]
    
                        const role = message.guild.roles.cache.get(argument.slice(3, -1))
    
                        if(role === null || role === undefined){
                            roles.push({ name: x.name })
                        }
                    }
                })
                message.options = new Options(client, message, args, cmd.options)
            } else {
                message.options = []
            }
            if(retorned.length !== 0){
                retorned = retorned.map(y => `\`${y.name}\``).join("\n")
                message.reply(`Faltan las siguientes opciones:\n${retorned}`)
                return;
            }
            if(boolean.length !== 0){
                boolean = boolean.map(y => `\`${y.name}\``).join("\n")
                message.reply(`Las siguientes opciones deben ser true/false:\n${boolean}`)
                return;
            }
            if(integers.length !== 0){
                integers = integers.map(y => `\`${y.name}\``).join("\n")
                message.reply(`Las siguientes opciones deben ser un número entero:\n${integers}`)
                return;
            }
            if(users.length !== 0){
                users = users.map(y => `\`${y.name}\``).join("\n")
                message.reply(`Las siguientes opciones deben ser un usuario:\n${users}`)
                return;
            }
            if(channels.length !== 0){
                channels = channels.map(y => `\`${y.name}\``).join("\n")
                message.reply(`Las siguientes opciones deben ser un canal:\n${channels}`)
                return;
            }
            if(roles.length !== 0){
                roles = roles.map(y => `\`${y.name}\``).join("\n")
                message.reply(`Las siguientes opciones deben ser un rol:\n${roles}`)
                return;
            }
            cmd.execute(client, message)
        }
    })
}

function reload(client){

    let cmds = client.slashcmd.map(x => x)

    cmds = cmds.filter(x => x.iso !== "msg")

    client.application.commands.set(cmds).then(() => {
        console.log("[DISCORD-COMMANDS] Comandos cargados")
    }).catch(error => console.error(`[DISCORD-COMMANDS ERROR]: Hubo un error al recargar los comandos Slash:\n${error}`))
}

module.exports = { config, reload }