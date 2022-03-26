import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dgram from 'dgram';
import { Buffer } from 'buffer';
import HttpError from './httpError';
import { generate_weather_data } from '../../emulator/src/weather_output';
import { ClientRequest, IncomingMessage } from 'http';

const HOSTNAME = 'localhost';
const API_PORT = 8000;

// ----------------- Set up the express API server -----------------
const api = express();
const server = require('http').createServer(api);


api.use(cors());
api.use(express.json({ limit: '50mb' }));
api.use(express.urlencoded({ extended: true, limit: '50mb' }));
api.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
});

api.get('/', async (req, res) => {
  const val = await Promise.resolve('Server Works!');
  res.send(val);
});

function validate(){
  const raw_weather_data = generate_weather_data();
  let out = "";


  if (raw_weather_data.ambient_temp >= 0 && raw_weather_data.ambient_temp <= 50){
    out += "ambient temp:" + raw_weather_data.ambient_temp + "\n";
  } else {
    out += "invalid Ambient Temp\n";
  }
  if(raw_weather_data.track_temp >= 0 && raw_weather_data.track_temp <= 100){
    out += "track temp: " + raw_weather_data.track_temp + "\n";
  } else {
    out += "invalid track temp"
  }
  if(raw_weather_data.humidity > 0 && raw_weather_data.humidity < 1){
    out += "humidity:" + raw_weather_data.humidity + "\n";
  } else {
    out += "invalid Humidity\n";
  }
  if(raw_weather_data.precipitation >= 0 && raw_weather_data.precipitation <= 200){
    out += "Precipication: " + raw_weather_data.precipitation;
  } else {
    out += "invalid precipiation\n";
  }
  if(raw_weather_data.wind_speed >= 0 && raw_weather_data.wind_speed <= 100){
    out += "Wind speed" + raw_weather_data.wind_speed + "\n";
  } else {
    out += "invalid wind speed\n";
  }
  if(raw_weather_data.wind_dir >= 0 && raw_weather_data.wind_dir <= 360){
    out += "Wind direction" + raw_weather_data.wind_dir + "\n";
  } else {
    out += "invalid wind direction";
  }
return out;

}

api.get('/api/start', async (req, res) => {
  const val = await Promise.resolve('Started streaming weather data');
  res.send(validate());
  

});

api.get('/api/stop', async (req, res) => {
  const val = await Promise.resolve('Stopped streaming weather data');
  res.send("How to stop sending data");
});

// Error handler
api.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).send(err.message);
});

// ----------------- Set up a UDP socket -----------------
const socket = dgram.createSocket('udp4');
const data = Buffer.from('Some data');

async function sendData(): Promise<void> {
  socket.send(data, 0, data.length, 5000, 'localhost', (err) => {});
  console.log("Send data");
}

socket.bind(4500);

// -------------------------------------------------------

setInterval(sendData, 1000);

server.listen(API_PORT, () =>
  console.log(
    `Weather Station API server running at http://${HOSTNAME}:${API_PORT}`,
  ),
);


  // Web socket
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ server: server });
  
  wss.on('connection', function connection(ws: { send: (arg0: string) => void; on: (arg0: string, arg1: (message: string) => void) => void; }) {
    console.log('A new client Connected');    
    var i = 0
    while(i%3 == 0){
      ws.send(validate());
    

    ws.on('message', function incoming(message: string) {
      console.log('received: %s', message);
      ws.send("Got message: " + message)
    });
    i++;
  }

  });


