import { Message } from "discord.js"

export interface Command {
    name: string
    description: string
    adminOnly: boolean
    usage: string

    run(msg: Message, args: string[]): void
}