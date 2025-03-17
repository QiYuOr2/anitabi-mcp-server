# anitabi-mcp-server

- [anitabi 巡礼地图](https://anitabi.cn/map)
- [anitabi 文档](https://github.com/anitabi/anitabi.cn-document)

## 使用方式

### NPX

```json
{
  "mcpServers": {
    "anitabi-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@qiyuor2/anitabi-mcp-server"
      ]
    }
  }
}
```

## 本地开发

### 配置

```json
{
  "mcpServers": {
    "anitabi-mcp-server": {
      "command": "node",
      "args": [
        "C:\\Users\\11762\\@qiyuor2\\anitabi-mcp-server\\dist\\index.cjs"
      ]
    }
  }
}
```

### 发布

```bash
pnpm publish --access=public
```

## License

[MIT](./LICENSE) License © [QiYuOr2](https://github.com/QiYuOr2)

<!-- Badges -->
