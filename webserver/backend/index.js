const express = require('express')
var cors = require('cors')
const { exec } = require('child_process');

const app = express();
app.use(cors())
var info = {};

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.get('/info', cors(corsOptions), (req, res) => {
  return res.json(info);
});

app.post('/game/:game', (req, res) => {
  info['game'] = req.params.game
  return res.json("");
});

app.post('/system/:system', (req, res) => {
  info["system"] = req.params.system
  return res.json("");
});

app.post('/play/:game', (req, res) => {
  var game = req.params.game


  exec('/opt/retropie/supplementary/runcommand/runcommand.sh 0 _SYS_ nes /home/pi/RetroPie/roms/nes/Super_Mario_Bros_3.nes', (err, stdout, stderr) => {
    if (err) {
      console.error(err)
    } else {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    }
  });
  return res.json("");
});

app.listen(8080, () =>
  console.log(`Listening on port 8080!`),
);