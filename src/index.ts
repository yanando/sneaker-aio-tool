import {token, prefix} from './Config'
import {Bot} from './bot/Bot'

(async () => {
    const bot = new Bot(token, prefix)
    await bot.start()
    console.log('started')
})()