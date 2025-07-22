# ping-libsignal-poc

A React Native/Expo application demonstrating the integration of libsignal for secure messaging and encryption capabilities.

## Overview

This project showcases how to integrate libsignal (Signal Protocol) into a React Native application using Expo modules. The implementation includes a custom native module that wraps libsignal functionality for Android, providing secure key generation and cryptographic operations.

## Project Structure

```
ping-libsignal-poc/
├── app/                    # Expo Router app directory
│   └── (tabs)/
│       └── test.tsx        # Test screen demonstrating libsignal usage
├── modules/
│   └── ping-libsignal/     # Custom Expo module for libsignal
│       ├── android/        # Android native implementation
│       ├── src/           # TypeScript definitions and module exports
│       └── package.json   # Module configuration
└── libs/                  # External libraries
    └── libsignal-android-0.76.5.aar
```

## Libsignal Integration

### 1. Module Structure (`/modules/ping-libsignal`)

The libsignal integration is implemented as a custom Expo module with the following structure:

#### TypeScript Layer (`/src`)
- **`PingLibsignalModule.ts`**: Main module interface that bridges React Native and native code
- **`PingLibsignal.types.ts`**: TypeScript type definitions for module events and props
- **`index.ts`**: Module entry point that exports the native module

#### Android Native Layer (`/android`)
- **`PingLibsignalModule.kt`**: Kotlin implementation of the native module
- **`build.gradle`**: Android build configuration with libsignal dependencies
- **`libs/libsignal-client.aar`**: Libsignal Android library (113MB)

### 2. Android Implementation

The Android module (`PingLibsignalModule.kt`) provides:

```kotlin
class PingLibsignalModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("PingLibsignal")
    
    // Constants available to JavaScript
    Constants("PI" to Math.PI)
    
    // Events that can be emitted to JavaScript
    Events("onChange")
    
    // Synchronous functions
    Function("hello") {
      "Hello world! 👋"
    }
    
    // Asynchronous functions
    AsyncFunction("testLibSignal") { promise: Promise ->
      try {
        val identityKeyPair = KeyHelper.generateIdentityKeyPair()
        val public = Base64.encodeToString(identityKeyPair.publicKey.serialize(), Base64.NO_WRAP)
        val private = Base64.encodeToString(identityKeyPair.privateKey.serialize(), Base64.NO_WRAP)
        promise.resolve(mapOf("pub" to public, "priv" to private))
      } catch (e: Exception) {
        promise.reject("LIBSIGNAL_ERROR", e.message, e)
      }
    }
  }
}
```

### 3. Dependencies Configuration

The Android module includes the following dependencies in `build.gradle`:

```gradle
dependencies {
  implementation fileTree(dir: 'libs', include: ['*.aar'])
  implementation 'org.whispersystems:signal-protocol-android:2.2.0'
  implementation 'org.whispersystems:signal-protocol-java:2.8.1'
  implementation 'androidx.annotation:annotation:1.5.0'
  implementation 'androidx.core:core-ktx:1.9.0'
}
```

## Usage in the App

### Test Screen (`/app/(tabs)/test.tsx`)

The test screen demonstrates how to use the libsignal module:

```typescript
import pingLibsignal from '../../modules/ping-libsignal';

export default function TestScreen() {
  const [libSignalResult, setLibSignalResult] = useState<{ pub: string; priv: string } | null>(null);

  const testLibSignal = async () => {
    try {
      const result = await pingLibsignal.testLibSignal();
      setLibSignalResult(result);
    } catch (error) {
      Alert.alert('LibSignal Error', `Failed to test LibSignal: ${error}`);
    }
  };

  // Display results
  {libSignalResult && (
    <ResultCard 
      title="LibSignal Result" 
      content={
        <View>
          <Text>Public Key: {libSignalResult.pub}</Text>
          <Text>Private Key: {libSignalResult.priv}</Text>
        </View>
      }
    />
  )}
}
```

### Available Functions

1. **`pingLibsignal.hello()`**: Returns a greeting string
2. **`pingLibsignal.PI`**: Access to the mathematical constant PI
3. **`pingLibsignal.testLibSignal()`**: Generates a libsignal identity key pair and returns base64-encoded public and private keys

## Extending Libsignal Functionality

To add more libsignal functions to the Android module, follow this pattern:

### 1. Add New Functions to `PingLibsignalModule.kt`

