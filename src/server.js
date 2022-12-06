import server from './app'
import 'dotenv/config'

server.listen(process.env.PORT, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`)
})