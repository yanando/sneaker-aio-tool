import { Message, TextChannel } from 'discord.js'
import CustomClient from './classes/CustomClient'

export class Bot {
    private client: CustomClient
    constructor(private token: string, public prefix: string) {
        this.client = new CustomClient()
    }

    public async start() {
        // login
        await this.client.login(this.token)

        // register listeners
        this.client.on('message', msg => {
            // http://static.fjcdn.com/large/pictures/a0/fc/a0fcfd_1399878.jpg
            if (msg.author.id === '502229568959021056' || msg.author.id === '720256021066416178') return
            this.onMessage(msg)
        })
        this.client.on('error', error => {
            console.log(error)
            // this.client.destroy()
        })

        // initialize commands
        await this.client.commandHandler.initialize()

        // set status 
        await this.client.user?.setActivity("$help", { type: 'WATCHING' })
    }

    private onMessage(message: Message) {
        if (!message.content.startsWith(this.prefix) || message.author.bot) return

        const args = message.content.split(/ +/g)
        const commandName = args.shift()?.slice(1)!

        const command = this.client.commandHandler.commands.get(commandName)

        if (!command) {
            return message.channel.send('command doesnt exist')
        }

        try {
            command.run(message, args)
        } catch (error) {
            message.channel.send('Something went wrong while executing this commmand. An error log has been sent to yanando#0001');
        }
    }
}