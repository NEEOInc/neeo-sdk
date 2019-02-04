# NEEO View Documentation

The view for devices is dynamically generated based on their capabilities and components.
This process is done in three steps:

1. A list of compatible widget is generated for the recipe view
2. Slides are generated based on the available widgets
3. Slider are reordered or hidden based on user settings

## Widgets

This list contains the requirements for each widgets, if these are met by
a given device the widgets will be available for recipes using that device.

### Color Buttons

Buttons: `FUNCTION RED`, `FUNCTION GREEN`, `FUNCTION YELLOW`, `FUNCTION BLUE`
Button Groups: `Color Buttons`

### Legacy Controlpad

Buttons: `ENTER`, `CURSOR UP`, `CURSOR DOWN`, `CURSOR LEFT`, `CURSOR RIGHT`

### Numpad

Buttons: `DIGIT 0`, `DIGIT 1`, `DIGIT 2`, `DIGIT 3`, `DIGIT 4`, `DIGIT 5`, `DIGIT 6`, `DIGIT 7`, `DIGIT 8`, `DIGIT 9`, `INFO` (Optional), `GUIDE` (Optional)
Button Groups: `Numpad`

### Transport

Buttons: `PLAY`, `PAUSE`, `STOP`
Button Groups: `Transport`

### Transport Toggle

Buttons: `PLAY PAUSE TOGGLE`, `STOP`

### Transport w/o Stop

Buttons: `PLAY`, `PAUSE`

### Legacy Transport Scan

Buttons: `SKIP BACKWARD`, `SKIP FORWARD`

### Transport Search

Buttons: `REVERSE`, `FORWARD`
Button Groups: `Transport Search`

### Transport Skip

Buttons: `SKIP SECONDS BACKWARD`, `SKIP SECONDS FORWARD`
Button Groups: `Transport Skip`

### Record

Buttons: `MY RECORDINGS` (Optional), `RECORD` (Optional), `LIVE` (Optional)

### Guide & Info

Buttons: `GUIDE` (Optional), `INFO` (Optional)

### Menu & Back

Buttons: `MENU`, `BACK`
Button Groups: `Menu and Back`

### Menu

Buttons: `MENU`

### Menu & Back - Disc

Buttons: `MENU DISC`, `BACK`

### Language

Buttons: `SUBTITLE` (Optional), `LANGUAGE` (Optional)

### Zapper

Buttons: `CHANNEL UP`, `CHANNEL DOWN`
Button Groups: `Channel Zapper`

### Zapper - Tuner

Buttons: `PRESET UP`, `PRESET DOWN`

Other requirements:
- Limited to devices type: `TUNER`

### Zapper - Tuning up/down

Buttons: `TUNING UP`, `TUNING DOWN`

Other requirements:
- Limited to devices type: `TUNER`

### Controlpad

Buttons: `CURSOR ENTER`, `CURSOR UP`, `CURSOR DOWN`, `CURSOR LEFT`, `CURSOR RIGHT`
Button Groups: `Controlpad`

### Transport Scan

Buttons: `PREVIOUS`, `NEXT`
Button Groups: `Transport Scan`

### Open / Close

Buttons: `OPEN/CLOSE`

### Eject

Buttons: `EJECT`

### Home

Buttons: `MENU HOME`

### Streaming Apps

Buttons: `AMAZON` (Optional), `CRACKLE` (Optional), `HULU` (Optional), `HULU PLUS` (Optional), `INPUT SPOTIFY` (Optional), `NETFLIX` (Optional), `GOOGLE PLAY` (Optional), `VIMEO` (Optional), `VUDU` (Optional), `YOU TUBE` (Optional)

### Volume Footer

Other requirements:
- Requires `VOLUME UP` and `VOLUME DOWN` buttons

### Favorites

Buttons: `DIGIT 0`, `DIGIT 1`, `DIGIT 2`, `DIGIT 3`, `DIGIT 4`, `DIGIT 5`, `DIGIT 6`, `DIGIT 7`, `DIGIT 8`, `DIGIT 9`
Button Groups: `Numpad`

Other requirements:
- Limited to devices types: `TV`, `DVB`, `TUNER`, with tuner enabled

### Inputs

Buttons: `INPUT *` (Pattern)

### HDMI Inputs

Buttons: `INPUT HDMI*` (Pattern)

### Brightness Slider

Other requirements:
- Limited to devices type: `LIGHT`

### Player

Other requirements:
- Device supports the player interface, see `addPlayerWidget()`

## Slides

Slides are generated based on available widgets as well as other requirements are met.
Optional widgets are included when available.

Notes:

* (Optional) – Widgets are included if available, skipped otherwise
* NOT – The slide will be skipped if this widget is available
* or - The slide will use the first widget it finds in the list, if none are found the slide is skipped

### Power on for {{device}}

No Widget Requirements.

Other requirements:
- User marked inputs as not working during wiring or Device needs wiring but has no `/INPUT /` commands

### Power off for {{device}}

No Widget Requirements.

Other requirements:
- Device is missing `POWER ON` and `POWER OFF` and does not use the assumption mode

### Favorites

Widget Requirements
- Favorites

