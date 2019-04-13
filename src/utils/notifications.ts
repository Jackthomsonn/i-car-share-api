import PushNotifications from 'node-pushnotifications';

const push = new PushNotifications({
  gcm: {
    id: undefined
  },
  apn: {
    token: {
      key: './certs/key.p8',
      keyId: 'ABCD',
      teamId: 'EFGH',
    },
    production: false
  }
});

const sendNotification = async (deviceId: string[], notification: any) => {
  try {
    await push.send(deviceId, notification);
  } catch (error) {
    throw new Error(error);
  }
}

export const createNotification = (deviceId: string[], data: any) => {
  const notification = {
    title: data.title,
    topic: 'com.jackthomson.hitchhike',
    body: data.body,
    priority: 'high',
    collapseKey: '',
    contentAvailable: true,
    delayWhileIdle: true,
    restrictedPackageName: '',
    dryRun: false,
    icon: '',
    tag: '',
    color: '',
    clickAction: '',
    locKey: '',
    locArgs: '',
    titleLocKey: '',
    titleLocArgs: '',
    retries: 1,
    encoding: '',
    badge: 2,
    sound: 'ping.aiff',
    alert: {
      title: data.title,
      body: data.body
    },
    launchImage: '',
    action: '',
    category: '',
    urlArgs: '',
    truncateAtWordEnd: true,
    mutableContent: 0,
    threadId: '',
    expiry: Math.floor(Date.now() / 1000) + 28 * 86400,
    timeToLive: 28 * 86400,
  };

  sendNotification(deviceId, notification);
}