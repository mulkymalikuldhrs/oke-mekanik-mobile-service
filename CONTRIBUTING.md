# Contributing to Oke Mekanik Mobile Service

Thank you for your interest in contributing to **Oke Mekanik**! We welcome contributions from everyone. This guide will help you get started.

---

## 🇬🇧 English | 🇮🇩 Bahasa Indonesia | 🇨🇳 中文

---

## 🇬🇧 English

### Code of Conduct

This project follows the [Contributor Covenant Code of Conduct v2.1](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code. Please report unacceptable behavior to [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com).

### Getting Started

#### Prerequisites

- **Node.js** >= 18
- **npm** >= 9 (or bun >= 1.0)
- **Git** >= 2.40
- A code editor (we recommend VS Code with the recommended extensions)

#### Setup

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/oke-mekanik-mobile-service.git
cd oke-mekanik-mobile-service

# 3. Add upstream remote
git remote add upstream https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service.git

# 4. Install dependencies
npm install

# 5. Copy environment variables
cp .env.example .env

# 6. Start development server
npm run dev
```

This starts both the Vite frontend and Express backend concurrently.

### Development Workflow

#### Branch Naming

Use the following prefixes for your branches:

| Prefix    | Purpose                          | Example                        |
|-----------|----------------------------------|--------------------------------|
| `feat/`   | New features                     | `feat/ai-diagnostics-panel`    |
| `fix/`    | Bug fixes                        | `fix/booking-status-update`    |
| `docs/`   | Documentation changes            | `docs/api-endpoints`           |
| `refactor/` | Code refactoring               | `refactor/auth-middleware`      |
| `i18n/`   | Translations and localization    | `i18n/chinese-booking-page`    |

#### Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `i18n`

**Examples:**
```
feat(booking): add real-time status updates via WebSocket
fix(auth): resolve token expiration edge case
i18n(mechanic-dashboard): add Chinese translations
docs(api): update booking endpoints documentation
```

### Code Standards

#### Zero-Mock Policy

We enforce a **Zero-Mock Policy** for tests:
- **No `jest.fn()`**, `vi.fn()`, or manual mocks for internal modules
- Test against **real implementations** and **real database** (in-memory SQLite for tests)
- Use **real HTTP requests** in integration tests (Playwright)
- If a dependency must be replaced, use **test doubles** that implement the real interface

#### API Patterns

- Express controllers live in `server/controllers/`
- Routes live in `server/routes/`
- Each resource has its own controller and route file (e.g., `bookingController.js` + `bookingRoutes.js`)
- Use `express-rate-limit` for rate limiting
- Use `helmet` for security headers
- Validate input with `zod` schemas
- Follow RESTful conventions

#### Frontend Standards

- Pages go in `src/pages/`
- Reusable components go in `src/components/`
- UI primitives use **shadcn/ui** (`src/components/ui/`)
- Follow the **Glassmorphism** design language:
  - Semi-transparent backgrounds with blur effects
  - Subtle borders with glass-like appearance
  - Consistent use of the theme color palette
- Use **Tailwind CSS** for all styling
- Use **TypeScript** for all new files
- Follow React 19 patterns (hooks, functional components)

#### Testing

- **Unit/Integration:** Vitest + React Testing Library
- **E2E:** Playwright
- Run tests: `npm test`
- Run E2E tests: `npx playwright test`

### Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** with clear, conventional commits
3. **Add/update tests** for your changes
4. **Ensure all tests pass:** `npm test`
5. **Lint your code:** `npm run lint`
6. **Update documentation** if needed
7. **Open a Pull Request** using our PR template

#### PR Checklist

- [ ] Code follows project conventions
- [ ] Tests added/updated and passing
- [ ] No mock functions used (Zero-Mock Policy)
- [ ] TypeScript types are correct
- [ ] UI changes follow Glassmorphism design language
- [ ] API changes follow RESTful patterns
- [ ] Documentation updated if needed
- [ ] Commit messages follow Conventional Commits

### Reporting Bugs

Use the [Bug Report template](https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service/issues/new?template=bug_report.md) and include:
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots if applicable
- Browser/device information

### Feature Requests

Use the [Feature Request template](https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service/issues/new?template=feature_request.md) and describe:
- The problem you're solving
- Your proposed solution
- Any alternatives you've considered

### Contact

- **Author:** Mulky Malikul Dhaher
- **Email:** [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)
- **GitHub:** [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)
- **Issues:** [GitHub Issues](https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service/issues)

---

## 🇮🇩 Bahasa Indonesia

### Kode Etik

Proyek ini mengikuti [Contributor Covenant Code of Conduct v2.1](CODE_OF_CONDUCT.md). Dengan berpartisipasi, Anda menyetujui untuk mematuhi kode ini. Laporkan perilaku yang tidak dapat diterima ke [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com).

### Memulai

#### Prasyarat

- **Node.js** >= 18
- **npm** >= 9 (atau bun >= 1.0)
- **Git** >= 2.40
- Editor kode (kami merekomendasikan VS Code dengan ekstensi yang disarankan)

#### Persiapan

```bash
# 1. Fork repositori di GitHub
# 2. Clone fork Anda
git clone https://github.com/USERNAME_ANDA/oke-mekanik-mobile-service.git
cd oke-mekanik-mobile-service

# 3. Tambahkan remote upstream
git remote add upstream https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service.git

# 4. Instal dependensi
npm install

# 5. Salin variabel lingkungan
cp .env.example .env

# 6. Mulai server pengembangan
npm run dev
```

Ini akan menjalankan frontend Vite dan backend Express secara bersamaan.

### Alur Kerja Pengembangan

#### Penamaan Branch

Gunakan prefix berikut untuk branch Anda:

| Prefix      | Tujuan                    | Contoh                           |
|-------------|---------------------------|----------------------------------|
| `feat/`     | Fitur baru                | `feat/panel-diagnostik-ai`       |
| `fix/`      | Perbaikan bug             | `fix/pembaruan-status-booking`   |
| `docs/`     | Perubahan dokumentasi     | `docs/endpoints-api`             |
| `refactor/` | Refaktor kode             | `refactor/middleware-autentikasi` |
| `i18n/`     | Terjemahan & lokalisasi   | `i18n/bahasa-indonesia-booking`  |

#### Konvensi Commit

Kami mengikuti [Conventional Commits](https://www.conventionalcommits.org/):

```
tipe(scope): deskripsi

[body opsional]

[footer opsional]
```

**Tipe:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `i18n`

**Contoh:**
```
feat(booking): tambah pembaruan status real-time via WebSocket
fix(auth): perbaiki kasus khusus token kadaluarsa
i18n(dashboard-mekanik): tambah terjemahan Bahasa Indonesia
docs(api): perbarui dokumentasi endpoint booking
```

### Standar Kode

#### Kebijakan Zero-Mock

Kami menerapkan **Kebijakan Zero-Mock** untuk pengujian:
- **Tidak boleh** menggunakan `jest.fn()`, `vi.fn()`, atau mock manual untuk modul internal
- Pengujian terhadap **implementasi nyata** dan **database nyata** (SQLite in-memory untuk pengujian)
- Gunakan **permintaan HTTP nyata** dalam pengujian integrasi (Playwright)
- Jika dependensi harus diganti, gunakan **test double** yang mengimplementasikan interface asli

#### Pola API

- Controller Express berada di `server/controllers/`
- Routes berada di `server/routes/`
- Setiap resource memiliki file controller dan route sendiri (misalnya, `bookingController.js` + `bookingRoutes.js`)
- Gunakan `express-rate-limit` untuk pembatasan rate
- Gunakan `helmet` untuk header keamanan
- Validasi input dengan skema `zod`
- Ikuti konvensi RESTful

#### Standar Frontend

- Halaman di `src/pages/`
- Komponen yang dapat digunakan kembali di `src/components/`
- Primitif UI menggunakan **shadcn/ui** (`src/components/ui/`)
- Ikuti desain **Glassmorphism**:
  - Latar belakang semi-transparan dengan efek blur
  - Border halus dengan tampilan seperti kaca
  - Penggunaan konsisten palet warna tema
- Gunakan **Tailwind CSS** untuk semua styling
- Gunakan **TypeScript** untuk semua file baru
- Ikuti pola React 19 (hooks, komponen fungsional)

#### Pengujian

- **Unit/Integrasi:** Vitest + React Testing Library
- **E2E:** Playwright
- Jalankan pengujian: `npm test`
- Jalankan pengujian E2E: `npx playwright test`

### Proses Pull Request

1. **Buat branch fitur** dari `main`
2. **Buat perubahan** dengan commit yang jelas dan konvensional
3. **Tambah/perbarui pengujian** untuk perubahan Anda
4. **Pastikan semua pengujian lulus:** `npm test`
5. **Lint kode Anda:** `npm run lint`
6. **Perbarui dokumentasi** jika diperlukan
7. **Buka Pull Request** menggunakan template PR kami

#### Daftar Periksa PR

- [ ] Kode mengikuti konvensi proyek
- [ ] Pengujian ditambah/diperbarui dan lulus
- [ ] Tidak ada fungsi mock (Kebijakan Zero-Mock)
- [ ] Tipe TypeScript benar
- [ ] Perubahan UI mengikuti desain Glassmorphism
- [ ] Perubahan API mengikuti pola RESTful
- [ ] Dokumentasi diperbarui jika diperlukan
- [ ] Pesan commit mengikuti Conventional Commits

### Melaporkan Bug

Gunakan [template Bug Report](https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service/issues/new?template=bug_report.md) dan sertakan:
- Langkah untuk mereproduksi
- Perilaku yang diharapkan vs. aktual
- Screenshot jika berlaku
- Informasi browser/perangkat

### Permintaan Fitur

Gunakan [template Feature Request](https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service/issues/new?template=feature_request.md) dan jelaskan:
- Masalah yang Anda selesaikan
- Solusi yang Anda usulkan
- Alternatif yang telah Anda pertimbangkan

### Kontak

- **Penulis:** Mulky Malikul Dhaher
- **Email:** [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)
- **GitHub:** [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)
- **Issues:** [GitHub Issues](https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service/issues)

---

## 🇨🇳 中文

### 行为准则

本项目遵循 [Contributor Covenant 行为准则 v2.1](CODE_OF_CONDUCT.md)。参与本项目即表示您同意遵守该准则。请将不当行为报告至 [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)。

### 快速开始

#### 前提条件

- **Node.js** >= 18
- **npm** >= 9（或 bun >= 1.0）
- **Git** >= 2.40
- 代码编辑器（推荐 VS Code 及推荐扩展）

#### 环境设置

```bash
# 1. 在 GitHub 上 Fork 仓库
# 2. 克隆您的 Fork
git clone https://github.com/YOUR_USERNAME/oke-mekanik-mobile-service.git
cd oke-mekanik-mobile-service

# 3. 添加上游远程仓库
git remote add upstream https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service.git

# 4. 安装依赖
npm install

# 5. 复制环境变量
cp .env.example .env

# 6. 启动开发服务器
npm run dev
```

这将同时启动 Vite 前端和 Express 后端。

### 开发工作流

#### 分支命名

为您的分支使用以下前缀：

| 前缀       | 用途           | 示例                              |
|-----------|---------------|----------------------------------|
| `feat/`   | 新功能         | `feat/ai-diagnostics-panel`     |
| `fix/`    | 错误修复       | `fix/booking-status-update`     |
| `docs/`   | 文档更改       | `docs/api-endpoints`            |
| `refactor/` | 代码重构     | `refactor/auth-middleware`       |
| `i18n/`   | 翻译和本地化   | `i18n/chinese-booking-page`     |

#### 提交约定

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
类型(范围): 描述

[可选正文]

[可选页脚]
```

**类型：** `feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`chore`、`i18n`

**示例：**
```
feat(booking): 通过 WebSocket 添加实时状态更新
fix(auth): 修复令牌过期边缘情况
i18n(mechanic-dashboard): 添加中文翻译
docs(api): 更新预订端点文档
```

### 代码标准

#### 零模拟策略

我们对测试强制执行 **零模拟策略**：
- **禁止**使用 `jest.fn()`、`vi.fn()` 或内部模块的手动模拟
- 针对**真实实现**和**真实数据库**进行测试（测试使用内存 SQLite）
- 在集成测试中使用**真实 HTTP 请求**（Playwright）
- 如果必须替换依赖项，请使用实现真实接口的**测试替身**

#### API 模式

- Express 控制器位于 `server/controllers/`
- 路由位于 `server/routes/`
- 每个资源都有自己的控制器和路由文件（例如 `bookingController.js` + `bookingRoutes.js`）
- 使用 `express-rate-limit` 进行速率限制
- 使用 `helmet` 设置安全头
- 使用 `zod` 模式验证输入
- 遵循 RESTful 约定

#### 前端标准

- 页面放在 `src/pages/`
- 可复用组件放在 `src/components/`
- UI 原语使用 **shadcn/ui**（`src/components/ui/`）
- 遵循 **Glassmorphism** 设计语言：
  - 带有模糊效果的半透明背景
  - 具有玻璃外观的细微边框
  - 一致使用主题调色板
- 所有样式使用 **Tailwind CSS**
- 所有新文件使用 **TypeScript**
- 遵循 React 19 模式（hooks、函数组件）

#### 测试

- **单元/集成测试：** Vitest + React Testing Library
- **端到端测试：** Playwright
- 运行测试：`npm test`
- 运行 E2E 测试：`npx playwright test`

### Pull Request 流程

1. 从 `main` **创建功能分支**
2. 使用清晰、规范的提交**进行更改**
3. 为您的更改**添加/更新测试**
4. **确保所有测试通过：** `npm test`
5. **代码检查：** `npm run lint`
6. 如有需要**更新文档**
7. 使用我们的 PR 模板**提交 Pull Request**

#### PR 检查清单

- [ ] 代码遵循项目约定
- [ ] 测试已添加/更新并通过
- [ ] 未使用模拟函数（零模拟策略）
- [ ] TypeScript 类型正确
- [ ] UI 更改遵循 Glassmorphism 设计语言
- [ ] API 更改遵循 RESTful 模式
- [ ] 如有需要已更新文档
- [ ] 提交消息遵循 Conventional Commits

### 报告错误

使用[错误报告模板](https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service/issues/new?template=bug_report.md)并包含：
- 重现步骤
- 预期行为与实际行为
- 如适用请附截图
- 浏览器/设备信息

### 功能请求

使用[功能请求模板](https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service/issues/new?template=feature_request.md)并描述：
- 您要解决的问题
- 您提出的解决方案
- 您考虑过的替代方案

### 联系方式

- **作者：** Mulky Malikul Dhaher
- **邮箱：** [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)
- **GitHub：** [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)
- **Issues：** [GitHub Issues](https://github.com/mulkymalikuldhrs/oke-mekanik-mobile-service/issues)

---

*Thank you for contributing to Oke Mekanik! / Terima kasih telah berkontribusi di Oke Mekanik! / 感谢您为 Oke Mekanik 做贡献！*
