import * as THREE from 'three';

export class VisualEffects {
  /**
   * 创建粒子系统背景
   */
  static createStarField(scene: THREE.Scene, count: number = 1000): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // 随机位置
      positions[i3] = (Math.random() - 0.5) * 200;
      positions[i3 + 1] = (Math.random() - 0.5) * 200;
      positions[i3 + 2] = (Math.random() - 0.5) * 200;

      // 随机颜色（蓝白色调）
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 0.3 + Math.random() * 0.4, 0.5 + Math.random() * 0.5);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const starField = new THREE.Points(geometry, material);
    scene.add(starField);
    
    return starField;
  }

  /**
   * 创建发光连接线效果
   */
  static createGlowLine(
    start: THREE.Vector3, 
    end: THREE.Vector3, 
    color: number, 
    intensity: number = 1
  ): THREE.Group {
    const group = new THREE.Group();

    // 主线条
    const points = [start.clone(), end.clone()];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    const material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8 * intensity
    });
    
    const line = new THREE.Line(geometry, material);
    group.add(line);

    // 发光效果
    const glowMaterial = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3 * intensity,
      linewidth: 3
    });
    
    const glowLine = new THREE.Line(geometry, glowMaterial);
    group.add(glowLine);

    return group;
  }

  /**
   * 创建脉冲动画效果
   */
  static createPulseEffect(object: THREE.Object3D): () => void {
    let time = 0;
    const originalScale = object.scale.clone();
    
    return () => {
      time += 0.05;
      const scale = 1 + Math.sin(time) * 0.1;
      object.scale.copy(originalScale).multiplyScalar(scale);
    };
  }

  /**
   * 创建轨道路径
   */
  static createOrbitPath(center: THREE.Vector3, radius: number, color: number = 0x444444): THREE.Line {
    const points = [];
    const segments = 64;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        center.x + Math.cos(angle) * radius,
        center.y,
        center.z + Math.sin(angle) * radius
      ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3
    });

    return new THREE.Line(geometry, material);
  }

  /**
   * 创建时间轴网格
   */
  static createTimeGrid(scene: THREE.Scene, minYear: number, maxYear: number): THREE.Group {
    const group = new THREE.Group();
    const yearRange = maxYear - minYear;
    const gridSize = yearRange * 2;
    
    // 主网格
    const gridHelper = new THREE.GridHelper(gridSize, 20, 0x333333, 0x222222);
    gridHelper.rotation.x = Math.PI / 2;
    group.add(gridHelper);

    // 年份标记
    for (let year = minYear; year <= maxYear; year += 10) {
      const progress = (year - minYear) / yearRange;
      const x = (progress - 0.5) * gridSize;
      
      // 创建年份文字
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 128;
      canvas.height = 32;
      context.fillStyle = '#666666';
      context.font = '16px Arial';
      context.textAlign = 'center';
      context.fillText(year.toString(), 64, 20);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.position.set(x, -gridSize / 2 - 2, 0);
      sprite.scale.set(2, 0.5, 1);
      
      group.add(sprite);
    }

    scene.add(group);
    return group;
  }

  /**
   * 创建数据流动画效果
   */
  static createDataFlow(start: THREE.Vector3, end: THREE.Vector3, color: number): THREE.Group {
    const group = new THREE.Group();
    const particleCount = 10;
    
    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.1, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.7
      });
      
      const particle = new THREE.Mesh(geometry, material);
      particle.userData.progress = Math.random();
      particle.userData.start = start.clone();
      particle.userData.end = end.clone();
      
      group.add(particle);
    }

    return group;
  }

  /**
   * 更新数据流动画
   */
  static updateDataFlow(group: THREE.Group, speed: number = 0.01): void {
    group.children.forEach(particle => {
      const mesh = particle as THREE.Mesh;
      mesh.userData.progress += speed;
      
      if (mesh.userData.progress > 1) {
        mesh.userData.progress = 0;
      }
      
      const start = mesh.userData.start as THREE.Vector3;
      const end = mesh.userData.end as THREE.Vector3;
      mesh.position.lerpVectors(start, end, mesh.userData.progress);
    });
  }

  /**
   * 创建环形进度指示器
   */
  static createProgressRing(radius: number, progress: number, color: number): THREE.Group {
    const group = new THREE.Group();
    
    // 背景环
    const bgGeometry = new THREE.RingGeometry(radius - 0.1, radius + 0.1, 32);
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.3
    });
    const bgRing = new THREE.Mesh(bgGeometry, bgMaterial);
    group.add(bgRing);

    // 进度环
    const progressGeometry = new THREE.RingGeometry(
      radius - 0.1, 
      radius + 0.1, 
      Math.max(1, Math.floor(32 * progress)),
      1,
      0,
      Math.PI * 2 * progress
    );
    const progressMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8
    });
    const progressRing = new THREE.Mesh(progressGeometry, progressMaterial);
    group.add(progressRing);

    return group;
  }
}
