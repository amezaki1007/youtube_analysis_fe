import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tunetrend.amezakimusic',
  appName: 'TuneTrend',
  webDir: '.output/public',
  server: {
    androidScheme: 'https',
  },
};

export default config;
