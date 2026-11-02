# anitabi-mcp-server

动画巡礼 MCP 服务。用 Bangumi 作品 id 查询 [anitabi 巡礼地图](https://anitabi.cn/map) 上的地点。

- [anitabi 开放 API](https://navi.anitabi.cn/docs/api)
- [Bangumi API](https://github.com/bangumi/api)

需要 Node.js 20+。

## 工具

| 工具 | 作用 |
| --- | --- |
| `search_animate_subject` | 按关键词搜索动画条目，返回 Bangumi subject id |
| `get_bangumi_stage_lite_by_id` | 巡礼概要：城市、数量、代表性地点 |
| `get_bangumi_stage_point_detail_by_id` | 地标详情。默认 20 条，可用 `limit` / `offset` 翻页 |

返回文本是 XML。地标截图来自第三方，展示时保留 `origin` 和 `originURL`。当前开放接口经常不返回地标 `geo`，这时结果里会省略坐标，并附上 `map` 链接。

## 使用方式

```json
{
  "mcpServers": {
    "anitabi-mcp-server": {
      "command": "npx",
      "args": ["-y", "@qiyuor2/anitabi-mcp-server"]
    }
  }
}
```

## 本地开发

```bash
pnpm install
pnpm build
```

```json
{
  "mcpServers": {
    "anitabi-mcp-server": {
      "command": "node",
      "args": ["dist/index.cjs"]
    }
  }
}
```

`args` 使用本仓库构建产物的绝对路径。开发时也可以 `pnpm start`。

```bash
pnpm test
pnpm typecheck
pnpm build && pnpm smoke
ANITABI_LIVE=1 pnpm exec vitest run test/live.test.ts
```

## License

[MIT](./LICENSE.md) License © [QiYuOr2](https://github.com/QiYuOr2)
