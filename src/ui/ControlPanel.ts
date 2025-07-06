export class ControlPanel {
  private container: HTMLElement;
  private panel!: HTMLElement;
  private onTimeRangeChange?: (startYear: number, endYear: number) => void;
  private onCategoryFilter?: (categories: string[]) => void;
  private onReset?: () => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.createPanel();
  }

  private createPanel(): void {
    this.panel = document.createElement('div');
    this.panel.className = 'control-panel';
    this.panel.innerHTML = `
      <div class="panel-title">
        <h3>🚀 OS 时光穿梭机</h3>
      </div>
      
      <div class="control-section">
        <h4>时间范围</h4>
        <div class="time-range">
          <input type="range" id="start-year" min="1960" max="2025" value="1960" step="1">
          <span class="year-display" id="start-display">1960</span>
          <span>-</span>
          <input type="range" id="end-year" min="1960" max="2025" value="2025" step="1">
          <span class="year-display" id="end-display">2025</span>
        </div>
      </div>

      <div class="control-section">
        <h4>系统类型</h4>
        <div class="category-filters">
          <label><input type="checkbox" value="mainframe" checked> 大型机</label>
          <label><input type="checkbox" value="personal" checked> 个人电脑</label>
          <label><input type="checkbox" value="server" checked> 服务器</label>
          <label><input type="checkbox" value="mobile" checked> 移动设备</label>
          <label><input type="checkbox" value="embedded" checked> 嵌入式</label>
        </div>
      </div>

      <div class="control-section">
        <h4>视图控制</h4>
        <div class="view-controls">
          <button id="reset-view">重置视角</button>
          <button id="focus-timeline">聚焦时间轴</button>
          <button id="show-connections">显示所有连接</button>
        </div>
      </div>

      <div class="control-section">
        <h4>信息</h4>
        <div class="info-text">
          <p>🖱️ 点击节点查看详情</p>
          <p>🎯 拖拽旋转视角</p>
          <p>🔍 滚轮缩放</p>
        </div>
      </div>
    `;

    this.container.appendChild(this.panel);
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // 时间范围控制
    const startYearSlider = this.panel.querySelector('#start-year') as HTMLInputElement;
    const endYearSlider = this.panel.querySelector('#end-year') as HTMLInputElement;
    const startDisplay = this.panel.querySelector('#start-display') as HTMLElement;
    const endDisplay = this.panel.querySelector('#end-display') as HTMLElement;

    const updateTimeRange = () => {
      const startYear = parseInt(startYearSlider.value);
      const endYear = parseInt(endYearSlider.value);
      
      // 确保开始年份不大于结束年份
      if (startYear > endYear) {
        startYearSlider.value = endYear.toString();
      }
      if (endYear < startYear) {
        endYearSlider.value = startYear.toString();
      }

      startDisplay.textContent = startYearSlider.value;
      endDisplay.textContent = endYearSlider.value;

      if (this.onTimeRangeChange) {
        this.onTimeRangeChange(
          parseInt(startYearSlider.value),
          parseInt(endYearSlider.value)
        );
      }
    };

    startYearSlider.addEventListener('input', updateTimeRange);
    endYearSlider.addEventListener('input', updateTimeRange);

    // 类别过滤
    const categoryCheckboxes = this.panel.querySelectorAll('.category-filters input[type="checkbox"]');
    const updateCategoryFilter = () => {
      const selectedCategories: string[] = [];
      categoryCheckboxes.forEach(checkbox => {
        const input = checkbox as HTMLInputElement;
        if (input.checked) {
          selectedCategories.push(input.value);
        }
      });

      if (this.onCategoryFilter) {
        this.onCategoryFilter(selectedCategories);
      }
    };

    categoryCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateCategoryFilter);
    });

    // 视图控制按钮
    const resetViewBtn = this.panel.querySelector('#reset-view') as HTMLButtonElement;
    const focusTimelineBtn = this.panel.querySelector('#focus-timeline') as HTMLButtonElement;
    const showConnectionsBtn = this.panel.querySelector('#show-connections') as HTMLButtonElement;

    resetViewBtn.addEventListener('click', () => {
      if (this.onReset) {
        this.onReset();
      }
    });

    focusTimelineBtn.addEventListener('click', () => {
      // 这里可以添加聚焦时间轴的逻辑
      console.log('Focus timeline');
    });

    showConnectionsBtn.addEventListener('click', () => {
      // 这里可以添加显示所有连接的逻辑
      console.log('Show all connections');
    });
  }

  public setTimeRangeCallback(callback: (startYear: number, endYear: number) => void): void {
    this.onTimeRangeChange = callback;
  }

  public setCategoryFilterCallback(callback: (categories: string[]) => void): void {
    this.onCategoryFilter = callback;
  }

  public setResetCallback(callback: () => void): void {
    this.onReset = callback;
  }
}
