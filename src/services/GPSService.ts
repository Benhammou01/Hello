interface GPSData {
  imei: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
  simStatus?: {
    iccid: string;
    provider: string;
    signalStrength: number;
    dataBalance: number;
    expiryDate: string;
    status: 'active' | 'inactive' | 'expired';
  };
}

class GPSService {
  private socket: WebSocket | null = null;
  private listeners: Map<string, (data: any) => void>;
  private isConnected: boolean = false;
  private deviceIP: string = '192.168.1.100'; // Your GPS device's IP
  private devicePort: number = 5023; // Your GPS device's port
  private deviceImei: string = ''; // Add deviceImei property

  constructor() {
    this.listeners = new Map();
    this.connectToDevice();
  }

  private connectToDevice() {
    try {
      const deviceUrl = `ws://${this.deviceIP}:${this.devicePort}`;
      this.socket = new WebSocket(deviceUrl);

      this.socket.onopen = () => {
        console.log('Connected to GPS device');
        this.isConnected = true;
        
        // Check SIM status every hour
        setInterval(() => {
          if (this.deviceImei) {  // Only check if we have an IMEI
            this.checkSimStatus(this.deviceImei);
          }
        }, 3600000);
      };

      this.socket.onmessage = (event) => {
        const data = this.parseGPSData(event.data);
        if (data) {
          // Add SIM status to notifications
          this.notifyListeners(data.imei, {
            location: { lat: data.latitude, lng: data.longitude },
            speed: data.speed,
            heading: data.heading,
            timestamp: data.timestamp,
            status: 'connected',
            simStatus: data.simStatus
          });

          // Alert on low data balance or expiring SIM
          if (data.simStatus) {
            if (data.simStatus.dataBalance < 100) { // MB
              console.warn(`Low data balance for device ${data.imei}: ${data.simStatus.dataBalance}MB`);
            }
            
            const expiryDate = new Date(data.simStatus.expiryDate);
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            if (daysUntilExpiry <= 7) {
              console.warn(`SIM card expiring soon for device ${data.imei}: ${daysUntilExpiry} days remaining`);
            }
          }
        }
      };

      this.socket.onerror = (error) => {
        console.error('GPS device connection error:', error);
        this.isConnected = false;
      };

      this.socket.onclose = () => {
        console.log('GPS device disconnected, attempting to reconnect...');
        this.isConnected = false;
        setTimeout(() => this.connectToDevice(), 5000);
      };
    } catch (error) {
      console.error('Error connecting to GPS device:', error);
    }
  }

  private parseGPSData(rawData: string): GPSData | null {
    try {
      // Parse Coban GPS data format
      // Example: ##,imei:123456789012345,A,22.123456,N,114.123456,E,60.0,180.0,20240315123456,*checksum##
      const parts = rawData.split(',');
      return {
        imei: parts[1].split(':')[1],
        latitude: this.parseCoordinate(parts[3], parts[4]),
        longitude: this.parseCoordinate(parts[5], parts[6]),
        speed: parseFloat(parts[7]),
        heading: parseFloat(parts[8]),
        timestamp: this.parseTimestamp(parts[9])
      };
    } catch (error) {
      console.error('Error parsing GPS data:', error);
      return null;
    }
  }

  private parseCoordinate(value: string, direction: string): number {
    const coord = parseFloat(value);
    return direction === 'S' || direction === 'W' ? -coord : coord;
  }

  private parseTimestamp(value: string): string {
    // Convert YYYYMMDDHHMMSS to ISO string
    const year = value.substring(0, 4);
    const month = value.substring(4, 6);
    const day = value.substring(6, 8);
    const hour = value.substring(8, 10);
    const minute = value.substring(10, 12);
    const second = value.substring(12, 14);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`).toISOString();
  }

  subscribeToDevice(imei: string, callback: (data: any) => void): void {
    this.listeners.set(imei, callback);
    if (this.isConnected) {
      // Send subscription command to device if needed
      this.socket?.send(`AT+TRACK=${imei}`);
    }
  }

  unsubscribeFromDevice(imei: string): void {
    this.listeners.delete(imei);
    if (this.isConnected) {
      // Send unsubscribe command if needed
      this.socket?.send(`AT+UNTRACK=${imei}`);
    }
  }

  sendCommand(imei: string, command: string): void {
    if (this.isConnected) {
      this.socket?.send(command);
    } else {
      console.log('Not connected to GPS device');
    }
  }

  private notifyListeners(imei: string, data: any): void {
    const listener = this.listeners.get(imei);
    if (listener) {
      listener(data);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private checkSimStatus(imei: string) {
    if (this.isConnected) {
      // AT command to check SIM status
      this.socket?.send(`AT+SIMSTAT=${imei}#`);
      
      // AT command to check signal strength
      this.socket?.send(`AT+CSQ=${imei}#`);
      
      // AT command to check data balance (if supported by carrier)
      this.socket?.send(`AT+DATABAL=${imei}#`);
    }
  }

  // Add method to manually check SIM status
  public checkDeviceSimStatus(imei: string): void {
    this.checkSimStatus(imei);
  }

  // Add method to configure SIM settings
  public configureSimSettings(imei: string, settings: {
    apn: string;
    username?: string;
    password?: string;
  }): void {
    if (this.isConnected) {
      // AT command to configure APN
      this.socket?.send(`AT+APN=${settings.apn}#`);
      
      // AT commands for authentication if needed
      if (settings.username && settings.password) {
        this.socket?.send(`AT+APNAUTH=${settings.username},${settings.password}#`);
      }
    }
  }

  // Add method to set device IMEI
  public setDeviceImei(imei: string): void {
    this.deviceImei = imei;
  }
}

export const gpsService = new GPSService();