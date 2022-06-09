const express = require('express')
var cors = require('cors')
const { exec } = require('child_process');
const execFile = require('child_process').execFile;
var currentDisplayPID = false

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

app.post('/play/:category/:game', (req, res) => {
  var game = req.params.game
  var category = req.params.category

  exec(`/opt/retropie/supplementary/runcommand/runcommand.sh 0 _SYS_ ${category} /home/pi/RetroPie/roms/${category}/${game}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err)
    } else {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    }
  });
  return res.json("ok");
});

app.post('/display/:image', (req, res) => {
  if (currentDisplayPID != false) {
    try {
      process.kill(currentDisplayPID, 'SIGINT')
    } catch(e) {
      console.log("old process was already closed")
    }
  }
  
  if (req.params.image == "") {
    return res.json({
      "status": "please provide an image"
    });
  } else {
    display = execFile('sudo', ['/home/pi/matrix/rpi-rgb-led-matrix/examples-api-use/demo', `-D2`, `/home/pi/images/${req.params.image}.ppm`, "--led-rows=16", "--led-chain=2"], (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
    });
    currentDisplayPID = display.pid
    console.log("created process with id: " + currentDisplayPID)

    return res.json({
      "status": "ok",
      "pid": display.pid
    });
  }
});

app.post('/killdisplay', (req, res) => {
  if (currentDisplayPID != false) {
    try {
      console.log("Killing process with id: "+currentDisplayPID)
      process.kill(currentDisplayPID + 1, 'SIGINT')
      process.kill(currentDisplayPID + 2, 'SIGINT')
    } catch(e) {
      return res.json({
        "status": "process was already closed",
        "error": e
      });
    }

    return res.json({
      "status": "ok",
      "pid": currentDisplayPID
    });
  } else {
    return res.json({
      "status": "no running process"
    });
  }
});

app.listen(8080, () =>
  console.log(`Listening on port 8080!`),
);