export const getRegistrationPayload = (clientKey: string | null) => ({
  type: 'register',
  id: 'register_0',
  payload: {
    forcePairing: false,
    pairingType: 'PROMPT',
    'client-key': clientKey || undefined,
    manifest: {
      manifestVersion: 1,
      appVersion: '1.1',
      signed: {
        created: '20140509',
        appId: 'com.lge.test',
        vendorId: 'com.lge',
        localizedAppNames: {
          '': 'LG Remote App',
          'sv-SE': 'LG Fjärrkontroll',
        },
        localizedVendorNames: {
          '': 'LG Electronics',
        },
        permissions: [
          'TEST_SECURE',
          'CONTROL_INPUT_TEXT',
          'CONTROL_MOUSE_AND_KEYBOARD',
          'READ_INSTALLED_APPS',
          'READ_LGE_SDX',
          'READ_NOTIFICATIONS',
          'SEARCH',
          'WRITE_SETTINGS',
          'WRITE_NOTIFICATION_ALERT',
          'CONTROL_POWER',
          'READ_CURRENT_CHANNEL',
          'READ_RUNNING_APPS',
          'READ_UPDATE_INFO',
          'UPDATE_FROM_REMOTE_APP',
          'READ_LGE_TV_INPUT_EVENTS',
          'READ_TV_CURRENT_TIME',
        ],
        serial: '2f930e2d2cfe083771f68e4fe7bb07',
      },
      permissions: [
        'LAUNCH',
        'LAUNCH_WEBAPP',
        'APP_TO_APP',
        'CLOSE',
        'TEST_OPEN',
        'TEST_PROTECTED',
        'CONTROL_AUDIO',
        'CONTROL_DISPLAY',
        'CONTROL_INPUT_JOYSTICK',
        'CONTROL_INPUT_MEDIA_RECORDING',
        'CONTROL_INPUT_MEDIA_PLAYBACK',
        'CONTROL_INPUT_TV',
        'CONTROL_POWER',
        'READ_APP_STATUS',
        'READ_CURRENT_CHANNEL',
        'READ_INPUT_DEVICE_LIST',
        'READ_NETWORK_STATE',
        'READ_RUNNING_APPS',
        'READ_TV_CHANNEL_LIST',
        'WRITE_NOTIFICATION_TOAST',
        'READ_POWER_STATE',
        'READ_COUNTRY_INFO',
      ],
      signatures: [
        {
          signatureVersion: 1,
          signature: 'eyJhbGciOiJSUzI1NiIsImtpZCI6InRlc3Qtc2lnbmluZy1jZXJ0Iiwic2lnbmF0dXJlIjoiVGVzdFNpZ25hdHVyZTIwMTQwNTA5In0=',
        },
      ],
    },
  },
});

export const COMMANDS = {
  // Power
  POWER_OFF: 'ssap://system/turnOff',
  
  // Audio
  VOLUME_UP: 'ssap://audio/volumeUp',
  VOLUME_DOWN: 'ssap://audio/volumeDown',
  SET_VOLUME: 'ssap://audio/setVolume',
  GET_VOLUME: 'ssap://audio/getVolume',
  SET_MUTE: 'ssap://audio/setMute',
  
  // Media / Playback
  PLAY: 'ssap://media.controls/play',
  PAUSE: 'ssap://media.controls/pause',
  STOP: 'ssap://media.controls/stop',
  REWIND: 'ssap://media.controls/rewind',
  FAST_FORWARD: 'ssap://media.controls/fastForward',
  
  // Channels
  CHANNEL_UP: 'ssap://tv/channelUp',
  CHANNEL_DOWN: 'ssap://tv/channelDown',
  
  // Apps & Inputs
  LAUNCH_APP: 'ssap://system.launcher/launch',
  GET_APPS: 'ssap://com.webos.applicationManager/listLaunchPoints',
  GET_CURRENT_APP: 'ssap://com.webos.applicationManager/getForegroundAppInfo',
  GET_INPUTS: 'ssap://tv/getExternalInputList',
  SET_INPUT: 'ssap://tv/switchInput',
  
  // Notifications
  SHOW_TOAST: 'ssap://system.notifications/createToast',
  
  // System Info
  GET_SYSTEM_INFO: 'ssap://system/getSystemInfo',
  
  // Input (Mouse/Keyboard)
  GET_POINTER_INPUT_SOCKET: 'ssap://com.webos.service.networkinput/getPointerInputSocket',
  INSERT_TEXT: 'ssap://com.webos.service.ime/insertText',
  SEND_ENTER: 'ssap://com.webos.service.ime/sendEnterKey',
  DELETE_CHAR: 'ssap://com.webos.service.ime/deleteCharacters',
};