Other requirements:
- Limited to devices type: `TV` or Limited to devices type: `DVB` or Limited to devices type: `TUNER`
- Device doesn't use the fullscreen player

### Shortcuts

No Widget Requirements.

Other requirements:
- Excludes device type `ACCESSORY`
- Device doesn't use the fullscreen player

### Inputs

Widget Requirements
- Inputs

Other requirements:
- Limited to devices type: `AVRECEIVER` or Limited to devices type: `SOUNDBAR` or Limited to devices type: `AUDIO` or Limited to devices type: `PROJECTOR`

### Inputs

Widget Requirements
- HDMI Inputs

Other requirements:
- Limited to devices type: `HDMISWITCH`

### Apps

Widget Requirements
- Streaming Apps

Other requirements:
- Limited to devices type: `TV` or Limited to devices type: `DVB` or Limited to devices type: `VOD` or Limited to devices type: `MEDIAPLAYER` or Limited to devices type: `PROJECTOR`

### Control pad

Widget Requirements
- (Optional) Color Buttons
- Menu & Back
- (Optional) Home
- Controlpad or Legacy Controlpad
- (Optional) Guide & Info

Other requirements:
- Limited to devices type: `TV` or Limited to devices type: `DVB` or Limited to devices type: `GAMECONSOLE` or Limited to devices type: `MEDIAPLAYER` or Limited to devices type: `PROJECTOR`

### Control pad

Widget Requirements
- (Optional) Color Buttons
- Menu
- Controlpad or Legacy Controlpad

Other requirements:
- Limited to devices type: `TV` or Limited to devices type: `DVB` or Limited to devices type: `GAMECONSOLE` or Limited to devices type: `MEDIAPLAYER` or Limited to devices type: `PROJECTOR`

### Menu Control

Widget Requirements
- (Optional) Color Buttons
- Menu & Back

Other requirements:
- Limited to devices type: `TV` or Limited to devices type: `DVB` or Limited to devices type: `GAMECONSOLE` or Limited to devices type: `MEDIAPLAYER` or Limited to devices type: `PROJECTOR`

### Control pad

Widget Requirements
- (Optional) Color Buttons
- Menu & Back - Disc
- Controlpad or Legacy Controlpad

Other requirements:
- Limited to devices type: `DVD`

### Control pad

Widget Requirements
- Menu & Back
- Controlpad or Legacy Controlpad
- Transport or Transport Toggle or Transport w/o Stop

Other requirements:
- Limited to devices type: `VOD`

### TV Number pad

Widget Requirements
- (Optional) Color Buttons
- Numpad

Other requirements:
- Limited to devices type: `TV` or Limited to devices type: `DVB`

### Disc Number pad

Widget Requirements
- (Optional) Color Buttons
- Numpad

Other requirements:
- Limited to devices type: `DVD`

### Transport

Widget Requirements
- (Optional) Language
- Transport or Transport Toggle or Transport w/o Stop
- Transport Search
- Transport Scan or Legacy Transport Scan
- (Optional) Transport Skip
- (Optional) Eject or (Optional) Open / Close

Other requirements:
- Limited to devices type: `DVD` or Limited to devices type: `VOD` or Limited to devices type: `GAMECONSOLE` or Limited to devices type: `MEDIAPLAYER`

### Transport

Widget Requirements
- (Optional) Language
- Transport or Transport Toggle or Transport w/o Stop
- Transport Scan or Legacy Transport Scan
- NOT Transport Search
- (Optional) Transport Skip

Other requirements:
- Limited to devices type: `DVD` or Limited to devices type: `VOD` or Limited to devices type: `GAMECONSOLE` or Limited to devices type: `MEDIAPLAYER`

### Transport

Widget Requirements
- (Optional) Language
- Transport or Transport Toggle or Transport w/o Stop
- NOT Transport Search
- (Optional) Transport Skip

Other requirements:
- Limited to devices type: `DVD` or Limited to devices type: `VOD` or Limited to devices type: `GAMECONSOLE` or Limited to devices type: `MEDIAPLAYER`

### Transport

Widget Requirements
- (Optional) Language
- Transport or Transport Toggle or Transport w/o Stop
- Transport Search
- NOT Transport Scan
- NOT Legacy Transport Scan
- (Optional) Transport Skip

Other requirements:
- Limited to devices type: `DVD` or Limited to devices type: `VOD` or Limited to devices type: `GAMECONSOLE` or Limited to devices type: `MEDIAPLAYER`

### Transport

Widget Requirements
- (Optional) Color Buttons
- (Optional) Language
- Transport or Transport Toggle or Transport w/o Stop
- (Optional) Transport Search
- (Optional) Transport Skip
- (Optional) Record

Other requirements:
- Limited to devices type: `TV` or Limited to devices type: `DVB`

### Channel Zapper

Widget Requirements
- Zapper

Other requirements:
- Limited to devices type: `TV` or Limited to devices type: `DVB`

### Channel Zapper

Widget Requirements
- Zapper - Tuner or Zapper - Tuning up/down

Other requirements:
- Limited to devices type: `TUNER`

### Player Controls

Widget Requirements
- Player

Other requirements:
- Device uses fullscreen player, and the player widget is available

