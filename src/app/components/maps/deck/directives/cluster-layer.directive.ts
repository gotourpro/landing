import { Directive, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { DeckService } from '../services/deck.service';

@Directive({
    selector: 'clusterLayer',
    standalone: true
  })
  export class ClusterLayerDirective implements OnChanges {
    @Input() public clusteredData: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
  
    // Один параметр для цвета линии. По умолчанию — белый.
    @Input() public clusterLineColor: string = '#ffffff';
  
    private clusterLayer?: ScatterplotLayer<any>;
  
    // Цвета для кластеров задаются в HEX
    private readonly colorMapping: { [key: string]: string } = {
      '750': '#f28cb1',
      '100': '#f1f075',
      '0': '#51bbd6'
    };
  
    // Радиус кластеров в зависимости от количества точек
    private readonly radiusMapping: [number, number][] = [
      [750, 40],
      [100, 30],
      [1, 20],
      [0, 6] // Маленький радиус для одиночных точек
    ];
  
    constructor(private readonly _deckService: DeckService) {}
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['clusteredData']) {
        this._updateLayer();
      }
    }
  
    private _updateLayer(): void {
      if (this.clusterLayer) {
        this._deckService.removeLayer(this);
      }
  
      // Формируем массив данных с вычислением размера и цвета
      const data = this.clusteredData.features
        .filter(cluster => cluster.geometry.type === 'Point')
        .map(cluster => {
          const pointCount = cluster.properties?.['point_count'] ?? 0;
          const isCluster = pointCount > 1;
          return {
            position: (cluster.geometry as GeoJSON.Point).coordinates,
            size: this._getCircleRadius(pointCount),
            color: this._convertHexToRGBA(this._getCircleColor(pointCount, isCluster))
          };
        })
        // Сортируем по размеру: меньшие кластеры рисуются первыми, большие – позже
        .sort((a, b) => a.size - b.size);
  
      this.clusterLayer = new ScatterplotLayer({
        id: 'cluster-layer',
        data,
        pickable: true,
        getPosition: (d: any) => d.position,
        getRadius: (d: any) => d.size,
        getFillColor: (d: any) => d.color,
        stroked: true,
        getLineWidth: 2,
        lineWidthUnits: 'pixels',
        getLineColor: this._convertHexToRGBA(this.clusterLineColor) as any,
        radiusUnits: 'pixels'
      });
  
      this._deckService.addLayer(this, this.clusterLayer);
    }
  
    private _getCircleRadius(pointCount: number): number {
      // Проходим по маппингу и возвращаем соответствующий радиус
      for (const [threshold, radius] of this.radiusMapping) {
        if (pointCount >= threshold) return radius;
      }
      return 10;
    }
  
    private _getCircleColor(pointCount: number, isCluster: boolean): string {
      // Если это одиночная точка, возвращаем красный цвет
      if (!isCluster) return '#ff0000';
      if (pointCount >= 750) return this.colorMapping['750'];
      if (pointCount >= 100) return this.colorMapping['100'];
      return this.colorMapping['0'];
    }
  
    private _convertHexToRGBA(hex: string, alpha: number = 255): number[] {
      const r = parseInt(hex.substring(1, 3), 16);
      const g = parseInt(hex.substring(3, 5), 16);
      const b = parseInt(hex.substring(5, 7), 16);
      return [r, g, b, alpha];
    }
  }