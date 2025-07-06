import * as THREE from 'three';
import type { OSData, ConnectionData } from '../types/index.js';
import { VisualEffects } from '../effects/VisualEffects.js';
import { OSUtils } from '../utils/OSUtils.js';

export class OSTimeShuttle {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private osNodes: Map<string, THREE.Group> = new Map();
  private connections: THREE.Group;
  private timeline: THREE.Group;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private selectedOS: string | null = null;
  private onOSSelect?: (osData: OSData) => void;
  private starField?: THREE.Points;
  private timeGrid?: THREE.Group;
  private animationCallbacks: (() => void)[] = [];

  constructor(container: HTMLElement) {
    // 初始化场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);

    // 初始化相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 50);

    // 初始化渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 初始化组
    this.connections = new THREE.Group();
    this.timeline = new THREE.Group();
    this.scene.add(this.connections);
    this.scene.add(this.timeline);

    // 初始化交互
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.setupLighting();
    this.setupEventListeners();
    this.setupControls();
    this.createEnvironment();
  }

  private setupLighting(): void {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);

    // 主光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    this.scene.add(directionalLight);

    // 点光源（用于增强效果）
    const pointLight = new THREE.PointLight(0x4080ff, 0.5, 100);
    pointLight.position.set(0, 0, 30);
    this.scene.add(pointLight);

    // 添加一些动态光源
    const movingLight = new THREE.PointLight(0xff4080, 0.3, 50);
    movingLight.position.set(20, 20, 20);
    this.scene.add(movingLight);
    
