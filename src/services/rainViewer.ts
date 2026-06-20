export type RainViewerFrame = {
  time: number;
  path: string;
};

export type RainViewerTimeline = {
  host: string;
  frames: RainViewerFrame[];
};

type RainViewerResponse = {
  host: string;
  radar: {
    past: RainViewerFrame[];
    nowcast?: RainViewerFrame[];
  };
};

const RAIN_VIEWER_URL = "https://api.rainviewer.com/public/weather-maps.json";

export async function getRainViewerTimeline(): Promise<RainViewerTimeline> {
  const response = await fetch(RAIN_VIEWER_URL);

  if (!response.ok) {
    throw new Error("Non riesco a caricare il radar pioggia.");
  }

  const data = (await response.json()) as RainViewerResponse;

  return {
    host: data.host,
    frames: [...data.radar.past, ...(data.radar.nowcast ?? [])],
  };
}

export function buildRadarTileUrl(host: string, frame: RainViewerFrame) {
  return `${host}${frame.path}/512/{z}/{x}/{y}/6/1_1.png`;
}
