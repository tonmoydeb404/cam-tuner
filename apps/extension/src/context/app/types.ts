export interface IAppCameraSource {
  label: string;
  deviceId: string;
}

export interface IAppContext {
  enable: boolean;
  setEnable: (v: boolean) => void;

  cameraSource: IAppCameraSource | null;
  initCameraSource: (v: IAppCameraSource) => void;
  setCameraSource: (v: IAppCameraSource | null) => void;
}
