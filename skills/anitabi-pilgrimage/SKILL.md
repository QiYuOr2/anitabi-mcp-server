---
name: anitabi-pilgrimage
description: 在已连接 anitabi MCP 时查询动画巡礼地点。用户询问巡礼、圣地、取景地，或某个 Bangumi 作品的地图地点时使用。不要用于作品简介、评分或剧情，也不要直接请求 api.anitabi.cn。
---

# 巡礼查询

只使用已连接的 anitabi MCP 工具。不要自己请求 anitabi 或 Bangumi 的 HTTP 接口。

## 先选工具

- 没有数字 subject id 时，先调用 `search_animate_subject`。出现多个作品时先确认，不要自行选定。
- 已有 id 时，先调用 `get_bangumi_stage_lite_by_id`，看作品、城市和代表性地点。
- 需要某个地点的图片、出处或更多字段时，再调用 `get_bangumi_stage_point_detail_by_id`。用 `limit` 和 `offset` 翻页，不要一次取回全部地标。

## 怎么用结果

- 结果里没有 `geo` 时，不要编造坐标，给出返回的 `map` 链接。
- 展示地点或截图时，保留 `origin` 和 `originURL`。
- 工具返回错误时，把错误告诉用户，不要改走别的接口重试。
