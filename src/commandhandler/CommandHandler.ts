import fs from 'fs/promises'
import { Command } from '../interfaces/Command'

export class CommandHandler {
    public commands: Map<string, Command>
    constructor() {
        this.commands = new Map<string, Command>()
    }

    public async initialize() {
        const commandDir = await fs.readdir('./dist/commands')

        commandDir.forEach(commandName => {
            if (!commandName.endsWith('.js')) return

            const DynamicCommand = require('../commands/'+commandName.split('.js')[0]).default

            const commandInstance: Command = new DynamicCommand()
            this.commands.set(commandInstance.name, commandInstance)
        })
    }  
}