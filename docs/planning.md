# CamTuner
CamTuner is a web cam configurator web extension

## Features

1. Crop the video stream to a specific aspect ratio
2. Zoom in and out of the video stream
3. Align the video stream to a specific position

## Applications

### Web

Website is for previewing the video stream and configuring the settings realtime.

**Tech Stack**
1. Next.js


### Extension

Extension is for applying quick settings on the video stream. It will have a popup that will allow user to select the aspect ratio, zoom, and alignment. But we can't put preview or video source selection in extension due to permission issue. For preview we will inject a iframe of website preview in the webpage.

**Tech Stack**
1. Wxt


## Structure
1. Follow modular architecture
2. Each file should not exceed then 150 line