```kotlin
// Synchronous function
Function("generatePreKey") {
  val preKey = KeyHelper.generatePreKeys(1, 1).first()
  Base64.encodeToString(preKey.serialize(), Base64.NO_WRAP)
}

// Asynchronous function with parameters
AsyncFunction("encryptMessage") { message: String, recipientPublicKey: String, promise: Promise ->
  try {
    // Decode recipient's public key
    val recipientKeyBytes = Base64.decode(recipientPublicKey, Base64.NO_WRAP)
    val recipientKey = IdentityKey(recipientKeyBytes, 0)
    
    // Encrypt message logic here
    val encryptedMessage = "encrypted_message_here"
    
    promise.resolve(mapOf("encrypted" to encryptedMessage))
  } catch (e: Exception) {
    promise.reject("ENCRYPTION_ERROR", e.message, e)
  }
}

// Function with multiple parameters
AsyncFunction("createSession") { 
  recipientId: String, 
  recipientPublicKey: String, 
  promise: Promise 
->
  try {
    // Session creation logic
    val sessionId = "session_${System.currentTimeMillis()}"
    promise.resolve(mapOf("sessionId" to sessionId))
  } catch (e: Exception) {
    promise.reject("SESSION_ERROR", e.message, e)
  }
}
```

### 2. Update TypeScript Definitions

Add the new function signatures to `PingLibsignalModule.ts`:

```typescript
declare class PingLibsignalModule extends NativeModule<PingLibsignalModuleEvents> {
  PI: number;
  hello(): string;
  generatePreKey(): string;
  testLibSignal(): Promise<{ pub: string; priv: string }>;
  encryptMessage(message: string, recipientPublicKey: string): Promise<{ encrypted: string }>;
  createSession(recipientId: string, recipientPublicKey: string): Promise<{ sessionId: string }>;
}
```

### 3. Common Libsignal Operations to Implement

Here are some useful libsignal functions you can add:

#### Key Management
- **PreKey Generation**: Generate one-time prekeys for asynchronous messaging
- **Signed PreKey Generation**: Generate signed prekeys for authentication
- **Key Exchange**: Perform Diffie-Hellman key exchange

#### Messaging
- **Message Encryption**: Encrypt messages for specific recipients
- **Message Decryption**: Decrypt incoming messages
- **Group Messaging**: Handle group chat encryption

#### Session Management
- **Session Creation**: Establish secure sessions with contacts
- **Session Storage**: Persist session state
- **Session Verification**: Verify session integrity

#### Example Implementation

```kotlin
// Generate prekeys for asynchronous messaging
AsyncFunction("generatePreKeys") { count: Int, promise: Promise ->
  try {
    val preKeys = KeyHelper.generatePreKeys(1, count)
    val serializedKeys = preKeys.map { preKey ->
      Base64.encodeToString(preKey.serialize(), Base64.NO_WRAP)
    }
    promise.resolve(mapOf("preKeys" to serializedKeys))
  } catch (e: Exception) {
    promise.reject("PREKEY_ERROR", e.message, e)
  }
}

// Generate signed prekey
AsyncFunction("generateSignedPreKey") { identityKeyPair: String, promise: Promise ->
  try {
    val identityKeyBytes = Base64.decode(identityKeyPair, Base64.NO_WRAP)
    val identityKey = IdentityKeyPair(identityKeyBytes)
    val signedPreKey = KeyHelper.generateSignedPreKey(identityKey, System.currentTimeMillis())
    
    val serialized = Base64.encodeToString(signedPreKey.serialize(), Base64.NO_WRAP)
    promise.resolve(mapOf("signedPreKey" to serialized))
  } catch (e: Exception) {
    promise.reject("SIGNED_PREKEY_ERROR", e.message, e)
  }
}
```

## Building and Testing

1. **Install dependencies**: `npm install`
2. **Start the development server**: `npx expo start`
3. **Run on Android**: Press 'a' in the terminal or scan the QR code with Expo Go
4. **Test libsignal functions**: Navigate to the test tab and use the "Test LibSignal" button

## Security Considerations

- **Key Storage**: Implement secure storage for private keys (consider using Android Keystore)
- **Key Rotation**: Implement regular key rotation for long-term security
- **Session Management**: Properly manage session state and cleanup
- **Error Handling**: Implement proper error handling for cryptographic operations

## Dependencies

- **Expo SDK**: Latest version
- **libsignal-client**: 0.76.5 (Android AAR)
- **signal-protocol-android**: 2.2.0
- **signal-protocol-java**: 2.8.1

## License

MIT License - see LICENSE file for details.
