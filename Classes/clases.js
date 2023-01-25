const { commanderError } = require("./error.js")

class CommandBuilder {
    constructor(){
        this.data = {}
        this.data.type = 1
    }
    setName(nombre){
        this.data.name = nombre
    }
    setDescription(desc){
        this.data.description = desc
    }
    setExecute(execute){
        this.data.execute = execute
    }
    addStringOption({ nombre, desc, required, joined }){
        if(!this.data.options){
            this.data.options = []
        }
        let req;
        if(required && required === true){
            req = true
        } else if(!required || required === false){
            req = false
        }
        let j;
        if(joined && joined === true){
            j = true
        } else if(!joined || joined === false){
            j = false
        }
        this.data.options.push({ name: `${nombre}`, description: `${desc}`, type: 3, required: req, joined: j })
    }
    addUserOption({ nombre, desc, required }){
        if(!this.data.options){
            this.data.options = []
        }
        let rq;
        if(required && required === true){
            rq = true
        } else if(!required || required === false){
            rq = false
        }
        this.data.options.push({ name: `${nombre}`, description: `${desc}`, type: 6, required: rq })
    }
    addIntegerOption(nombre, desc, required){
        if(!this.data.options){
            this.data.options = []
        }
        let rq;
        if(required && required === true){
            rq = true
        } else if(!required || required === false){
            rq = false
        }
        this.data.options.push({ name: `${nombre}`, description: `${desc}`, type: 4, required: rq })
    }
    addBooleanOption(name, desc, required){
        if(!this.data.options){
            this.data.options = []
        }
        let rq;
        if(required && required === true){
            rq = true
        } else if(!required || required === false){
            rq = false
        }
        this.data.options.push({ name: name, description: desc, type: 5, required: rq })
    }
    addChannelOption({ name, desc, required }){
        if(!this.data.options){
            this.data.options = []
        }
        let rq;
        if(required && required === true){
            rq = true
        } else if(!required || required === false){
            rq = false
        }
        this.data.options.push({ name: name, description: desc, type: 7, required: rq })
    }
    addRoleOption(
        {
            name,
            description,
            required
        }
    ){
        if(!this.data.options){
            this.data.options = []
        }
        let rq;
        if(required && required === true){
            rq = true
        } else if(!required || required === false){
            rq = false
        }
        this.data.options.push({ name: name, description: description, type: 8, required: rq })
    }
    addAttachmentOption({
        name,
        description,
        required
    }){
        if(!this.data.options){
            this.data.options = []
        }
        let rq;
        if(required && required === true){
            rq = true
        } else if(!required || required === false){
            rq = false
        }
        this.data.options.push({ name: name, description: description, type: 11, required: rq })
    }
    isolate(type){
        if(type === 1){
            this.data.iso = "msg"
        } else if(type === 2) {
            this.data.iso = "int"
        }
    }
    verify(){
        if(this.data.options.length > 1){
            throw new commanderError("Solo puede haber una opción si hay una con joined como true")
        }
    }
    toJSON(){
        return this.data 
    }
}

const CommandType = { Message: 1, Interaction: 2 }

class ContextMenuBuilder {
    constructor(){
        this.data = {}
        this.data.type = 2;
    }
    setName(nombre){
        if(!nombre){
            throw new commanderError("Debe haber un nombre")
        }
        this.data.name = nombre
    }
    setExecute(execute){
        this.data.execute = execute
    }
    toJSON(){
        return this.data
    }
}

class MessageMenuBuilder {
    constructor(){
        this.data = {}
        this.data.type = 2;
    }
    setName(nombre){
        if(!nombre){
            throw new commanderError("Debe haber un nombre")
        }
        this.data.name = nombre
    }
    setExecute(execute){
        this.data.execute = execute
    }
    toJSON(){
        return this.data
    }
}
module.exports = { CommandBuilder, CommandType, ContextMenuBuilder, MessageMenuBuilder }