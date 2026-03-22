window.PARTY_TAVERN_FIREBASE = {
  sdkVersion: "12.5.0",
  collection: "partyRooms",
  // 把 config 从 null 改成你的 Firebase Web App 配置对象即可启用跨设备实时房间。
  // 这些字段可以直接公开在前端，但仍然需要配合 Authentication 和 Firestore 规则。
  config: null,
  /*
  config: {
    apiKey: "你的 apiKey",
    authDomain: "你的项目.firebaseapp.com",
    projectId: "你的 projectId",
    storageBucket: "你的项目.firebasestorage.app",
    messagingSenderId: "你的 messagingSenderId",
    appId: "你的 appId",
  },
  */
};
