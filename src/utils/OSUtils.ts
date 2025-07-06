import type { OSData, ConnectionData } from '../types/index.js';

export class OSUtils {
  /**
   * 根据年份计算位置
   */
  static calculateTimelinePosition(year: number, minYear: number, maxYear: number, scale: number = 1): number {
    const progress = (year - minYear) / (maxYear - minYear);
    return (progress - 0.5) * scale;
  }

  /**
   * 获取操作系统的主要类别颜色
   */
  static getCategoryColor(category: string): string {
    const colors = {
      'mainframe': '#8B4513',     // 棕色 - 大型机时代
      'personal': '#4169E1',      // 蓝色 - 个人电脑
      'server': '#2E8B57',        // 绿色 - 服务器
      'mobile': '#FF6347',        // 橙红色 - 移动设备
      'embedded': '#9370DB'       // 紫色 - 嵌入式
    };
    return colors[category as keyof typeof colors] || '#666666';
  }

  /**
   * 根据影响类型获取连接线颜色
   */
  static getConnectionColor(type: string): number {
    const colors = {
      'influence': 0x00ff00,      // 绿色 - 影响
      'evolution': 0xff8800,      // 橙色 - 演化
      'inspiration': 0x0088ff     // 蓝色 - 灵感
    };
    return colors[type as keyof typeof colors] || 0xffffff;
  }

  /**
   * 构建操作系统的影响关系图
   */
  static buildInfluenceGraph(osData: OSData[], connections: ConnectionData[]): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    
    // 初始化图
    osData.forEach(os => {
      graph.set(os.id, []);
    });

    // 添加连接关系
    connections.forEach(conn => {
      const influences = graph.get(conn.from) || [];
      influences.push(conn.to);
      graph.set(conn.from, influences);
    });

    return graph;
  }

  /**
   * 查找操作系统的所有后代
   */
  static findDescendants(osId: string, connections: ConnectionData[]): string[] {
    const descendants: string[] = [];
    const visited = new Set<string>();
    
    function traverse(currentId: string) {
      if (visited.has(currentId)) return;
      visited.add(currentId);
      
      connections.forEach(conn => {
        if (conn.from === currentId) {
          descendants.push(conn.to);
          traverse(conn.to);
        }
      });
    }
    
    traverse(osId);
    return descendants;
  }

  /**
   * 查找操作系统的所有祖先
   */
  static findAncestors(osId: string, connections: ConnectionData[]): string[] {
    const ancestors: string[] = [];
    const visited = new Set<string>();
    
    function traverse(currentId: string) {
      if (visited.has(currentId)) return;
      visited.add(currentId);
      
      connections.forEach(conn => {
        if (conn.to === currentId) {
          ancestors.push(conn.from);
          traverse(conn.from);
        }
      });
    }
    
    traverse(osId);
    return ancestors;
  }

  /**
   * 计算两个操作系统之间的影响路径
   */
  static findInfluencePath(fromId: string, toId: string, connections: ConnectionData[]): string[] {
    const graph = new Map<string, string[]>();
    
    // 构建邻接表
    connections.forEach(conn => {
      if (!graph.has(conn.from)) {
        graph.set(conn.from, []);
      }
      graph.get(conn.from)!.push(conn.to);
    });

    // BFS查找路径
    const queue: string[][] = [[fromId]];
    const visited = new Set<string>([fromId]);

    while (queue.length > 0) {
      const path = queue.shift()!;
      const current = path[path.length - 1];

      if (current === toId) {
        return path;
      }

      const neighbors = graph.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    return []; // 没有找到路径
  }

  /**
   * 按年份对操作系统进行分组
   */
  static groupByDecade(osData: OSData[]): Map<number, OSData[]> {
    const groups = new Map<number, OSData[]>();
    
    osData.forEach(os => {
      const decade = Math.floor(os.year / 10) * 10;
      if (!groups.has(decade)) {
        groups.set(decade, []);
      }
      groups.get(decade)!.push(os);
    });

    return groups;
  }

  /**
   * 计算操作系统的影响力评分
   */
  static calculateInfluenceScore(osId: string, connections: ConnectionData[]): number {
    const directInfluences = connections.filter(conn => conn.from === osId).length;
    const descendants = OSUtils.findDescendants(osId, connections).length;
    const strengthSum = connections
      .filter(conn => conn.from === osId)
      .reduce((sum, conn) => sum + conn.strength, 0);
    
    return directInfluences * 2 + descendants + strengthSum * 5;
  }

  /**
   * 生成操作系统的统计信息
   */
  static generateStats(osData: OSData[], connections: ConnectionData[]) {
    const stats = {
      totalOS: osData.length,
      totalConnections: connections.length,
      categoryCount: {} as Record<string, number>,
      decadeCount: {} as Record<string, number>,
      mostInfluential: '',
      avgYear: 0,
      timeSpan: 0
    };

    // 统计类别分布
    osData.forEach(os => {
      stats.categoryCount[os.category] = (stats.categoryCount[os.category] || 0) + 1;
    });

    // 统计年代分布
    osData.forEach(os => {
      const decade = Math.floor(os.year / 10) * 10;
      const decadeStr = `${decade}s`;
      stats.decadeCount[decadeStr] = (stats.decadeCount[decadeStr] || 0) + 1;
    });

    // 计算平均年份和时间跨度
    const years = osData.map(os => os.year);
    stats.avgYear = Math.round(years.reduce((sum, year) => sum + year, 0) / years.length);
    stats.timeSpan = Math.max(...years) - Math.min(...years);

    // 找出最有影响力的操作系统
    let maxScore = 0;
    osData.forEach(os => {
      const score = OSUtils.calculateInfluenceScore(os.id, connections);
      if (score > maxScore) {
        maxScore = score;
        stats.mostInfluential = os.name;
      }
    });

    return stats;
  }

  /**
   * 格式化年份显示
   */
  static formatYear(year: number): string {
    return year.toString();
  }

  /**
   * 格式化类别显示
   */
  static formatCategory(category: string): string {
    const categoryNames = {
      'mainframe': '大型机',
      'personal': '个人电脑',
      'server': '服务器',
      'mobile': '移动设备',
      'embedded': '嵌入式'
    };
    return categoryNames[category as keyof typeof categoryNames] || category;
  }

  /**
   * 验证操作系统数据完整性
   */
  static validateOSData(osData: OSData[]): string[] {
    const errors: string[] = [];
    
    osData.forEach((os, index) => {
      if (!os.id) errors.push(`OS at index ${index} missing id`);
      if (!os.name) errors.push(`OS ${os.id} missing name`);
      if (!os.year || os.year < 1940 || os.year > 2030) {
        errors.push(`OS ${os.id} has invalid year: ${os.year}`);
      }
      if (!os.category) errors.push(`OS ${os.id} missing category`);
      if (!os.color) errors.push(`OS ${os.id} missing color`);
    });

    return errors;
  }

  /**
   * 验证连接数据完整性
   */
  static validateConnections(connections: ConnectionData[], osData: OSData[]): string[] {
    const errors: string[] = [];
    const validIds = new Set(osData.map(os => os.id));
    
    connections.forEach((conn, index) => {
      if (!validIds.has(conn.from)) {
        errors.push(`Connection at index ${index} has invalid 'from' id: ${conn.from}`);
      }
      if (!validIds.has(conn.to)) {
        errors.push(`Connection at index ${index} has invalid 'to' id: ${conn.to}`);
      }
      if (conn.strength < 0 || conn.strength > 1) {
        errors.push(`Connection at index ${index} has invalid strength: ${conn.strength}`);
      }
    });

    return errors;
  }
}
