"use client";

// ModelScriptService.ts
// Сервис для взаимодействия с математическими моделями через скрипты

/**
 * Тип скрипта модели
 */
export interface ModelScript {
  id: string;
  path: string;
  name: string;
}

/**
 * Структура точки для графиков
 */
export interface Point {
  x: number;
  y: number;
  z?: number;
}

/**
 * Структура серии данных для графиков
 */
export interface DataSeries {
  id: string;
  name: string;
  color: string;
  points: Point[];
  maxPoints: number;
}

/**
 * Интерфейс для обработчика логов расчёта модели
 */
export interface LogHandler {
  (message: string): void;
}

/**
 * Интерфейс для обработчика обновления данных
 */
export interface DataUpdateHandler {
  (seriesId: string, point: Point): void;
}

/**
 * Класс для работы со скриптами математических моделей
 */
export class ModelScriptService {
  private static instance: ModelScriptService;
  private baseScriptPath: string = '../../../..'; // Путь к корневой директории со скриптами
  private activeModel: any = null;
  private logHandlers: LogHandler[] = [];
  private dataUpdateHandlers: DataUpdateHandler[] = [];
  private canvasContext: CanvasRenderingContext2D | null = null;
  private dataSeries: Map<string, DataSeries> = new Map();
  private animationFrameId: number | null = null;
  private lastRenderTime: number = 0;
  
  // Настройки отрисовки
  private readonly settings = {
    backgroundColor: '#f5f5f5',
    gridColor: '#e0e0e0',
    axisColor: '#999',
    textColor: '#333',
    animationInterval: 50, // ms между обновлениями
    maxPointsPerSeries: 1000,
    padding: 30,
    axisWidth: 1,
    gridWidth: 0.5,
    pointRadius: 2
  };
  
  /**
   * Получить экземпляр сервиса (singleton)
   */
  public static getInstance(): ModelScriptService {
    if (!ModelScriptService.instance) {
      ModelScriptService.instance = new ModelScriptService();
    }
    return ModelScriptService.instance;
  }
  
  /**
   * Приватный конструктор для singleton
   */
  private constructor() {}
  
  /**
   * Инициализировать canvas для отрисовки
   * @param canvas HTML-элемент canvas
   */
  public initCanvas(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      this.log('Ошибка: Не удалось получить контекст canvas');
      return;
    }
    
