# 聚会小游戏酒馆 Firebase 接入说明

这个项目现在支持两种房间模式：

- 默认模式：浏览器本地房间，不需要数据库，适合同一台设备或同浏览器标签页试玩
- 升级模式：Firebase 匿名登录 + Firestore 实时同步，适合不同手机和电脑进入同一个房间

## 1. 创建 Firebase 项目

1. 打开 Firebase 控制台，新建一个项目。
2. 在项目里新增一个 Web App。
3. 记下 Firebase 提供的 Web 配置对象。

## 2. 开启匿名登录

1. 打开 `Authentication`
2. 进入 `Sign-in method`
3. 开启 `Anonymous`

## 3. 开启 Firestore

1. 打开 `Firestore Database`
2. 创建数据库
3. 先用测试模式或自定义规则启动

推荐的 MVP 规则如下：

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /partyRooms/{roomId} {
      allow read, write: if request.auth != null;

      match /members/{memberId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

这套规则适合先把聚会房间跑起来。后面如果你想做更严格的房主管理、邀请码校验或可写字段限制，再继续细化规则。

## 4. 加授权域名

如果你用 GitHub Pages，记得把下面域名加入 Firebase 授权域名：

- `sumxiaobai.github.io`

如果你后面换了自己的域名，也要把新域名一起加入。

## 5. 填写前端配置

打开项目里的 [firebase-config.js](/Users/bai/game/firebase-config.js)，把 `config: null` 改成你的真实配置，例如：

```js
window.PARTY_TAVERN_FIREBASE = {
  sdkVersion: "12.5.0",
  collection: "partyRooms",
  config: {
    apiKey: "xxx",
    authDomain: "xxx.firebaseapp.com",
    projectId: "xxx",
    storageBucket: "xxx.firebasestorage.app",
    messagingSenderId: "xxx",
    appId: "xxx",
  },
};
```

## 6. 推送到 GitHub Pages

配置填好之后重新提交并推送，别人再打开 GitHub Pages 地址时，就会自动使用 Firebase 实时房间。

## 7. 当前实现说明

- 用户是“昵称登录 + Firebase 匿名身份”，不需要额外注册账号
- 房间共享内容包括：首页状态、题库进度、纸牌玩法状态、玩家名单
- 房间成员在线状态依赖前端心跳，断网或直接关页时，列表会在一小段时间后自动清理
- 目前是“最后一次写入生效”的同步策略，适合朋友聚会场景
