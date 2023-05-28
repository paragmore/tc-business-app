import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.taxpayercorner.business',
  appName: 'business-app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
