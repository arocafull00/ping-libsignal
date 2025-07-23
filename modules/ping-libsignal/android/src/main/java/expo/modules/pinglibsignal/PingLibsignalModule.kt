package expo.modules.pinglibsignal

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise

import org.whispersystems.libsignal.IdentityKeyPair
import org.whispersystems.libsignal.IdentityKey
import org.whispersystems.libsignal.state.PreKeyRecord
import org.whispersystems.libsignal.state.SignedPreKeyRecord
import org.whispersystems.libsignal.util.KeyHelper


import android.util.Base64
import java.net.URL

class PingLibsignalModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("PingLibsignal")

    Constants("PI" to Math.PI)

    Events("onChange")

    Function("hello") {
      "Hello world! 👋"
    }
AsyncFunction("testLibSignal") { promise: Promise ->
  try {
    val identityKeyPair = KeyHelper.generateIdentityKeyPair()
    val public = android.util.Base64.encodeToString(identityKeyPair.publicKey.serialize(), android.util.Base64.NO_WRAP)
    val private = android.util.Base64.encodeToString(identityKeyPair.privateKey.serialize(), android.util.Base64.NO_WRAP)
    promise.resolve(mapOf("pub" to public, "priv" to private))
  } catch (e: Exception) {
    promise.reject("LIBSIGNAL_ERROR", e.message, e)
  }
}

    
  }
}
