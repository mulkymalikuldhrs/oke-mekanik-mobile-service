<div align="center">

<img src="https://raw.githubusercontent.com/mulkymalikuldhrs/oke-mekanik/main/public/favicon.ico" width="120" alt="Oke Mekanik Logo" />

<h1>Oke Mekanik</h1>

<h3><em>移动维修服务 — 专业车辆维修，送技上门</em></h3>

[![版本](https://img.shields.io/badge/版本-5.8.2-0A84FF?style=for-the-badge)](https://github.com/mulkymalikuldhrs/oke-mekanik)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![许可证](https://img.shields.io/badge/许可证-MIT-green?style=for-the-badge)](./LICENSE)

[English](README.md) | [Bahasa Indonesia](README_id.md) | **中文**

</div>

---

## 🚗 关于 Oke Mekanik

**Oke Mekanik** 是一个全栈 SaaS 平台，将车主与专业维修技师直接连接——送技上门。灵感源自 Gojek/Grab 的服务交付模式，我们将维修车间搬到您的家门口。搭载 **AI 诊断引擎 v5.8.2**、实时 GPS 追踪和毛玻璃 UI，这是为现代时代重新定义的车辆维修体验。再也不用在修车厂排队等候——技师主动来找您。

该平台旨在提供无缝、透明的车辆维修体验。借助先进的 AI 模式匹配技术，客户可以在技师到达之前诊断车辆问题，从而实现更好的准备和更快的完成时间。实时 GPS 追踪系统确保您始终知道技师的位置，而应用内聊天功能允许直接无障碍的沟通。

---

## ✨ 核心功能

| 功能 | 描述 | 状态 |
|:-----|:-----|:----:|
| 🤖 AI 诊断引擎 | 先进模式匹配车辆自动诊断 (v5.8.2) | ✅ |
| 📍 实时 GPS 追踪 | 通过 Socket.io 和 Leaflet 地图实时追踪技师位置 | ✅ |
| ⚡ 即时预约 | 随时预约紧急维修或定期保养 | ✅ |
| ✅ 认证技师 | 仅限经过社区评分与审核的专业技师 | ✅ |
| 💬 应用内聊天 | 客户与技师之间的无缝实时通信 | ✅ |
| 💳 安全支付 | 透明定价与数字支付记录 | ✅ |
| 🌐 多语言 | 完整支持印尼语和英语本地化 | ✅ |
| 📱 PWA 就绪 | 支持离线 Service Worker，可安装为原生应用 | ✅ |
| 🎨 毛玻璃 UI | 现代磨砂玻璃设计搭配 Framer Motion 动画 | ✅ |

---

## 🚀 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/mulkymalikuldhrs/oke-mekanik.git
cd oke-mekanik

# 2. 安装依赖
npm install --legacy-peer-deps

# 3. 初始化数据库
node -e "import('./server/db.js')"

# 4. 启动开发环境（前端 + 后端同时运行）
npm run dev
```

> **前置条件：** Node.js v18+、npm 或 bun

---

## 🛠️ 技术栈

| 层级 | 技术 | 版本 |
|:-----|:-----|:----:|
| **前端** | React | 19 |
| **构建工具** | Vite | 8 |
| **语言** | TypeScript | 5.5 |
| **样式** | Tailwind CSS + shadcn/ui | 3.4 |
| **动画** | Framer Motion | 12.x |
| **状态管理** | TanStack Query | 5.100 |
| **地图** | Leaflet + React-Leaflet | 1.9 / 5.0 |
| **后端** | Express | 5.2.1 |
| **数据库** | Better-SQLite3 | 12.x |
| **实时通信** | Socket.io | 4.8 |
| **认证** | JWT + Bcrypt | — |
| **安全** | Helmet + 速率限制 | 8.x |
| **测试** | Vitest + Playwright | 4.x / 1.x |

---

## 🏗️ 系统架构

Oke Mekanik 采用全栈架构，前后端分离清晰。前端使用 React 19 和 Vite 8 构建，提供响应式用户体验和现代毛玻璃界面。样式使用 Tailwind CSS 和 shadcn/ui 组件确保视觉一致性，Framer Motion 提供流畅自然的动画效果。

后端使用 Express 5.2.1 搭配 Better-SQLite3 作为轻量而可靠的数据存储方案。客户端与服务器之间的实时通信由 Socket.io 处理，支持实时 GPS 追踪和即时聊天。认证通过 JWT 和 Bcrypt 哈希实现，配合 Helmet 防护和速率限制确保 API 安全。

AI 诊断引擎是 Oke Mekanik 的特色组件，使用先进的模式匹配技术根据用户报告的症状诊断车辆问题。该引擎分析用户输入，与全面的车辆问题数据库进行匹配，并提供诊断建议和维修费用估算。

详见 [ARCHITECTURE.md](ARCHITECTURE.md) 了解完整架构文档。

---

## 📬 联系方式

| 渠道 | 信息 |
|:-----|:-----|
| 📧 邮箱 | [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com) |
| 👤 作者 | **Mulky Malikul Dhaher** |
| 🐙 GitHub | [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs) |

---

## 📄 许可证

本项目采用 MIT 许可证 — 详见 [LICENSE](LICENSE) 文件。

---

<div align="center">

> *"精工铸就卓越 — 科技与道路的交汇"*

**Oke Mekanik** © 2024 — 至今 • **Mulky Malikul Dhaher**

</div>
