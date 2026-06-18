const style = [
  {
    'id': 'directions-route-line-alt-casing',
    'type': 'line',
    'source': 'directions',
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#6a83d7',
      'line-width': 12
    },
    'filter': [
      'all',
      ['in', '$type', 'LineString'],
      ['in', 'route', 'alternate']
    ]
  },
  {
    'id': 'directions-route-line-alt',
    'type': 'line',
    'source': 'directions',
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#BCCEFB',
      'line-width': 6
    },
    'filter': [
      'all',
      ['in', '$type', 'LineString'],
      ['in', 'route', 'alternate']
    ]
  },
  {
    'id': 'directions-route-line-casing',
    'type': 'line',
    'source': 'directions',
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#0B21E1',
      'line-width': 12
    },
    'filter': [
      'all',
      ['in', '$type', 'LineString'],
      ['in', 'route', 'selected']
    ]
  },
  {
    'id': 'directions-route-line',
    'type': 'line',
    'source': 'directions',
    'layout': {
      'line-cap': 'butt',
      'line-join': 'round'
    },
    'paint': {
      'line-color': {
        'property': 'congestion',
        'type': 'categorical',
        'default': '#3B82F6',
        'stops': [
          ['unknown', '#4882c5'],
          ['low', '#4882c5'],
          ['moderate', '#f09a46'],
          ['heavy', '#e34341'],
          ['severe', '#8b2342']
        ]
      },
      'line-width': 6
    },
    'filter': [
      'all',
      ['in', '$type', 'LineString'],
      ['in', 'route', 'selected']
    ]
  },
  {
    'id': 'directions-hover-point-casing',
    'type': 'circle',
    'source': 'directions:markers',
    'paint': {
      'circle-radius': 8,
      'circle-color': '#fff'
    },
    'filter': [
      'all',
      ['in', '$type', 'Point'],
      ['in', 'id', 'hover']
    ]
  },
  {
    'id': 'directions-hover-point',
    'type': 'circle',
    'source': 'directions:markers',
    'paint': {
      'circle-radius': 6,
      'circle-color': '#0B21E1'
    },
    'filter': [
      'all',
      ['in', '$type', 'Point'],
      ['in', 'id', 'hover']
    ]
  },
  {
    'id': 'directions-waypoint-point-casing',
    'type': 'circle',
    'source': 'directions:waypoints',
    'paint': {
      'circle-radius': 8,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'directions-waypoint-point',
    'type': 'circle',
    'source': 'directions:waypoints',
    'paint': {
      'circle-radius': 6,
      'circle-color': [
        'match',
        ['get', 'type'],
        'loading', '#8BDE8C',
        'unloading', '#FF5757',
         '#8a8bc9'
      ]
    }
  },
  {
    'id': 'directions-hover-waypoint-point-casing',
    'type': 'circle',
    'source': 'directions:hover-waypoints',
    'paint': {
      'circle-radius': 8,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'directions-hover-waypoint-point',
    'type': 'circle',
    'source': 'directions:hover-waypoints',
    'paint': {
      'circle-radius': 6,
      'circle-color': '#0B21E1'
    }
  },
  {
    'id': 'directions-origin-point',
    'type': 'circle',
    'source': 'directions:markers',
    'paint': {
      'circle-radius': 14,
      'circle-color': '#8BDE8C'
    },
    'filter': [
      'all',
      ['in', '$type', 'Point'],
      ['in', 'markerSymbol', 'A']
    ]
  },
  {
    'id': 'directions-origin-label',
    'type': 'symbol',
    'source': 'directions:markers',
    'layout': {
      'text-field': 'A',
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': 12
    },
    'paint': {
      'text-color': '#fff'
    },
    'filter': [
      'all',
      ['in', '$type', 'Point'],
      ['in', 'markerSymbol', 'A']
    ]
  },
  {
    'id': 'directions-waypoint-label',
    'type': 'symbol',
    'source': 'directions:waypoints',
    'layout': {
      'text-field': ['get', 'placeName'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 11,
      'text-transform': 'uppercase',
      'text-letter-spacing': 0.05,
      'text-offset': [0, 3]
    },
    'paint': {
      'text-color': '#202',
      'text-halo-color': '#fff',
      'text-halo-width': 2
    },
    'filter': [
      'all',
      ['in', '$type', 'Point'],
      ['has', 'placeName']
    ]
  },
  {
    'id': 'directions-destination-point',
    'type': 'circle',
    'source': 'directions:markers',
    'paint': {
      'circle-radius': 14,
      'circle-color': '#FF5757'
    },
    'filter': [
      'all',
      ['in', '$type', 'Point'],
      ['in', 'markerSymbol', 'B']
    ]
  },
  {
    'id': 'directions-destination-label',
    'type': 'symbol',
    'source': 'directions:markers',
    'layout': {
      'text-field': 'B',
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': 12
    },
    'paint': {
      'text-color': '#fff'
    },
    'filter': [
      'all',
      ['in', '$type', 'Point'],
      ['in', 'markerSymbol', 'B']
    ]
  },
  // Новый слой для текстовых меток, использующий поле placeName
  {
    'id': 'directions-label',
    'type': 'symbol',
    'source': 'directions:markers',
    'layout': {
      'text-field': ['get', 'placeName'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 11,
      'text-transform': 'uppercase',
      'text-letter-spacing': 0.05,
      'text-offset': [0, 4]
    },
    'paint': {
      'text-color': '#202',
      'text-halo-color': '#fff',
      'text-halo-width': 2
    },
    'filter': [
      'all',
      ['in', '$type', 'Point'],
      ['has', 'placeName']
    ]
  }
];

export default style;

