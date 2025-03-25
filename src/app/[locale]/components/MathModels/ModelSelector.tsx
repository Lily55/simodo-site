"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ModelScriptService, LogHandler, DataUpdateHandler, Point } from '../../services/ModelScriptService';

// Определение типов для моделей
interface Model {
  name: string;
  scriptName: string;
  description: string;
}

// Список доступных моделей
const AVAILABLE_MODELS: Model[] = [
  { 
    name: 'Lorenz System', 
    scriptName: 'lorenz-start.s-script',
    description: 'Система Лоренца - классическая модель хаотической динамики'
  },
  { 
    name: 'Plane Model', 
    scriptName: 'plane-start.s-script',
    description: 'Модель полёта БЛА'
  },
  { 
    name: 'Shuttle', 
    scriptName: 'shuttle.s-script',
    description: 'Модель движения шаттла'
  },
  { 
    name: 'Pursuit', 
    scriptName: 'pursuit-start.s-script',
    description: 'Модель преследования'
  },
  {
    name: 'Sun-Earth-Moon',
    scriptName: 'tbp-sun-earth-moon.s-script',
    description: 'Модель системы Солнце-Земля-Луна'
  },
  {
    name: 'Scene Fibers',
    scriptName: 'scene-fibers.s-script',
    description: 'Модель сцены с волокнами'
  },
  {
    name: 'Solvers',
    scriptName: 'solvers.s-script',
    description: 'Решатели дифференциальных уравнений'
  }
];

