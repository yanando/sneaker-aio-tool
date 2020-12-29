import { Command } from "../classes/Command"
import { prefix } from "../Config"
import { Message } from "discord.js"
import axios from "axios"

export default class ConvertCommand extends Command{
    readonly name = 'convert'
    readonly description = 'Convert currency'
    readonly adminOnly = false
    readonly usage = `${prefix}${this.name} <currency 1> <currency 2> <amount>\nI.E: ${prefix}${this.name} GBP USD 500`
    readonly apiKey = '82826ef4e560576c5fe9'
    

    public async run(message: Message, args: string[]){
        if (args.length !== 3) {
            message.channel.send(`not enough or too many arguments\nUsage: ${this.usage}`)
        }

        const currency1 = args.shift()?.toUpperCase()!
        const currency2 = args.shift()?.toUpperCase()!
        const amount = parseFloat(args.shift()!)

        const rate = await this.getRate(currency1, currency2)

        if (isNaN(rate)) {
            return message.channel.send('invalid currency')
        }

        message.channel.send(`${amount} ${currency1} = ${(amount * rate).toFixed(2)} ${currency2}`)
    }

    private async getRate(currency1: string, currenty2: string) {
        const url = `https://free.currconv.com/api/v7/convert?q=${currency1}_${currenty2}&compact=ultra&apiKey=${this.apiKey}`

        const response = await axios.get(url, {validateStatus: () => false})

        if (response.status !== 200) {
            return NaN
        }

        return response.data[`${currency1}_${currenty2}`] as number
    }
}