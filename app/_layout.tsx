import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { BLEProvider } from '@/context/BLEContext';
import { MotoProvider } from '@/context/MotoContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <BLEProvider>
      <MotoProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="register-moto" options={{ headerShown: false }} />
          <Stack.Screen name="edit-moto" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
        <StatusBar style="light" />
      </MotoProvider>
    </BLEProvider>
  );
}