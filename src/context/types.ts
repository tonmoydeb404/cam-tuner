export interface IAppContext {
  enable: boolean;
  setEnable: React.Dispatch<React.SetStateAction<boolean>>;

  mirror: boolean;
  setMirror: React.Dispatch<React.SetStateAction<boolean>>;

  cameraSource: string | null;
  setCameraSource: React.Dispatch<React.SetStateAction<string | null>>;

  aspectRatio: string;
  setAspectRatio: React.Dispatch<React.SetStateAction<string>>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;

  brightness: number;
  setBrightness: React.Dispatch<React.SetStateAction<number>>;
  contrast: number;
  setContrast: React.Dispatch<React.SetStateAction<number>>;
  saturation: number;
  setSaturation: React.Dispatch<React.SetStateAction<number>>;
}
