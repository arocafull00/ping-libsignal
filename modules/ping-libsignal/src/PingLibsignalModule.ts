import { NativeModule, requireNativeModule } from 'expo';

import { PingLibsignalModuleEvents } from './PingLibsignal.types';

declare class PingLibsignalModule extends NativeModule<PingLibsignalModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  testLibSignal(): Promise<{ pub: string; priv: string }>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<PingLibsignalModule>('PingLibsignal');