    // 添加光源动画
    this.animationCallbacks.push(() => {
      const time = Date.now() * 0.001;
      movingLight.position.x = Math.sin(time * 0.5) * 30;
      movingLight.position.z = Math.cos(time * 0.3) * 30;
    });
  }

  private createEnvironment(): void {
    // 创建星空背景
    this.starField = VisualEffects.createStarField(this.scene, 1500);
    
    // 添加星空旋转动画
    this.animationCallbacks.push(() => {
      if (this.starField) {
        this.starField.rotation.y += 0.0002;
        this.starField.rotation.x += 0.0001;
      }
    });
  }

  private setupEventListeners(): void {
    this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private setupControls(): void {
    // 这里可以集成OrbitControls，但为了简化，我们先用基本的相机控制
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;

    this.renderer.domElement.addEventListener('mousedown', (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    this.renderer.domElement.addEventListener('mouseup', () => {
      isMouseDown = false;
    });

    this.renderer.domElement.addEventListener('mousemove', (event) => {
      if (!isMouseDown) return;

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      // 旋转相机
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(this.camera.position);
      spherical.theta -= deltaX * 0.01;
      spherical.phi += deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

      this.camera.position.setFromSpherical(spherical);
      this.camera.lookAt(0, 0, 0);

      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    // 滚轮缩放
    this.renderer.domElement.addEventListener('wheel', (event) => {
      const scale = event.deltaY > 0 ? 1.1 : 0.9;
      this.camera.position.multiplyScalar(scale);
      this.camera.position.clampLength(10, 200);
    });
  }

  public createOSNode(osData: OSData): THREE.Group {
    const group = new THREE.Group();
    
    // 创建主球体
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: osData.color,
      transparent: true,
      opacity: 0.9,
      shininess: 100
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.userData = { osId: osData.id, type: 'os-node' };
    
    // 添加发光效果
    const glowGeometry = new THREE.SphereGeometry(1.3, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: osData.color,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    
    // 创建轨道环
    const orbitGeometry = new THREE.RingGeometry(1.8, 2.0, 32);
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: osData.color,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    
    // 创建文字标签
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 64;
    
    // 设置字体和样式
    context.fillStyle = '#ffffff';
    context.font = 'bold 20px Arial';
    context.textAlign = 'center';
    context.shadowColor = 'rgba(0,0,0,0.5)';
    context.shadowBlur = 2;
    context.fillText(osData.name, 128, 28);
    
    context.font = '14px Arial';
    context.fillStyle = '#cccccc';
    context.fillText(osData.year.toString(), 128, 48);

    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true
    });
    const label = new THREE.Sprite(labelMaterial);
    label.scale.set(6, 1.5, 1);
    label.position.set(0, 3, 0);

    // 添加类别指示器
    const categoryGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const categoryMaterial = new THREE.MeshBasicMaterial({
      color: OSUtils.getCategoryColor(osData.category)
    });
    const categoryIndicator = new THREE.Mesh(categoryGeometry, categoryMaterial);
    categoryIndicator.position.set(0, -2, 0);

    group.add(sphere);
    group.add(glow);
    group.add(orbit);
    group.add(label);
    group.add(categoryIndicator);
    group.userData = { osData, baseY: 0 };

    // 添加节点特定的动画
    const pulseEffect = VisualEffects.createPulseEffect(glow);
    this.animationCallbacks.push(pulseEffect);

    return group;
  }

  public createTimeline(osDataList: OSData[]): void {
    // 清除现有时间轴和节点
    this.timeline.clear();
    this.osNodes.clear();

    // 按年份排序
    const sortedOS = [...osDataList].sort((a, b) => a.year - b.year);
    if (sortedOS.length === 0) return;

    const minYear = sortedOS[0].year;
    const maxYear = sortedOS[sortedOS.length - 1].year;
    const yearRange = maxYear - minYear;

    // 创建时间网格
    if (this.timeGrid) {
      this.scene.remove(this.timeGrid);
    }
    this.timeGrid = VisualEffects.createTimeGrid(this.scene, minYear, maxYear);

    // 创建时间轴主线
    const timelineLength = Math.max(yearRange * 1.5, 50);
    const timelineGeometry = new THREE.CylinderGeometry(0.2, 0.2, timelineLength);
    const timelineMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x444444,
      shininess: 50
    });
    const timelineAxis = new THREE.Mesh(timelineGeometry, timelineMaterial);
    timelineAxis.rotation.z = Math.PI / 2;
    timelineAxis.castShadow = true;
    this.timeline.add(timelineAxis);

    // 放置OS节点
    sortedOS.forEach((osData, index) => {
      const progress = yearRange > 0 ? (osData.year - minYear) / yearRange : 0;
      const x = (progress - 0.5) * timelineLength * 0.8;
      
      // 使用螺旋布局来避免重叠
      const angle = index * 0.8;
      const radius = 3 + (index % 3) * 2;
      const y = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
      const z = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;

      osData.position = { x, y, z };
      const node = this.createOSNode(osData);
      node.position.set(x, y, z);
      
      // 添加到时间轴的连接线
      const connectionPoints = [
        new THREE.Vector3(x, 0, 0),
        new THREE.Vector3(x, y, z)
      ];
      const connectionGeometry = new THREE.BufferGeometry().setFromPoints(connectionPoints);
      const connectionMaterial = new THREE.LineBasicMaterial({
        color: osData.color,
        transparent: true,
        opacity: 0.3
      });
      const connectionLine = new THREE.Line(connectionGeometry, connectionMaterial);
      this.timeline.add(connectionLine);
      
      this.osNodes.set(osData.id, node);
      this.scene.add(node);
    });
  }

  public createConnections(connections: ConnectionData[]): void {
    this.connections.clear();

    connections.forEach(connection => {
      const fromNode = this.osNodes.get(connection.from);
      const toNode = this.osNodes.get(connection.to);
      
      if (fromNode && toNode) {
        const fromPos = fromNode.position;
        const toPos = toNode.position;
        
        // 创建弯曲的连接线
        const midPoint = new THREE.Vector3(
          (fromPos.x + toPos.x) / 2,
          Math.max(fromPos.y, toPos.y) + 5,
          (fromPos.z + toPos.z) / 2
        );
        
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(fromPos.x, fromPos.y, fromPos.z),
          midPoint,
          new THREE.Vector3(toPos.x, toPos.y, toPos.z)
        );
        
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: this.getConnectionColor(connection.type),
          transparent: true,
          opacity: connection.strength * 0.7,
          linewidth: 2
        });
        
        const line = new THREE.Line(geometry, material);
        line.userData = { connection };
        this.connections.add(line);

        // 添加方向箭头
        const arrowGeometry = new THREE.ConeGeometry(0.3, 1, 8);
        const arrowMaterial = new THREE.MeshBasicMaterial({
          color: this.getConnectionColor(connection.type),
          transparent: true,
          opacity: connection.strength * 0.8
        });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        
        // 计算箭头位置和方向
        const direction = new THREE.Vector3().subVectors(toPos, fromPos).normalize();
        arrow.position.copy(toPos).sub(direction.multiplyScalar(2));
        arrow.lookAt(toPos);
        arrow.rotateX(Math.PI / 2);
        
        this.connections.add(arrow);
      }
    });
  }

  private getConnectionColor(type: string): number {
    switch (type) {
      case 'influence': return 0x00ff00;
      case 'evolution': return 0xff8800;
      case 'inspiration': return 0x0088ff;
      default: return 0xffffff;
    }
  }

  public highlightInfluenceNetwork(osId: string): void {
    // 重置所有节点和连接的状态
    this.resetHighlights();

    const selectedNode = this.osNodes.get(osId);
    if (!selectedNode) return;

    // 高亮选中的节点
    this.highlightNode(selectedNode, 0xff4444);
    this.selectedOS = osId;

    // 找到所有相关连接并高亮
    this.connections.children.forEach(child => {
      if (child instanceof THREE.Line) {
        const line = child as THREE.Line;
        const connection = line.userData.connection as ConnectionData;
        
        if (connection.from === osId || connection.to === osId) {
          // 高亮连接线
          const material = line.material as THREE.LineBasicMaterial;
          material.opacity = 1.0;
          material.color.setHex(0xffff00);
          
          // 高亮相关节点
          const relatedId = connection.from === osId ? connection.to : connection.from;
          const relatedNode = this.osNodes.get(relatedId);
          if (relatedNode) {
            this.highlightNode(relatedNode, 0x44ff44);
          }
        }
      }
    });
  }

  private highlightNode(node: THREE.Group, color: number): void {
    const sphere = node.children.find(child => child.userData.type === 'os-node') as THREE.Mesh;
    if (sphere) {
      const material = sphere.material as THREE.MeshPhongMaterial;
      material.emissive.setHex(color);
      material.emissiveIntensity = 0.3;
    }
  }

  private resetHighlights(): void {
    this.osNodes.forEach(node => {
      const sphere = node.children.find(child => child.userData.type === 'os-node') as THREE.Mesh;
      if (sphere) {
        const material = sphere.material as THREE.MeshPhongMaterial;
        material.emissive.setHex(0x000000);
        material.emissiveIntensity = 0;
      }
    });

    this.connections.children.forEach(child => {
      if (child instanceof THREE.Line) {
        const line = child as THREE.Line;
        const material = line.material as THREE.LineBasicMaterial;
        const connection = line.userData.connection as ConnectionData;
        if (connection) {
          material.opacity = connection.strength * 0.7;
          material.color.setHex(this.getConnectionColor(connection.type));
        }
      }
    });
  }

  private onMouseClick(event: MouseEvent): void {
    this.updateMousePosition(event);
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      Array.from(this.osNodes.values()).map(node => node.children[0]),
      false
    );

    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      const osId = intersected.userData.osId;
      
      if (osId) {
        this.selectedOS = osId;
        this.highlightInfluenceNetwork(osId);
        
        if (this.onOSSelect) {
          const osNode = this.osNodes.get(osId);
          if (osNode) {
            this.onOSSelect(osNode.userData.osData);
          }
        }
      }
    } else {
      this.selectedOS = null;
      this.resetHighlights();
    }
  }

  private onMouseMove(event: MouseEvent): void {
    this.updateMousePosition(event);
    
    // 添加鼠标悬停效果
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      Array.from(this.osNodes.values()).map(node => node.children[0]),
      false
    );

    // 重置所有节点的悬停状态
    this.osNodes.forEach(node => {
      const glow = node.children[1] as THREE.Mesh; // 发光效果
      if (glow) {
        const material = glow.material as THREE.MeshBasicMaterial;
        material.opacity = 0.2;
      }
    });

    // 设置悬停节点的高亮
    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      const osId = intersected.userData.osId;
      const node = this.osNodes.get(osId);
      if (node) {
        const glow = node.children[1] as THREE.Mesh;
        if (glow) {
          const material = glow.material as THREE.MeshBasicMaterial;
          material.opacity = 0.4;
        }
      }
      
      // 改变鼠标样式
      this.renderer.domElement.style.cursor = 'pointer';
    } else {
      this.renderer.domElement.style.cursor = 'default';
    }
  }

  private updateMousePosition(event: MouseEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private onWindowResize(): void {
    const container = this.renderer.domElement.parentElement!;
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  public setOSSelectCallback(callback: (osData: OSData) => void): void {
    this.onOSSelect = callback;
  }

  public resetCamera(): void {
    this.camera.position.set(0, 10, 50);
    this.camera.lookAt(0, 0, 0);
  }

  public focusOnOS(osId: string): void {
    const node = this.osNodes.get(osId);
    if (node) {
      const targetPosition = node.position.clone();
      targetPosition.z += 20; // 向后移动一点距离
      
      // 平滑移动相机到目标位置
      const startPosition = this.camera.position.clone();
      let progress = 0;
      
      const animateCamera = () => {
        progress += 0.02;
        if (progress <= 1) {
          this.camera.position.lerpVectors(startPosition, targetPosition, progress);
          this.camera.lookAt(node.position);
          requestAnimationFrame(animateCamera);
        }
      };
      
      animateCamera();
    }
  }

  public animate(): void {
    requestAnimationFrame(() => this.animate());
    
    // 执行所有动画回调
    this.animationCallbacks.forEach(callback => callback());
    
    // 添加一些基本动画效果
    this.osNodes.forEach(node => {
      const time = Date.now() * 0.001;
      
      // 节点自转
      node.rotation.y = time * 0.2;
      
      // 轻微的浮动效果
      const baseY = node.userData.baseY || node.position.y;
      node.userData.baseY = baseY;
      node.position.y = baseY + Math.sin(time + node.position.x) * 0.3;
      
      // 轨道环旋转
      const orbit = node.children[2] as THREE.Mesh; // 轨道环
      if (orbit) {
        orbit.rotation.z = time * 0.5;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.renderer.dispose();
    this.osNodes.clear();
    this.animationCallbacks.length = 0;
  }

  /**
   * 仅根据筛选条件隐藏/显示节点和连接，不重建节点。
   * @param visibleIds 需要显示的操作系统ID数组
   */
  public filterNodesBy(visibleIds: string[]): void {
    // 节点显示/隐藏
    this.osNodes.forEach((node, id) => {
      node.visible = visibleIds.includes(id);
    });
    // 连接显示/隐藏
    this.connections.children.forEach(line => {
      if (line.userData && line.userData.connection) {
        const { from, to } = line.userData.connection;
        line.visible = visibleIds.includes(from) && visibleIds.includes(to);
      }
    });
  }

  public getSelectedOS(): string | null {
    return this.selectedOS;
  }
}
