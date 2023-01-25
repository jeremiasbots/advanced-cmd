const { commanderError } = require("./error.js")

class Options {
    constructor(client, msg, args, options){
        this.client = client;
        this.msg = msg;
        this.args = args
        this.opt = options;
    }
    getString(name){
        if(!name){
            throw new commanderError("Debe haber un nombre")
        }
        const string = this.opt.find(s => s.name === name)

        const si = this.opt.indexOf(string)

        let contenido = this.args[si]

        if(string.joined && string.joined === true){
            contenido = this.args.join(" ")
        }

        if(string === this.opt.pop()){
            contenido = this.args.slice(si).join(" ")
        }

        if(contenido === undefined){
            contenido = null
        }

        return contenido;
    }
    getUser(name){
        const string = this.opt.find(u => u.name === name)

        const si = this.opt.indexOf(string)

        let contenido = this.args[si].slice(2, -1)

        contenido = this.client.users.resolve(contenido)

        if(contenido === undefined || contenido === null){
            contenido = null
        }

        return contenido;
    }
    getInteger(name){
        const int = this.opt.find(i => i.name === name)

        let si = this.opt.indexOf(int)

        let integer;

        integer = this.args[si]

        if(integer === undefined){
            integer = null;
        }

        return integer;
    }
    getChannel(name){
        const ch = this.opt.find(c => c.name === name)
        
        let si = this.opt.indexOf(ch)
        
        let channel;

        channel = this.args[si]
        channel = this.msg.guild.channels.cache.get(channel.slice(2, -1))

        if(channel === undefined || channel === null){
            channel = null;
        }

        return channel;
    }
    getRole(name) {
        const ch = this.opt.find(c => c.name === name)

        let indexnumber = this.opt.indexOf(ch)

        let role;

        role = this.args[indexnumber]
        role = this.msg.guild.roles.cache.get(role.slice(3, -1))

        if(role === undefined || role === null){
            role = null;
        }

        return role;
    }
    getAttachment(name){
        const attach = this.opt.find(c => c.name === name)

        let indexnumber = this.opt.indexOf(attach)

        let role;

        role = this.msg.attachments.toJSON()
        let files = []
        for(const file of role){
            files.push({
                attachment: file.attachment,
                name: file.name,
                id: file.id,
                size: file.size,
                url: file.url,
                proxyURL: file.proxyURL,
                height: file.height,
                width: file.width,
                contentType: file.contentType,
                description: file.description,
                ephemeral: file.ephemeral
            })
        }
        if(role.length === 1){
            files = files[0]
        } else {
            const filter_options = this.opt.filter(x => x.type === 11)

            files = files[filter_options.indexOf(attach)]
        }

        return files;
    }
    getMember(name){
        const string = this.opt.find(u => u.name === name)

        const si = this.opt.indexOf(string)

        let contenido = this.args[si].slice(2, -1)

        contenido = this.msg.guild.members.fetch(contenido)

        if(contenido === undefined || contenido === null){
            contenido = null
        }

        return contenido;
    }
}

module.exports = { Options }