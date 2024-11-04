import { WebSocketServer } from 'ws';
import net from 'net';

const GPS_PORT = 5023;
const WS_PORT = 5024;

// Create TCP server for GPS devices
const gpsServer = net.createServer();

// Create WebSocket server for web clients
const wss = new WebSocketServer({ port: WS_PORT });

// Store connected devices and clients
const connectedDevices = new Map();
const connectedClients = new Map();

// Handle GPS device connections
gpsServer.on('connection', (socket) => {
  let deviceImei: string;

  socket.on('data', (data) => {
    // Parse GPS data (implement according to your GPS protocol)
    const parsedData = parseGPSData(data.toString());
    if (parsedData) {
      deviceImei = parsedData.imei;
      connectedDevices.set(deviceImei, socket);
      
      // Broadcast GPS data to web clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedData));
        }
      });
    }
  });

  socket.on('close', () => {
    if (deviceImei) {
      connectedDevices.delete(deviceImei);
    }
  });
});

// Handle web client connections
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'command' && data.imei) {
        const deviceSocket = connectedDevices.get(data.imei);
        if (deviceSocket) {
          deviceSocket.write(data.command);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
});

// Parse GPS data according to Coban protocol
function parseGPSData(data: string) {
  try {
    const parts = data.split(',');
    return {
      imei: parts[1].split(':')[1],
      latitude: parseFloat(parts[3]),
      longitude: parseFloat(parts[5]),
      speed: parseFloat(parts[7]),
      heading: parseFloat(parts[8]),
      timestamp: new Date(`${parts[9]} ${parts[10]}`).toISOString()
    };
  } catch (error) {
    console.error('Error parsing GPS data:', error);
    return null;
  }
}

gpsServer.listen(GPS_PORT, () => {
  console.log(`GPS server listening on port ${GPS_PORT}`);
});

console.log(`WebSocket server listening on port ${WS_PORT}`); 