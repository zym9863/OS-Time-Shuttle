# 开发说明

## 项目架构

```
src/
├── core/              # 核心逻辑
│   └── OSTimeShuttle.ts    # 主要的3D场景管理器
├── data/              # 数据文件
│   └── osData.ts          # 操作系统数据和连接关系
├── types/             # 类型定义
│   └── index.ts           # TypeScript接口
├── ui/                # UI组件
│   ├── OSInfoPanel.ts     # 信息面板组件
│   └── ControlPanel.ts    # 控制面板组件
├── effects/           # 视觉效果
│   └── VisualEffects.ts   # 各种3D视觉效果
├── utils/             # 工具函数
│   └── OSUtils.ts         # 操作系统相关工具函数
├── main.ts            # 应用入口
└── style.css          # 全局样式
```

## 关键类说明

### OSTimeShuttle
主要的3D场景管理器，负责：
- 创建和管理Three.js场景
- 渲染操作系统节点和连接线
- 处理用户交互（点击、拖拽、缩放）
- 管理动画和视觉效果

### OSInfoPanel
操作系统信息展示面板，功能：
- 显示详细的操作系统信息
- 支持动画显示/隐藏
- 响应式设计

### ControlPanel
控制面板组件，包含：
- 时间范围筛选器
- 操作系统类型过滤器
- 视图控制按钮

## 数据结构

### OSData
```typescript
interface OSData {
  id: string;           // 唯一标识符
  name: string;         // 操作系统名称
  year: number;         // 发布年份
  description: string;  // 描述
  company: string;      // 开发公司
  keyPersons: string[]; // 关键人物
  techFeatures: string[]; // 技术特性
  significance: string; // 历史意义
  influences: string[]; // 影响来源
  influenced: string[]; // 影响的系统
  category: string;     // 类别
  color: string;        // 主题色
}
```

### ConnectionData
```typescript
interface ConnectionData {
  from: string;         // 起始系统ID
  to: string;          // 目标系统ID
  type: string;        // 连接类型（influence/evolution/inspiration）
  strength: number;    // 影响强度（0-1）
}
```

## 开发指南

### 添加新的操作系统
1. 在 `src/data/osData.ts` 中添加新的 OSData 对象
2. 设置合适的位置、颜色和分类
3. 添加相关的连接关系

### 添加新的视觉效果
1. 在 `src/effects/VisualEffects.ts` 中添加新的静态方法
2. 在 OSTimeShuttle 中调用新效果
3. 可以添加到动画回调中实现动态效果

### 添加新的UI组件
1. 在 `src/ui/` 目录下创建新组件
2. 在 `src/style.css` 中添加相应样式
3. 在主应用中集成新组件

### 性能优化建议
1. 使用 Three.js 的实例化渲染处理大量节点
2. 实现视口剔除避免渲染屏幕外对象
3. 使用 LOD（细节层次）系统
4. 优化材质和纹理使用

## 调试技巧

### 控制台命令
在浏览器控制台中可以使用：
```javascript
// 访问主应用实例
window.osApp

// 获取当前场景统计
window.osApp.getStats()

// 聚焦到特定操作系统
window.osApp.focusOS('unix')
```

### 性能监控
使用 Three.js 的 Stats.js 可以监控性能：
```javascript
import Stats from 'three/examples/jsm/libs/stats.module.js';
```

## 部署说明

### 构建生产版本
```bash
pnpm build
```

### 静态文件服务
构建后的文件在 `dist/` 目录，可以部署到任何静态文件服务器。

### 环境变量
- `VITE_API_BASE_URL`: API基础URL（如果需要）
- `VITE_ENABLE_DEBUG`: 启用调试模式

## 扩展想法

### 短期目标
- [ ] 添加音效和背景音乐
- [ ] 实现VR模式支持
- [ ] 添加导出功能（图片/视频）
- [ ] 实现多语言支持

### 长期目标
- [ ] 数据库集成
- [ ] 用户贡献系统
- [ ] 实时协作功能
- [ ] AI推荐系统

## 贡献指南

1. Fork项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建Pull Request

## 常见问题

### Q: 如何添加更多操作系统？
A: 编辑 `src/data/osData.ts` 文件，按照现有格式添加新数据。

### Q: 如何修改视觉效果？
A: 在 `src/effects/VisualEffects.ts` 中修改或添加新的效果函数。

### Q: 如何优化性能？
A: 考虑减少粒子数量、优化材质、使用实例化渲染等技术。

### Q: 如何自定义主题？
A: 修改 `src/style.css` 中的CSS变量和颜色定义。
