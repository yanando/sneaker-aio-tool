import {Client, Message, TextChannel} from 'discord.js'
import { CommandHandler } from './commandhandler/CommandHandler'

export class Bot {
    private client: Client
    private commandHandler: CommandHandler
    constructor(private token: string, public prefix: string) { 
        this.client = new Client()
        this.commandHandler = new CommandHandler()
    }

    public async start() {
        // login
        await this.client.login(this.token)

        // register listeners
        this.client.on('message', msg => this.onMessage(msg))
        this.client.on('error', error => {
            console.log(error)
            this.client.destroy()
        })

        // initialize commands
        await this.commandHandler.initialize()
    }

    private onMessage(message: Message) {
        if (!message.content.startsWith(this.prefix) || message.author.bot) return

        const args = message.content.split(/ +/g)
        const commandName = args.shift()?.slice(1)!

        const command = this.commandHandler.commands.get(commandName)

        if (!command) {
            return message.channel.send('command doesnt exist')
        }

        try {
            command.run(message, args)
        } catch (error) {
            message.channel.send('Something went wrong while executing this commmand. An error log has been sent to yanando#0001');
            (this.client.channels.cache.get('680813832813543554') as TextChannel).send(error)
        }
    }
}