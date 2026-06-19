import { environment } from "../../environments/environment";
import { DEFAULT_MAP_STYLE_OPTIONS } from "../components/maps/components/map-drawing/constants/data-layer-style.options.constants";
import { GoogleMapsLanguage } from "../enums/google-maps-language.enum";
import { GoogleMapsRegion } from "../enums/google-maps-region.enum";
import { IGoogleMapsConfig } from "../interfaces/google.maps.config.interface";

export const GOOGLE_DEFAULT_CONFIG: IGoogleMapsConfig = {
    loader: {
        apiKey: environment.apiKeyGoogle!,
        language: GoogleMapsLanguage.RU,
        region: GoogleMapsRegion.RU,
        version: 'weekly',
        libraries: [],
        mapIds: ['a870aaade7ac6f22']
    },
    style: {
        ...DEFAULT_MAP_STYLE_OPTIONS
    }
};