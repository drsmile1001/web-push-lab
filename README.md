# 研究使用 Firebase Cloud Messaging 推送消息

使用 vite-plugin-pwa 幫助在建置時，同時打包 sw.js 檔案。

尚未研究出 vite-plugin-pwa 提供的開發環境下建置並註冊 service worker 的方法。

## 建置部署方法
執行以下

```shell
yarn
yarn build
```

將 dist 資料夾內容複製到網站伺服器的 `/web-push-lab/` 中。如果需要更改路徑，則修改`package.json` 中的 `build` 指令的 `base` 參數。

