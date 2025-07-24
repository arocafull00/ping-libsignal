# ping-libsignal

A React Native/Expo module that provides libsignal functionality for both Android and iOS platforms.

## Features

- Cross-platform support (Android & iOS)
- Identity key pair generation
- PreKey generation
- Signed PreKey generation
- Basic message encryption/decryption setup
- Session management foundation

## Installation

This module is currently configured as a local module. To use it:

1. The module is already included in your project at `modules/ping-libsignal/`
2. It's referenced in your main `package.json` as: `"expo-libsignal": "file:modules/ping-libsignal"`
3. Run `npm install` to install dependencies

## Platform Setup

### iOS Setup

The iOS implementation uses [LibSignalProtocolSwift](https://github.com/christophhagen/LibSignalProtocolSwift). The dependency is automatically managed through CocoaPods.

**Required iOS version:** 13.4+

### Android Setup  

The Android implementation uses the official Signal Protocol libraries:
- `signal-protocol-android:2.8.1`
- `signal-protocol-java:2.8.1`

**Required Android SDK:** 21+

## API Reference

### Constants

- `PI`: Mathematical constant π

### Functions

#### `hello(): string`
Returns a greeting string for testing basic module functionality.

```typescript
const greeting = pingLibsignal.hello();
console.log(greeting); // "Hello world! 👋"
```

#### `testLibSignal(): Promise<{pub: string, priv: string}>`
Generates a new identity key pair and returns base64-encoded public and private keys.

```typescript
const keyPair = await pingLibsignal.testLibSignal();
console.log('Public Key:', keyPair.pub);
console.log('Private Key:', keyPair.priv);
```

#### `generatePreKeys(count: number): Promise<{preKeys: string[]}>`
Generates the specified number of one-time prekeys for asynchronous messaging.

```typescript
const preKeys = await pingLibsignal.generatePreKeys(10);
console.log('Generated prekeys:', preKeys.preKeys);
```

#### `generateSignedPreKey(identityKeyPair: string): Promise<{signedPreKey: string}>`
Generates a signed prekey using the provided identity key pair.

```typescript
const keyPair = await pingLibsignal.testLibSignal();
const signedPreKey = await pingLibsignal.generateSignedPreKey(keyPair.priv);
console.log('Signed PreKey:', signedPreKey.signedPreKey);
```

#### `encryptMessage(message: string, recipientPublicKey: string): Promise<{encrypted: string}>`
Basic message encryption (POC implementation).

```typescript
const encrypted = await pingLibsignal.encryptMessage("Hello!", recipientPublicKey);
console.log('Encrypted:', encrypted.encrypted);
```

#### `createSession(recipientId: string, recipientPublicKey: string): Promise<{sessionId: string}>`
Creates a mock session for demonstration purposes.

```typescript
const session = await pingLibsignal.createSession("user123", recipientPublicKey);
console.log('Session ID:', session.sessionId);
```

## Usage Example

```typescript
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import pingLibsignal from 'ping-libsignal';

export default function LibSignalDemo() {
  const [keyPair, setKeyPair] = useState(null);
  
  const generateKeys = async () => {
    try {
      const result = await pingLibsignal.testLibSignal();
      setKeyPair(result);
    } catch (error) {
      console.error('Key generation failed:', error);
    }
  };

  return (
    <View>
      <Button title="Generate Keys" onPress={generateKeys} />
      {keyPair && (
        <View>
          <Text>Public Key: {keyPair.pub}</Text>
          <Text>Private Key: {keyPair.priv}</Text>
        </View>
      )}
    </View>
  );
}
```

## Development Notes

### iOS Implementation Details

The iOS module uses Swift and integrates with LibSignalProtocolSwift:
- Native Swift implementation in `ios/PingLibsignalModule.swift`
- CocoaPods integration via `ios/PingLibsignalModule.podspec`
- Automatic dependency management for LibSignalProtocolSwift

### Android Implementation Details

The Android module uses Kotlin and integrates with official Signal libraries:
- Native Kotlin implementation in `android/src/main/java/expo/modules/pinglibsignal/PingLibsignalModule.kt`
- Gradle dependency management in `android/build.gradle`
- Support for both signal-protocol-android and signal-protocol-java

### Testing

The module includes a comprehensive test screen at `app/(tabs)/test.tsx` that demonstrates:
- Basic module loading
- Identity key pair generation
- PreKey generation
- Signed PreKey generation
- Cross-platform compatibility

## Security Considerations

⚠️ **Important:** This is a proof-of-concept implementation. For production use, consider:

1. **Secure Key Storage**: Implement secure storage for private keys (iOS Keychain, Android Keystore)
2. **Proper Session Management**: Implement full Signal Protocol session management
3. **Key Rotation**: Implement regular key rotation policies
4. **Secure Communication**: Use proper session-based encryption instead of mock implementations
5. **Input Validation**: Add comprehensive input validation and sanitization

## Building and Running

1. Install dependencies: `npm install`
2. Start the development server: `npx expo start`
3. Run on iOS: Press 'i' in the terminal or scan QR code
4. Run on Android: Press 'a' in the terminal or scan QR code
5. Navigate to the Test tab to verify functionality

## License

MIT License - see LICENSE file for details.

## Contributing

This is a proof-of-concept project. Contributions are welcome for:
- Enhanced security implementations
- Additional Signal Protocol features
- Performance optimizations
- Documentation improvements