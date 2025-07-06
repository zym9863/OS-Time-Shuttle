import './style.css';
import { OSTimeShuttle } from './core/OSTimeShuttle.js';
import { OSInfoPanel } from './ui/OSInfoPanel.js';
import { ControlPanel } from './ui/ControlPanel.js';
import { osData, connections } from './data/osData.js';

class OSTimeShuttleApp {
  private timeShuttle!: OSTimeShuttle;
  private infoPanel!: OSInfoPanel;
  private controlPanel!: ControlPanel;
  private canvasContainer!: HTMLElement;

  constructor() {
    this.init();
  }

  private init(): void {
    this.setupDOM();
    this.setupComponents();
    this.setupEventListeners();
    this.start();
  }

  private setupDOM(): void {
    const app = document.querySelector<HTMLDivElement>('#app')!;
    app.innerHTML = `
      <div class="canvas-container" id="canvas-container"></div>
    `;
    
    this.canvasContainer = document.getElementById('canvas-container')!;
  }

  private setupComponents(): void {
    // 初始化3D场景
    this.timeShuttle = new OSTimeShuttle(this.canvasContainer);
    
    // 初始化UI组件
    this.infoPanel = new OSInfoPanel(document.body);
    this.controlPanel = new ControlPanel(this.canvasContainer);
    
    // 设置回调函数
    this.timeShuttle.setOSSelectCallback((osData) => {
      this.infoPanel.show(osData);
    });

    this.controlPanel.setTimeRangeCallback((startYear, endYear) => {
      this.filterByTimeRange(startYear, endYear);
    });

    this.controlPanel.setCategoryFilterCallback((categories) => {
      this.filterByCategory(categories);
    });

    this.controlPanel.setResetCallback(() => {
      this.resetView();
    });
  }

  private setupEventListeners(): void {
    // 键盘快捷键
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'Escape':
          if (this.infoPanel.isOpen()) {
            this.infoPanel.hide();
          }
          break;
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            this.resetView();
          }
          break;
        case 'f':
        case 'F':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            this.focusRandomOS();
          }
          break;
      }
    });

    // 显示加载提示
    this.showLoadingMessage();
  }

  private showLoadingMessage(): void {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-message';
    loadingDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      z-index: 9999;
      font-family: Arial, sans-serif;
    `;
    loadingDiv.innerHTML = `
      <div style="margin-bottom: 10px;">🚀 正在启动时光穿梭机...</div>
      <div style="font-size: 0.8em; color: #ccc;">加载操作系统数据和3D场景</div>
    `;
    document.body.appendChild(loadingDiv);

    // 3秒后自动移除加载提示
    setTimeout(() => {
      const loading = document.getElementById('loading-message');
      if (loading) {
        loading.style.opacity = '0';
        loading.style.transition = 'opacity 0.5s';
        setTimeout(() => loading.remove(), 500);
      }
    }, 3000);
  }

  private focusRandomOS(): void {
    const osIds = Array.from(this.timeShuttle['osNodes'].keys());
    if (osIds.length > 0) {
      const randomId = osIds[Math.floor(Math.random() * osIds.length)];
      this.timeShuttle.focusOnOS(randomId);
    }
  }

  private filterByTimeRange(startYear: number, endYear: number): void {
    const filteredData = osData.filter(os => 
      os.year >= startYear && os.year <= endYear
    );
    
    this.updateVisualization(filteredData);
  }

  private filterByCategory(categories: string[]): void {
    const filteredData = osData.filter(os => 
      categories.includes(os.category)
    );
    
    this.updateVisualization(filteredData);
  }

  private updateVisualization(filteredData: typeof osData): void {
    // 清除现有可视化
    this.timeShuttle.createTimeline(filteredData);
    
    // 过滤相关连接
    const filteredConnections = connections.filter(conn => 
      filteredData.some(os => os.id === conn.from) && 
      filteredData.some(os => os.id === conn.to)
    );
    
    this.timeShuttle.createConnections(filteredConnections);
  }

  private resetView(): void {
    this.updateVisualization(osData);
    this.timeShuttle.resetCamera();
  }

  private start(): void {
    // 创建初始可视化
    this.timeShuttle.createTimeline(osData);
    this.timeShuttle.createConnections(connections);
    
    // 开始动画循环
    this.timeShuttle.animate();
    
    // 输出统计信息
    console.log('🚀 OS时光穿梭机已启动！');
    console.log('📊 已加载', osData.length, '个操作系统');
    console.log('🔗 已加载', connections.length, '个连接关系');
    
    // 显示操作提示
    setTimeout(() => {
      this.showWelcomeToast();
    }, 4000);
  }

  private showWelcomeToast(): void {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      font-family: Arial, sans-serif;
      max-width: 300px;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    `;
    
    toast.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">🎉 欢迎来到OS时光穿梭机！</div>
      <div style="font-size: 0.9em; opacity: 0.9;">
        点击节点探索操作系统的详细信息<br>
        拖拽可以旋转视角，滚轮缩放
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 6000);
  }
}

// 启动应用
new OSTimeShuttleApp();
