import express from "express"

const app = express()
app.use(express.json())

const HOST = "localhost"
const PORT = 3000

// app.use(postRouter)

app.listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT}`);
});