    this.canvasContext = ctx;
    this.clearCanvas();
    this.drawEmptyState();
  }
  
  /**
   * Очистить все данные
   */
  public clearData(): void {
    this.dataSeries.clear();
    if (this.canvasContext && this.canvasContext.canvas) {
      this.clearCanvas();
      this.drawEmptyState();
    }
  }
  
  /**
   * Создать новую серию данных
   * @param id Идентификатор серии
   * @param name Название серии
   * @param color Цвет серии (CSS-строка)
   */
  public createSeries(id: string, name: string, color: string = this.getRandomColor()): void {
    if (this.dataSeries.has(id)) {
      this.log(`Серия с ID ${id} уже существует`);
      return;
    }
    
    this.dataSeries.set(id, {
      id,
      name,
      color,
      points: [],
      maxPoints: this.settings.maxPointsPerSeries
    });
    
    this.log(`Создана новая серия данных: ${name}`);
  }
  
  /**
   * Добавить точку в серию данных
   * @param seriesId ID серии
   * @param point Точка (x, y, z?)
   */
  public addPoint(seriesId: string, point: Point): void {
    const series = this.dataSeries.get(seriesId);
    if (!series) {
      this.log(`Ошибка: Серия с ID ${seriesId} не найдена`);
      return;
    }
    
    // Добавляем точку в серию
    series.points.push(point);
    
    // Если превышено максимальное количество точек, удаляем самую старую
    if (series.points.length > series.maxPoints) {
      series.points.shift();
    }
    
    // Уведомляем подписчиков об обновлении данных
    this.dataUpdateHandlers.forEach(handler => handler(seriesId, point));
    
    // Запускаем отрисовку, если она еще не запущена
    this.startRendering();
  }
  
  /**
   * Получить все серии данных
   */
  public getAllSeries(): DataSeries[] {
    return Array.from(this.dataSeries.values());
  }
  
  /**
   * Загрузка скрипта модели
   * @param scriptName Имя файла скрипта
   * @returns Promise с загруженным скриптом
   */
  public async loadModelScript(scriptName: string): Promise<any> {
    this.log(`Загрузка скрипта модели: ${scriptName}`);
    
    try {
      // В реальном приложении здесь будет код загрузки и выполнения скрипта
      // Для демонстрационных целей возвращаем заглушку
      const scriptMock = {
        name: scriptName,
        initialize: () => {
          this.log(`Инициализация модели: ${scriptName}`);
          // Очищаем данные при инициализации новой модели
          this.clearData();
          
          // Создаем серии данных в зависимости от типа модели
          if (scriptName.includes('lorenz')) {
            this.createSeries('x-y', 'X-Y проекция', '#1f77b4');
            this.createSeries('x-z', 'X-Z проекция', '#ff7f0e');
          } else if (scriptName.includes('plane')) {
            this.createSeries('x-z', 'Траектория X-Z', '#2ca02c');
            this.createSeries('y-z', 'Траектория Y-Z', '#d62728');
          } else if (scriptName.includes('sun')) {
            this.createSeries('earth', 'Земля', '#1f77b4');
            this.createSeries('moon', 'Луна', '#aec7e8');
          } else {
            this.createSeries('main', 'Основная траектория', '#1f77b4');
          }
          
          return Promise.resolve(true);
        },
        start: () => {
          this.log(`Запуск модели: ${scriptName}`);
          this.simulateCalculations(scriptName);
          return Promise.resolve(true);
        },
        stop: () => {
          this.log(`Остановка модели: ${scriptName}`);
          return Promise.resolve(true);
        }
      };
      
      return Promise.resolve(scriptMock);
    } catch (error) {
      this.log(`Ошибка загрузки скрипта: ${error}`);
      return Promise.reject(error);
    }
  }
  
  /**
   * Запустить модель
   * @param scriptName Имя файла скрипта модели
   * @param canvas HTML-элемент canvas для визуализации
   * @returns Promise с результатом запуска
   */
  public async runModel(scriptName: string, canvas: HTMLCanvasElement): Promise<boolean> {
    try {
      // Остановка предыдущей модели, если она активна
      if (this.activeModel) {
        await this.activeModel.stop();
        this.activeModel = null;
      }
      
      // Инициализация canvas
      this.initCanvas(canvas);
      
      // Загрузка и запуск новой модели
      const model = await this.loadModelScript(scriptName);
      await model.initialize();
      await model.start();
      
      this.activeModel = model;
      return true;
    } catch (error) {
      this.log(`Ошибка запуска модели: ${error}`);
      return false;
    }
  }
  
  /**
   * Остановить текущую активную модель
   */
  public async stopActiveModel(): Promise<void> {
    if (this.activeModel) {
      try {
        await this.activeModel.stop();
        this.activeModel = null;
        
        // Останавливаем рендеринг
        this.stopRendering();
      } catch (error) {
        this.log(`Ошибка остановки модели: ${error}`);
      }
    }
  }
  
  /**
   * Добавить обработчик логов
   * @param handler Функция-обработчик логов
   */
  public addLogHandler(handler: LogHandler): void {
    this.logHandlers.push(handler);
  }
  
  /**
   * Удалить обработчик логов
   * @param handler Функция-обработчик для удаления
   */
  public removeLogHandler(handler: LogHandler): void {
    this.logHandlers = this.logHandlers.filter(h => h !== handler);
  }
  
  /**
   * Добавить обработчик обновления данных
   * @param handler Функция-обработчик обновления данных
   */
  public addDataUpdateHandler(handler: DataUpdateHandler): void {
    this.dataUpdateHandlers.push(handler);
  }
  
  /**
   * Удалить обработчик обновления данных
   * @param handler Функция-обработчик для удаления
   */
  public removeDataUpdateHandler(handler: DataUpdateHandler): void {
    this.dataUpdateHandlers = this.dataUpdateHandlers.filter(h => h !== handler);
  }
  
  /**
   * Записать сообщение в лог
   * @param message Сообщение для лога
   */
  private log(message: string): void {
    console.log(`[ModelScriptService] ${message}`);
    this.logHandlers.forEach(handler => handler(message));
  }
  
  /**
   * Имитация расчетов модели (для демонстрации)
   * @param scriptName Имя скрипта модели
   */
  private simulateCalculations(scriptName: string): void {
    let t = 0;
    const interval = setInterval(() => {
      if (!this.activeModel || this.activeModel.name !== scriptName) {
        clearInterval(interval);
        return;
      }
      
      t += 0.1;
      
      // Различные формулы для разных моделей
      if (scriptName.includes('lorenz')) {
        const sigma = 10.0;
        const b = 8.0/3;
        const r = 28.0;
        // Используем параметрические уравнения для имитации странного аттрактора Лоренца
        const x = Math.sin(t) * 10 + Math.cos(t*2) * 5;
        const y = Math.cos(t) * 10 + Math.sin(t*3) * 5;
        const z = Math.sin(t + 1) * 20 + Math.cos(t*1.5) * 8;
        
        this.log(`t=${t.toFixed(2)}: x=${x.toFixed(3)}, y=${y.toFixed(3)}, z=${z.toFixed(3)}`);
        
        // Добавляем точки в серии данных
        this.addPoint('x-y', {x, y});
        this.addPoint('x-z', {x, z});
      } else if (scriptName.includes('plane')) {
        const x = t * 100 - 5000 + Math.sin(t) * 50;
        const y = Math.sin(t/2) * 200;
        const z = Math.cos(t/3) * 500 - 1000 + Math.sin(t*2) * 100;
        
        this.log(`t=${t.toFixed(2)}: x=${x.toFixed(1)}, y=${y.toFixed(1)}, z=${z.toFixed(1)}, Vx=100.0`);
        
        // Добавляем точки в серии данных
        this.addPoint('x-z', {x, y: z}); // В 2D проекции z будет как y
        this.addPoint('y-z', {x: y, y: z});
      } else if (scriptName.includes('sun')) {
        const earthX = Math.cos(t/5) * 200;
        const earthY = Math.sin(t/5) * 200;
        const moonX = earthX + Math.cos(t*2) * 30;
        const moonY = earthY + Math.sin(t*2) * 30;
        
        this.log(`t=${t.toFixed(2)}: Earth(${earthX.toFixed(1)},${earthY.toFixed(1)}), Moon(${moonX.toFixed(1)},${moonY.toFixed(1)})`);
        
        // Добавляем точки в серии данных
        this.addPoint('earth', {x: earthX, y: earthY});
        this.addPoint('moon', {x: moonX, y: moonY});
      } else {
        const x = t * 10;
        const y = Math.sin(t) * 50 + Math.cos(t*3) * 20;
        
        this.log(`t=${t.toFixed(2)}: Расчёт: value=${x.toFixed(3)}, delta=${y.toFixed(3)}`);
        
        // Добавляем точку в серию данных
        this.addPoint('main', {x, y});
      }
      
      // Остановка после определенного времени или количества точек
      if (t > 100) {
        clearInterval(interval);
        this.log(`Модель завершила расчёты: ${scriptName}`);
      }
    }, 100); // Имитация расчетов каждые 100мс для более плавной анимации
  }
  
  /**
   * Запустить цикл отрисовки
   */
  private startRendering(): void {
    if (this.animationFrameId !== null) return; // Рендеринг уже запущен
    
    const render = (timestamp: number) => {
      // Ограничиваем частоту обновления для производительности
      if (timestamp - this.lastRenderTime > this.settings.animationInterval) {
        this.renderData();
        this.lastRenderTime = timestamp;
      }
      
      this.animationFrameId = requestAnimationFrame(render);
    };
    
    this.animationFrameId = requestAnimationFrame(render);
  }
  
  /**
   * Остановить цикл отрисовки
   */
  private stopRendering(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  /**
   * Очистить canvas
   */
  private clearCanvas(): void {
    if (!this.canvasContext) return;
    
    const canvas = this.canvasContext.canvas;
    this.canvasContext.fillStyle = this.settings.backgroundColor;
    this.canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  /**
   * Отрисовать пустое состояние (когда нет данных)
   */
  private drawEmptyState(): void {
    if (!this.canvasContext) return;
    
    const canvas = this.canvasContext.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    this.canvasContext.fillStyle = this.settings.textColor;
    this.canvasContext.font = '16px Arial';
    this.canvasContext.textAlign = 'center';
    this.canvasContext.textBaseline = 'middle';
    this.canvasContext.fillText('Выберите и запустите модель для визуализации', centerX, centerY);
  }
  
  /**
   * Отрисовать все данные на canvas
   */
  private renderData(): void {
    if (!this.canvasContext) return;
    
    const canvas = this.canvasContext.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const padding = this.settings.padding;
    
    // Очищаем canvas
    this.clearCanvas();
    
    // Если нет данных, рисуем пустое состояние и выходим
    if (this.dataSeries.size === 0 || Array.from(this.dataSeries.values()).every(s => s.points.length === 0)) {
      this.drawEmptyState();
      return;
    }
    
    // Находим минимальные и максимальные значения для масштабирования
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    this.dataSeries.forEach(series => {
      series.points.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      });
    });
    
    // Добавляем небольшой "запас" по краям
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    minX -= rangeX * 0.05;
    maxX += rangeX * 0.05;
    minY -= rangeY * 0.05;
    maxY += rangeY * 0.05;
    
    // Функции преобразования координат
    const scaleX = (x: number) => padding + (x - minX) / (maxX - minX) * (width - 2 * padding);
    const scaleY = (y: number) => height - padding - (y - minY) / (maxY - minY) * (height - 2 * padding);
    
    // Рисуем сетку и оси
    this.drawGrid(width, height, padding, scaleX, scaleY, minX, maxX, minY, maxY);
    
    // Рисуем все серии данных
    this.dataSeries.forEach(series => {
      if (series.points.length === 0) return;
      
      this.canvasContext!.strokeStyle = series.color;
      this.canvasContext!.lineWidth = 2;
      this.canvasContext!.beginPath();
      
      // Рисуем линии между точками
      let first = true;
      series.points.forEach(point => {
        const x = scaleX(point.x);
        const y = scaleY(point.y);
        
        if (first) {
          this.canvasContext!.moveTo(x, y);
          first = false;
        } else {
          this.canvasContext!.lineTo(x, y);
        }
      });
      
      this.canvasContext!.stroke();
      
      // Рисуем последнюю точку более заметно
      const lastPoint = series.points[series.points.length - 1];
      const lastX = scaleX(lastPoint.x);
      const lastY = scaleY(lastPoint.y);
      
      this.canvasContext!.fillStyle = series.color;
      this.canvasContext!.beginPath();
      this.canvasContext!.arc(lastX, lastY, this.settings.pointRadius * 2, 0, Math.PI * 2);
      this.canvasContext!.fill();
    });
    
    // Рисуем легенду
    this.drawLegend();
  }
  
  /**
   * Нарисовать сетку и оси
   */
  private drawGrid(width: number, height: number, padding: number,
                  scaleX: (x: number) => number, scaleY: (y: number) => number,
                  minX: number, maxX: number, minY: number, maxY: number): void {
    if (!this.canvasContext) return;
    
    const ctx = this.canvasContext;
    
    // Рисуем сетку
    ctx.strokeStyle = this.settings.gridColor;
    ctx.lineWidth = this.settings.gridWidth;
    
    // Вертикальные линии сетки
    const gridStepX = this.calculateGridStep(minX, maxX);
    for (let x = Math.ceil(minX / gridStepX) * gridStepX; x <= maxX; x += gridStepX) {
      const screenX = scaleX(x);
      ctx.beginPath();
      ctx.moveTo(screenX, padding);
      ctx.lineTo(screenX, height - padding);
      ctx.stroke();
      
      // Подписи по X
      ctx.fillStyle = this.settings.textColor;
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(x.toFixed(1), screenX, height - padding + 15);
    }
    
    // Горизонтальные линии сетки
    const gridStepY = this.calculateGridStep(minY, maxY);
    for (let y = Math.ceil(minY / gridStepY) * gridStepY; y <= maxY; y += gridStepY) {
      const screenY = scaleY(y);
      ctx.beginPath();
      ctx.moveTo(padding, screenY);
      ctx.lineTo(width - padding, screenY);
      ctx.stroke();
      
      // Подписи по Y
      ctx.fillStyle = this.settings.textColor;
      ctx.font = '10px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(y.toFixed(1), padding - 5, screenY + 3);
    }
    
    // Рисуем оси
    ctx.strokeStyle = this.settings.axisColor;
    ctx.lineWidth = this.settings.axisWidth;
    
    // Ось X
    const yZero = scaleY(0);
    if (yZero >= padding && yZero <= height - padding) {
      ctx.beginPath();
      ctx.moveTo(padding, yZero);
      ctx.lineTo(width - padding, yZero);
      ctx.stroke();
    }
    
    // Ось Y
    const xZero = scaleX(0);
    if (xZero >= padding && xZero <= width - padding) {
      ctx.beginPath();
      ctx.moveTo(xZero, padding);
      ctx.lineTo(xZero, height - padding);
      ctx.stroke();
    }
  }
  
  /**
   * Рассчитать оптимальный шаг сетки
   */
  private calculateGridStep(min: number, max: number): number {
    const range = max - min;
    let step = Math.pow(10, Math.floor(Math.log10(range)));
    
    if (range / step < 2) {
      step /= 5;
    } else if (range / step < 5) {
      step /= 2;
    }
    
    return step;
  }
  
  /**
   * Нарисовать легенду
   */
  private drawLegend(): void {
    if (!this.canvasContext || this.dataSeries.size === 0) return;
    
    const ctx = this.canvasContext;
    const canvas = ctx.canvas;
    const padding = 10;
    const lineHeight = 20;
    const seriesArray = Array.from(this.dataSeries.values());
    
    // Фон легенды
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const legendWidth = 150;
    const legendHeight = (seriesArray.length * lineHeight) + padding * 2;
    ctx.fillRect(
      canvas.width - legendWidth - padding,
      padding,
      legendWidth,
      legendHeight
    );
    
    // Рамка легенды
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      canvas.width - legendWidth - padding,
      padding,
      legendWidth,
      legendHeight
    );
    
    // Заголовок "Легенда"
    ctx.fillStyle = this.settings.textColor;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(
      'Легенда',
      canvas.width - legendWidth - padding + 10,
      padding + 15
    );
    
    // Элементы легенды
    seriesArray.forEach((series, index) => {
      const y = padding + 15 + lineHeight * (index + 1);
      const x = canvas.width - legendWidth - padding + 10;
      
      // Цветной маркер
      ctx.fillStyle = series.color;
      ctx.fillRect(x, y - 8, 15, 2);
      
      // Название серии
      ctx.fillStyle = this.settings.textColor;
      ctx.font = '12px Arial';
      ctx.fillText(series.name, x + 20, y);
    });
  }
  
  /**
   * Получить случайный цвет
   */
  private getRandomColor(): string {
    const colors = [
      '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
      '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
} 