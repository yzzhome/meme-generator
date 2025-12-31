# 表情包生成器 - Meme Generator

一个基于 Next.js 和 InstantDB 的全栈表情包生成应用。

## 功能特性

- 🎨 创建表情包：上传图片或使用模板，添加自定义文本
- 📝 文本编辑：支持多种字体、颜色、大小和样式
- 🖼️ 实时预览：所见即所得的编辑体验
- 📤 发布分享：将表情包发布到社区
- 👍 点赞功能：为喜欢的表情包点赞
- 🔄 实时同步：使用 InstantDB 实现实时数据同步

## 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **数据库**: InstantDB
- **样式**: CSS (全局样式)

## 开始使用

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx          # 首页（创建表情包）
│   ├── browse/           # 浏览页面
│   └── globals.css       # 全局样式
├── components/            # React 组件
│   ├── MemeEditor/       # 编辑器组件
│   ├── MemeGallery/      # 画廊组件
│   └── Navigation/       # 导航组件
├── hooks/                # 自定义 Hooks
├── lib/                  # 工具库
│   ├── db.ts            # InstantDB 初始化
│   ├── auth.ts          # 用户认证
│   └── storage.ts       # 文件存储
├── types/               # TypeScript 类型定义
└── public/              # 静态资源
    └── assets/          # 模板图片
```

## InstantDB 配置

应用使用 InstantDB 作为数据库和存储服务。App ID 已配置在 `lib/db.ts` 中。

## 开发说明

- 所有客户端组件都使用 `'use client'` 指令
- Canvas 操作和 InstantDB 查询都在客户端执行
- 用户认证使用 localStorage 存储用户 ID

## 许可证

MIT
