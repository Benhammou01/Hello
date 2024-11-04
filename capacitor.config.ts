import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.carrental.app',
  appName: 'Car Rental',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config; 