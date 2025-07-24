import { NativeModule, requireNativeModule } from 'expo';

import { PingLibsignalModuleEvents, LibSignalKeyPair, PreKeyBundle, SignedPreKey, EncryptedMessage, SessionInfo } from './PingLibsignal.types';

declare class PingLibsignalModule extends NativeModule<PingLibsignalModuleEvents> {
  PI: number;
  hello(): string;
  testLibSignal(): Promise<LibSignalKeyPair>;
  generatePreKeys(count: number): Promise<PreKeyBundle>;
  generateSignedPreKey(identityKeyPair: string): Promise<SignedPreKey>;
  encryptMessage(message: string, recipientPublicKey: string): Promise<EncryptedMessage>;
  createSession(recipientId: string, recipientPublicKey: string): Promise<SessionInfo>;
}

export default requireNativeModule<PingLibsignalModule>('PingLibsignal');