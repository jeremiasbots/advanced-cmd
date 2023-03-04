declare module 'advanced-cmd' {
    interface AddOption {
        nombre: string
        desc: string
        required?: boolean
    }
    interface AddStringOptions extends AddOption {
        joined?: boolean
    }

    interface DataOptionsArrayData {
        name: string,
        description: string,
        type: number
        required: boolean
        joined?: boolean
    }

    interface DataOptions {
        type: number
        name?: string
        description?: string
        options?: Array<DataOptionsArrayData>
        iso?: string
        execute?: Function
    }

    interface DataContextAndMessageOptions {
        type: number
        name?: string 
        execute?: Function
    }

    export enum CommandType {
        Message = 1,
        Interaction = 2
    }

    export class CommandBuilder {
        data: DataOptions
        constructor ()
        setName(nombre: string)
        setDescription(desc: string)
        setExecute(execute: Function)
        addStringOption({ nombre, desc, required, joined }: AddStringOptions)
        addUserOption({ nombre, desc, required }: AddOption)
        addIntegerOption({ nombre, desc, required }: AddOption)
        addBooleanOption({ nombre, desc, required }: AddOption)
        addChannelOption({ nombre, desc, required }: AddOption)
        addRoleOption({ nombre, desc, required }: AddOption)
        addAttachmentOption({ nombre, desc, required }: AddOption)
        isolate(type: 1 | 2)
        toJSON()
        verify()
    }

    export function config(client: any, directory: string, __dirname: string, prefix: string)

    export function reload(client: any)

    export class ContextMenuBuilder {
        data: DataContextAndMessageOptions
        constructor() 
        setName(nombre: string)
        setExecute(execute: Function)
        toJSON()
    }

    export class MessageMenuBuilder {
        data: DataContextAndMessageOptions
        constructor ()
        setName(nombre: string)
        setExecute(execute: Function)
        toJSON()
    }
}