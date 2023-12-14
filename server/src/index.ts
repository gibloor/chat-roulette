import express from "express"
import { createServer } from "https"
import { Server } from "socket.io"
import { readFileSync } from "fs"
import cors from 'cors'

const PORT = process.env.PORT || 8080

const app = express()

const server = createServer({
  key: readFileSync('./https_staff/server.key'),
  cert: readFileSync('./https_staff/server.cert'),
}, app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World')
})

io.on("connection", (socket) => {
  socket.emit("me", socket.id)
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded")
  })
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name })
  })
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal)
  })
})

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))