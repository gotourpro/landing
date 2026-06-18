import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TextLayer } from '@deck.gl/layers';
import { DeckService } from '../services/deck.service';

@Directive({
  selector: 'clusterCountLayer',
  standalone: true
})
export class ClusterCountLayerDirective implements OnChanges {
  @Input() public clusteredData: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

  private textLayer?: TextLayer<any>;

  constructor(private readonly _deckService: DeckService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['clusteredData']) {
      this._updateLayer();
    }
  }

  private _updateLayer(): void {
    if (this.textLayer) {
      this._deckService.removeLayer(this);
    }

    this.textLayer = new TextLayer({
      id: 'text-layer',
      data: this.clusteredData.features,
      getPosition: (d: any) => d.geometry.coordinates,
      getText: (d: any) => (d.properties.cluster ? `${d.properties.point_count}` : ''),
      getSize: 12,
      getTextAnchor: 'middle',
      getAlignmentBaseline: 'center',
      getColor: [0, 0, 0],
    });

    this._deckService.addLayer(this, this.textLayer);
  }
}
