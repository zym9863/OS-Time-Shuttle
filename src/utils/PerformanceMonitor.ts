export class PerformanceMonitor {
  private startTime: number = 0;
  private frameCount: number = 0;
  private fps: number = 0;
  private lastTime: number = 0;
  private memoryUsage: number = 0;
  private isMonitoring: boolean = false;
  private onUpdate?: (stats: PerformanceStats) => void;

  constructor() {
    this.startTime = performance.now();
    this.lastTime = this.startTime;
  }

  public start(onUpdate?: (stats: PerformanceStats) => void): void {
    this.isMonitoring = true;
    this.onUpdate = onUpdate;
    this.update();
  }

  public stop(): void {
    this.isMonitoring = false;
  }

  private update(): void {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.frameCount++;

    // 每秒更新一次统计信息
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;

      // 获取内存使用情况（如果可用）
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      }

      // 回调更新
      if (this.onUpdate) {
        this.onUpdate(this.getStats());
      }
    }

    requestAnimationFrame(() => this.update());
  }

  public getStats(): PerformanceStats {
    const currentTime = performance.now();
    return {
      fps: this.fps,
      memoryUsage: this.memoryUsage,
      runtime: Math.round((currentTime - this.startTime) / 1000),
      frameCount: this.frameCount
    };
  }

  public createStatsPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.id = 'performance-stats';
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: #00ff00;
      padding: 10px;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 9999;
      min-width: 120px;
      border: 1px solid #333;
    `;

    panel.innerHTML = `
      <div>FPS: <span id="fps-value">--</span></div>
      <div>Memory: <span id="memory-value">--</span> MB</div>
      <div>Runtime: <span id="runtime-value">--</span> s</div>
    `;

    document.body.appendChild(panel);

    // 开始监控并更新面板
    this.start((stats) => {
      const fpsEl = document.getElementById('fps-value');
      const memoryEl = document.getElementById('memory-value');
      const runtimeEl = document.getElementById('runtime-value');

      if (fpsEl) fpsEl.textContent = stats.fps.toString();
      if (memoryEl) memoryEl.textContent = stats.memoryUsage.toString();
      if (runtimeEl) runtimeEl.textContent = stats.runtime.toString();

      // 根据FPS调整颜色
      if (fpsEl) {
        if (stats.fps >= 50) {
          fpsEl.style.color = '#00ff00';
        } else if (stats.fps >= 30) {
          fpsEl.style.color = '#ffff00';
        } else {
          fpsEl.style.color = '#ff0000';
        }
      }
    });

    return panel;
  }

  public removeStatsPanel(): void {
    const panel = document.getElementById('performance-stats');
    if (panel) {
      panel.remove();
      this.stop();
    }
  }
}

export interface PerformanceStats {
  fps: number;
  memoryUsage: number;
  runtime: number;
  frameCount: number;
}

// 全局性能监控实例
export const performanceMonitor = new PerformanceMonitor();
