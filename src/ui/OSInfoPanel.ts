import type { OSData } from '../types/index.js';

export class OSInfoPanel {
  private container: HTMLElement;
  private panel!: HTMLElement;
  private isVisible: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.createPanel();
  }

  private createPanel(): void {
    this.panel = document.createElement('div');
    this.panel.className = 'os-info-panel';
    this.panel.innerHTML = `
      <div class="panel-header">
        <h2 class="os-name"></h2>
        <button class="close-btn">&times;</button>
      </div>
      <div class="panel-content">
        <div class="os-year"></div>
        <div class="os-description"></div>
        <div class="os-company"></div>
        <div class="key-persons">
          <h3>关键人物</h3>
          <ul class="persons-list"></ul>
        </div>
        <div class="tech-features">
          <h3>技术特性</h3>
          <ul class="features-list"></ul>
        </div>
        <div class="significance">
          <h3>历史意义</h3>
          <p class="significance-text"></p>
        </div>
      </div>
    `;

    this.container.appendChild(this.panel);
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const closeBtn = this.panel.querySelector('.close-btn') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => this.hide());

    // 点击面板外部关闭
    this.panel.addEventListener('click', (e) => {
      if (e.target === this.panel) {
        this.hide();
      }
    });
  }

  public show(osData: OSData): void {
    this.updateContent(osData);
    this.panel.style.display = 'flex';
    this.isVisible = true;
    
    // 添加显示动画
    setTimeout(() => {
      this.panel.classList.add('visible');
    }, 10);
  }

  public hide(): void {
    this.panel.classList.remove('visible');
    this.isVisible = false;
    
    setTimeout(() => {
      this.panel.style.display = 'none';
    }, 300);
  }

  private updateContent(osData: OSData): void {
    const nameEl = this.panel.querySelector('.os-name') as HTMLElement;
    const yearEl = this.panel.querySelector('.os-year') as HTMLElement;
    const descEl = this.panel.querySelector('.os-description') as HTMLElement;
    const companyEl = this.panel.querySelector('.os-company') as HTMLElement;
    const personsList = this.panel.querySelector('.persons-list') as HTMLElement;
    const featuresList = this.panel.querySelector('.features-list') as HTMLElement;
    const significanceText = this.panel.querySelector('.significance-text') as HTMLElement;

    nameEl.textContent = osData.name;
    yearEl.textContent = `发布年份: ${osData.year}`;
    descEl.textContent = osData.description;
    companyEl.textContent = `开发公司: ${osData.company}`;
    significanceText.textContent = osData.significance;

    // 更新关键人物列表
    personsList.innerHTML = '';
    osData.keyPersons.forEach(person => {
      const li = document.createElement('li');
      li.textContent = person;
      personsList.appendChild(li);
    });

    // 更新技术特性列表
    featuresList.innerHTML = '';
    osData.techFeatures.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresList.appendChild(li);
    });

    // 设置主题色
    this.panel.style.setProperty('--theme-color', osData.color);
  }

  public isOpen(): boolean {
    return this.isVisible;
  }
}
