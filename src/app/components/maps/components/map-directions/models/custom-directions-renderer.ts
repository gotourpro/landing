export function createCustomDirectionsRenderer(options):any {

return class CustomDirectionsRenderer extends google.maps.DirectionsRenderer {
  constructor(options: google.maps.DirectionsRendererOptions) {
    super(options);
}
}


}