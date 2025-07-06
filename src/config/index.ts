// 应用配置文件
export const APP_CONFIG = {
  // 场景配置
  scene: {
    backgroundColor: 0x0a0a0a,
    fogEnabled: false,
    fogColor: 0x333333,
    fogNear: 50,
    fogFar: 200
  },

  // 相机配置
  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
    initialPosition: { x: 0, y: 10, z: 50 },
    minDistance: 10,
    maxDistance: 200
  },

  // 渲染器配置
  renderer: {
    antialias: true,
    shadowMapEnabled: true,
    shadowMapType: 'PCFSoftShadowMap' as const,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  },

  // 节点配置
  nodes: {
    defaultRadius: 1,
    glowRadius: 1.3,
    orbitRadius: 2.0,
    labelScale: { x: 6, y: 1.5, z: 1 },
    animationSpeed: 0.2,
    floatAmplitude: 0.3
  },

  // 连接线配置
  connections: {
    opacity: 0.7,
    curveHeight: 5,
    arrowSize: 0.3,
    colors: {
      influence: 0x00ff00,
      evolution: 0xff8800,
      inspiration: 0x0088ff,
      highlight: 0xffff00
    }
  },

  // 时间轴配置
  timeline: {
    radius: 0.2,
    color: 0x444444,
    gridEnabled: true,
    gridColor: 0x333333,
    yearMarkInterval: 10
  },

  // 环境效果配置
  environment: {
    starFieldCount: 1500,
    starFieldRadius: 200,
    ambientLightIntensity: 0.4,
    directionalLightIntensity: 0.8,
    pointLightIntensity: 0.5
  },

  // 交互配置
  interaction: {
    clickEnabled: true,
    hoverEnabled: true,
    dragSensitivity: 0.01,
    zoomSensitivity: 0.1,
    autoRotateSpeed: 0.5,
    smoothCameraTransitions: true
  },

  // UI配置
  ui: {
    showControlPanel: true,
    showPerformanceStats: false, // 可以设为true来显示性能统计
    showLoadingScreen: true,
    showWelcomeToast: true,
    toastDuration: 6000,
    loadingDuration: 3000
  },

  // 动画配置
  animation: {
    enableFloating: true,
    enableRotation: true,
    enablePulse: true,
    enableStarRotation: true,
    globalSpeed: 1.0
  },

  // 调试配置
  debug: {
    enabled: import.meta.env.DEV,
    showWireframe: false,
    showBoundingBoxes: false,
    logPerformance: false,
    enableHelpers: false
  }
};

// 类别配置
export const CATEGORY_CONFIG = {
  mainframe: {
    name: '大型机',
    color: '#8B4513',
    icon: '🖥️'
  },
  personal: {
    name: '个人电脑',
    color: '#4169E1',
    icon: '💻'
  },
  server: {
    name: '服务器',
    color: '#2E8B57',
    icon: '🖲️'
  },
  mobile: {
    name: '移动设备',
    color: '#FF6347',
    icon: '📱'
  },
  embedded: {
    name: '嵌入式',
    color: '#9370DB',
    icon: '🔌'
  }
};

// 连接类型配置
export const CONNECTION_CONFIG = {
  influence: {
    name: '影响',
    color: '#00ff00',
    description: '直接技术或设计影响'
  },
  evolution: {
    name: '演化',
    color: '#ff8800',
    description: '直接演化或升级关系'
  },
  inspiration: {
    name: '灵感',
    color: '#0088ff',
    description: '概念或哲学启发'
  }
};

// 键盘快捷键配置
export const KEYBOARD_SHORTCUTS = {
  'Escape': '关闭信息面板',
  'Ctrl+R': '重置视角',
  'Ctrl+F': '聚焦随机OS',
  'Space': '暂停/恢复动画',
  '1-5': '切换类别过滤',
  'H': '显示/隐藏帮助',
  'P': '显示/隐藏性能统计'
};

// 导出默认配置
export default APP_CONFIG;
