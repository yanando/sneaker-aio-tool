import { Message } from "discord.js"

export abstract class Command {
    abstract name: string
    abstract description: string
    abstract adminOnly: boolean
    abstract usage: string

    public abstract run(msg: Message, args: string[]): void
}