export const ModelSelector: React.FC = () => {
  const t = useTranslations('models');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [calculationLogs, setCalculationLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const modelServiceRef = useRef<ModelScriptService | null>(null);
  const [lastDataPoints, setLastDataPoints] = useState<Map<string, Point>>(new Map());

  // Функция для добавления записи в лог
  const addLogEntry: LogHandler = (entry: string) => {
    setCalculationLogs(prev => [...prev, entry]);
    
    // Прокрутка к последней записи
    if (logContainerRef.current) {
      setTimeout(() => {
        if (logContainerRef.current) {
          logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
      }, 10);
    }
  };

  // Обработчик обновления данных
  const handleDataUpdate: DataUpdateHandler = (seriesId: string, point: Point) => {
    setLastDataPoints(prev => {
      const newMap = new Map(prev);
      newMap.set(seriesId, point);
      return newMap;
    });
  };

  // Инициализация сервиса моделей при первом рендере
  useEffect(() => {
    modelServiceRef.current = ModelScriptService.getInstance();
    modelServiceRef.current.addLogHandler(addLogEntry);
    modelServiceRef.current.addDataUpdateHandler(handleDataUpdate);
    
    // Очистка при размонтировании
    return () => {
      if (modelServiceRef.current) {
        modelServiceRef.current.removeLogHandler(addLogEntry);
        modelServiceRef.current.removeDataUpdateHandler(handleDataUpdate);
        modelServiceRef.current.stopActiveModel();
      }
    };
  }, []);

  // Запуск модели
  const startModel = async () => {
    if (!selectedModel || !canvasRef.current || !modelServiceRef.current) return;
    
    // Очистка предыдущих логов и данных
    setCalculationLogs([]);
    setLastDataPoints(new Map());
    setIsRunning(true);
    
    try {
      await modelServiceRef.current.runModel(selectedModel.scriptName, canvasRef.current);
    } catch (error) {
      console.error('Ошибка запуска модели:', error);
      addLogEntry(`Ошибка запуска модели: ${error}`);
      setIsRunning(false);
    }
  };

  // Остановка модели
  const stopModel = async () => {
    if (!modelServiceRef.current) return;
    
    try {
      await modelServiceRef.current.stopActiveModel();
      setIsRunning(false);
      addLogEntry(`Модель остановлена пользователем`);
    } catch (error) {
      console.error('Ошибка остановки модели:', error);
      addLogEntry(`Ошибка остановки модели: ${error}`);
    }
  };

  // Обработчик изменения выбранной модели
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const scriptName = e.target.value;
    const model = AVAILABLE_MODELS.find(m => m.scriptName === scriptName);
    
    // Останавливаем текущую модель перед выбором новой
    if (isRunning && modelServiceRef.current) {
      modelServiceRef.current.stopActiveModel();
      setIsRunning(false);
    }
    
    setSelectedModel(model || null);
    setCalculationLogs([]);
    setLastDataPoints(new Map());
  };

  // При изменении размера окна обновляем canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && modelServiceRef.current && isRunning) {
        // Переинициализируем canvas при изменении размера окна
        modelServiceRef.current.initCanvas(canvasRef.current);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isRunning]);

  return (
    <div className="model-selector-container">
      <h2>{t('select_model')}</h2>
      
      <div className="model-selection">
        <select 
          value={selectedModel?.scriptName || ''} 
          onChange={handleModelChange}
          disabled={isRunning}
        >
          <option value="">{t('choose_model')}</option>
          {AVAILABLE_MODELS.map(model => (
            <option key={model.scriptName} value={model.scriptName}>
              {model.name}
            </option>
          ))}
        </select>
        
        {selectedModel && (
          <div className="model-description">
            <p>{selectedModel.description}</p>
          </div>
        )}
      </div>
      
      <div className="model-controls">
        <button 
          onClick={startModel} 
          disabled={!selectedModel || isRunning}
          className="control-button start-button"
        >
          {t('start_model')}
        </button>
        <button 
          onClick={stopModel} 
          disabled={!isRunning}
          className="control-button stop-button"
        >
          {t('stop_model')}
        </button>
      </div>
      
      <div className="visualization-container">
        <div className="model-visualization">
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={400} 
            style={{ border: '1px solid #ccc', background: '#f5f5f5' }}
          />
        </div>
        
        <div className="calculation-logs">
          <h3>{t('calculation_logs')}</h3>
          <div 
            ref={logContainerRef}
            className="logs-container"
          >
            {calculationLogs.length > 0 ? (
              calculationLogs.map((log, index) => (
                <div key={index} className="log-entry">{log}</div>
              ))
            ) : (
              <div className="empty-log">{t('no_logs')}</div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .model-selector-container {
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .model-selection {
          margin-bottom: 20px;
        }
        
        .model-selection select {
          width: 100%;
          padding: 8px;
          font-size: 16px;
        }
        
        .model-description {
          margin-top: 10px;
          padding: 10px;
          background: #f0f0f0;
          border-radius: 4px;
        }
        
        .model-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .control-button {
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          border: none;
          border-radius: 4px;
        }
        
        .start-button {
          background-color: #4CAF50;
          color: white;
        }
        
        .start-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .stop-button {
          background-color: #f44336;
          color: white;
        }
        
        .stop-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .visualization-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        @media (min-width: 900px) {
          .visualization-container {
            flex-direction: row;
          }
          
          .model-visualization {
            flex: 3;
          }
          
          .calculation-logs {
            flex: 2;
          }
        }
        
        .model-visualization {
          margin-bottom: 20px;
        }
        
        .model-visualization canvas {
          width: 100%;
          height: auto;
          max-height: 400px;
          display: block;
        }
        
        .calculation-logs {
          margin-top: 0;
        }
        
        .calculation-logs h3 {
          margin-top: 0;
          margin-bottom: 10px;
        }
        
        .logs-container {
          height: 300px;
          overflow: auto;
          border: 1px solid #ddd;
          padding: 8px;
          font-family: monospace;
          font-size: 12px;
          background: #f8f8f8;
          border-radius: 4px;
        }
        
        .log-entry {
          padding: 2px 0;
          border-bottom: 1px solid #eee;
        }
        
        .empty-log {
          color: #999;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}; 