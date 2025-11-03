import express from 'express'

const app = express()
const port = 3000

app.get('/api/v1', (req, res) => {
  res.send({
    error: {
      message: "not implented yet :(",
      type: "NotImplementedException"
    }
  });
});

app.listen(port, () => {
  console.log("listening: http://localhost:3000/api/v1")
})