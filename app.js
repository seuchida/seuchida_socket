require('dotenv').config()
const express = require('express')
const connect = require('./schemas')
const cors = require('cors')
const fs = require('fs')
const https = require('https')
const socket = require('./socket')
const http = require('http')
// const privateKey = fs.readFileSync(__dirname + '/private.key', 'utf8')
// const certificate = fs.readFileSync(__dirname + '/certificate.crt', 'utf8')
// const ca = fs.readFileSync(__dirname + '/ca_bundle.crt', 'utf8')
// const credentials = {
//     key: privateKey,
//     cert: certificate,
//     ca: ca,
// }
const app_low = express()
const app = express()
const httpPort = process.env.HTTP_PORT
const httpsPort = process.env.HTTPS_PORT

app_low.use((req, res, next) => {
    if (req.secure) {
        next()
    } else {
        const to = `https://${req.hostname}:${httpsPort}${req.url}`
        res.redirect(to)
    }
})

connect()
//마지막에 cors 수정해야함
app.use(cors())

const requestMiddleware = (req, res, next) => {
    console.log('Request URL:', req.originalUrl, ' - ', new Date())
    next()
}
//프론트에서 오는 데이터들을 body에 넣어주는 역할
app.use(express.json())
app.use(requestMiddleware)


app.get('/', (req, res) => {
    res.send('hello')
})
app.get(
    '/.well-known/pki-validation/647C673612E288387FCCA65CD8C12672.txt',
    (req, res) => {
        res.sendFile(
            __dirname +
                '/well-known/pki-validation/647C673612E288387FCCA65CD8C12672.txt'
        )
    }
)
const server = http.createServer(app)
// const server = https.createServer(credentials, app)
// socket(server)

server.listen(httpPort, () => {
    console.log('local서버가 켜졌어요!')
})

// server.listen(httpsPort, () => {
//     console.log('https서버가 켜졌어요!')
// })
