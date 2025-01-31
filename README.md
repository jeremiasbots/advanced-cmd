<h1 align="center">ADVANCED-CMD</h1>
<p align="center">
    <img src="https://img.shields.io/npm/dt/advanced-cmd">
    <img src="https://img.shields.io/discord/917252294012174376?color=%234169e1">
    <img src="https://img.shields.io/npm/v/advanced-cmd?color=%2340B5AD&label=version">
    <img src="https://img.shields.io/librariesio/dependents/npm/advanced-cmd?color=orange">
    <img src="https://img.shields.io/github/stars/jeremiasbots/advanced-cmd?color=%23e62e1b">
    <img src="https://img.shields.io/npm/collaborators/advanced-cmd">
</p>

# Configuración

Debe poner el siguiente comando en su terminal:

```
npm i -g advanced-cmd-cli
```

Después de eso, vuelva a abrir la terminal y ponga el siguiente comando en el directorio donde creara el bot:

```
advanced-cmd-cli <nameCarpet>
```

`<nameCarpet>` hace referencia a el nombre de la carpeta del bot

Este es el metodo más fácil para crear un bot utilizando advanced-cmd

También lo puede adaptar, para eso lea la documentación que está más abajo

# Soporte

[**Server Support 😎**](https://discord.gg/BR5MpS3heH)

**Correo:** darkbotdka@proton.me

Este proyecto funciona en `Typescript` también además de `Javascript`

Cualquier bug reportarlo por el servidor de soporte en un ticket

Si quieres adaptar `advanced-cmd` a tu proyecto lee la documentación que está abajo

# CommandBuilder

Este sirve para crear los comandos de interacción y mensaje al mismo tiempo, sus métodos son:

## [setName()](#setnamestring)

## [setDescription()](#setdescriptionstring)

## [setExecute()](#setexecutefunction)

## [addStringOption()](#addstringoptionoptions)

## [addUserOption()](#adduseroptionoptions)

## [addRoleOption()](#addroleoptionoptions)

## [addChannelOption()](#addchanneloptionoptions)

## [addAttachmentOption()](#addattachmentoptionoptions)

## [addIntegerOption()](#addintegeroptionoptions)

## [addBooleanOption()](#addbooleanoptionoptions)

## [isolate()](#isolatecommandtype)

## [verify()](#verify-1)

## [toJSON()](#tojson-1)

# MessageMenuBuilder

Este es lo mismo que `CommandBuilder` solo que es para hacer los menú en los mensajes con el paquete y solo tiene los métodos `setName()`, `setExecute()` y `toJSON()` que sirven para lo mismo que en CommandBuilder y su forma de utilizar es igual

# ContextMenuBuilder

Este es lo mismo que `CommandBuilder` solo que es para hacer los menú en los usuarios con el paquete y solo tiene los métodos `setName()`, `setExecute()` y `toJSON()` que sirven para lo mismo que en CommandBuilder y su forma de utilizar es igual

# Otras funciones

## [config()](#configoptions)

## [reload()](#reloadclient)

# Métodos

### <CommandBuilder>.setName(string)

`<CommandBuilder>.setName()` es un método que permite establecer el nombre en tu comando

Este es totalmente obligatorio para un comando, si no el paquete no funcionara

Ejemplo:

```js
const { CommandBuilder } = require("advanced-cmd");

const command = new CommandBuilder();
command.setName("ping");
```

### <CommandBuilder>.setDescription(string)

`<CommandBuilder>.setDescription()` es un método que permite establecer la descripción de tu comando

Este también es totalmente obligatorio para un comando, si no el paquete no funcionara

Ejemplo:

```js
const { CommandBuilder } = require("advanced-cmd");

const command = new CommandBuilder();
command.setDescription("Ve mi ping en ws");
```

### <CommandBuilder>.setExecute(Function)

`<CommandBuilder>.setExecute()` es un método que permite establecer que hará el comando, este también es obligatorio en un comando de lo contrario el paquete no funcionara

Dentro del `.setExecute()` va una función que tiene dos parametros `client` y `interaction`

client es equivalente a Client de `discord.js`

interaction es equivalente a CommandInteraction de `discord.js`, este tiene unos pequeños añadidos como que existe el valor `interaction.isMsg` para saber si es un mensaje o una interacción debido a que hay valores que solo están en un tipo de comando, otro añadido es que se puede usar tanto `interaction.user` como `interaction.author`

Ejemplo:

```js
const { CommandBuilder } = require("advanced-cmd");

const command = new CommandBuilder();
command.setExecute(function (client, interaction) {
  interaction.reply(`My ping is **${client.ws.ping}ms**`); // Message and interaction command
});
```

Si se tiene alguna duda sobre los métodos, pronto se publicara en el paquete los métodos que se pueden utilizar, por ahora puedes ir al Servidor de Discord y abrir un ticket si tienes alguna duda

### <CommandBuilder>.addStringOption(options)

`<CommandBuilder>.addStringOption()` es un método que permite agregar una opción de tipo `STRING` en tu comando

Ejemplo:

```js
const { CommandBuilder } = require("advanced-cmd");

const command = new CommandBuilder();
command.addStringOption({ name: "text", description: "A text" });
```

Hay una opción que no es obligatoria y es `required` y sirve para establecer si la opción es necesaria o no.

### <CommandBuilder>.addUserOption(options)

`<CommandBuilder>.addUserOption()` es un método que permite agregar una opción de tipo `USER` en tu comando

Ejemplo:

```js
const { CommandBuilder } = require("advanced-cmd");

const command = new CommandBuilder();
command.addUserOption({ name: "user", description: "A user" });
```

La única opción no obligatoria es `required` que sirve para establecer si la opción es requerida o no.

### <CommandBuilder>.addRoleOption(options)

`<CommandBuilder>.addRoleOption()` es un método que permite agregar una opción de tipo `ROLE` en tu comando

Ejemplo:

```js
const { CommandBuilder } = require("advanced-cmd");

const command = new CommandBuilder();
command.addRoleOption({ name: "role", description: "A role" });
```

La única opción no obligatoria es `required` que sirve para establecer si la opción es requerida o no.

### <CommandBuilder>.addChannelOption(options)

`<CommandBuilder>.addChannelOption()` es un método que permite agregar una opción de tipo `CHANNEL` en tu comando

Ejemplo:

```js
const { CommandBuilder } = require("advanced-cmd");

const command = new CommandBuilder();
command.addChannelOption({ name: "channel", description: "A channel" });
```

La única opción no obligatoria es `required` que sirve para establecer si la opción es requerida o no.

### <CommandBuilder>.addAttachmentOption(options)

`<CommandBuilder>.addAttachmentOption()` es un método que permite agregar una opción de tipo `ATTACHMENT` en tu comando

Tenga en cuenta que si solo hay una opción de tipo `ATTACHMENT` en el comando al hacer un `getAttachment()` devolvera el primer archivo que hay, de lo contrario el paquete va a agarrar el index de la opción en el array de las opciones de tipo `ATTACHMENT` y devolvera el que sea según ese número.

Un ejemplo es que si el número de index es 1 (segundo elemento) en el array de las opciones `ATTACHMENT`, va a devolver el segundo archivo.

Ejemplo:

```js
const { CommandBuilder } = require("advanced-cmd");

const command = new CommandBuilder();
command.setName("view_file");
command.setDescription("View a file");
command.addAttachmentOption({
  name: "file",
  description: "The file",
  required: true,
});
command.setExecute(function (client, interaction) {
  const option = interaction.options.getAttachment("file");
  console.log(option);
  interaction.reply(".");
});
```

`required` es la única opción no obligatoria, sirve para ver si la opción es obligatoria o no

### <CommandBuilder>.addIntegerOption(options)

`<CommandBuilder>.addIntegerOption()` es un método que permite agregar una opción de tipo `INTEGER` en su comando

Esto significa que el número que se debe introducir debe ser entero

Ejemplo:

```js
const { CommandBuilder } = require("advanced-cmd");

const command = new CommandBuilder();
command.addIntegerOption({ name: "integer", description: "El entero" });
```

La única opción no obligatoria es `required` que sirve para establecer si la opción es requerida o no.

Proximamente se implementara el método `addNumberOption()` para cualquier tipo de número.

### <CommandBuilder>.addBooleanOption(options)

`<CommandBuilder>.addBooleanOption()` es un método que permite agregar una opción de tipo `BOOLEAN` en su comando

Esto significa que el valor que se debe introducir es `true` o `false` (tanto en mensaje como interacción)

Ejemplo:

```js
const { CommandBuilder } = require("advanced-cmd");

const command = new CommandBuilder();
command.addBooleanOption({ name: "boolean", description: "El boolean" });
```

La única opción no obligatoria es `required` que sirve para establecer si la opción es requerida o no

### <CommandBuilder>.isolate(CommandType)

`<CommandBuilder>.isolate()` es un método que permite limitar el comando a solo un tipo

Esto significa que hará que el comando solo se ejecute en interacción o en mensaje

Ejemplo:

```js
const { CommandBuilder, CommandType } = require("advanced-cmd");

const command = new CommandBuilder();
command.isolate(CommandType.Message);
```

`CommandType.Message` hace referencia al comando de mensaje.

`CommandType.Interaction` hace referencia al comando de interacción.

### <CommandBuilder>.verify()

`<CommandBuilder>.verify()` es un método que permite verificar algunas cosas en el comando

No se recomienda utilizar, ya que está deprecado.

Ejemplo:

```js
const { CommandBuilder } = require("advanced-cmd");

const command = new CommandBuilder();
command.verify();
```

### <CommandBuilder>.toJSON()

`<CommandBuilder>.toJSON()` es un método que devuelve los datos del comando que hace el paquete para la interacción y mensaje

Ejemplo:

```js
const { CommandBuilder } = require("advanced-cmd");

const command = new CommandBuilder();
command.toJSON();
```

### config(options)

`config()` es un método que permite configurar el paquete

Opciones (obligatorias):

`client`: Es el cliente de discord.js

`directory`: Cómo se llama el directorio donde están los comandos (es importante decir que el handler es por subcarpetas)

`prefix`: El prefijo de tu bot

`no_option_message`: Un mensaje para las opciones no requeridas, se usa {options} para poner las opciones no requeridas. {options} mostrará el nombre y el tipo de la opción separados por dos puntos; cada opción no requerida irá en una línea. Esta opción puede no ponerse.

`option_messages`: Mensaje para las opciones que no son del tipo que deberían ser, también se usa {options} pero se muestra solo el nombre. La opción es un objeto con cada tipo de opción y su mensaje (boolean | integer | user | channel | role). Esta opción puede no ponerse al igual que cada uno de los mensajes.

Ejemplo:

```js
const { Client } = require("discord.js");
const client = new Client({ intents: 3276799 });
client.login("TOKEN");
const { config } = require("advanced-cmd");

config({ client: client, directory: "Comandos", prefix: "!" });
```

### reload(client)

`reload()` es un método que sirve para recargar los comandos

Opciones:

`client`: El cliente de discord.js

Ejemplo:

```js
const { Client } = require("discord.js");
const client = new Client({ intents: 3276799 });
client.login("TOKEN");
const { config, reload } = require("advanced-cmd");

config({ client: client, directory: "Comandos", prefix: "!" });

client.on("ready", () => {
  console.log("Bot listo");
  reload(client).then(() => console.log("Comandos recargados"));
});
```
