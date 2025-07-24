export type ChangeEventPayload = {
  value: string;
};

export type PingLibsignalModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type LibSignalKeyPair = {
  pub: string;
  priv: string;
};

export type PreKeyBundle = {
  preKeys: string[];
};

export type SignedPreKey = {
  signedPreKey: string;
};

export type EncryptedMessage = {
  encrypted: string;
};

export type SessionInfo = {
  sessionId: string;
};