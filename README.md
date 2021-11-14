# PLEASE READ:
Consider using my superior tally software, [Tally Arbiter](http://github.com/josephdadams/tallyarbiter). No further development is being done to ProTally.

If you still want to use it, read on:

# ProTally
On-screen tally software for use with products like ProPresenter or ProVideoServer, enabling the operator to know when their source is visible on-air in a TSL 3.1 protocol environment, like a Ross Carbonite switcher. It also supports tally information from Blackmagic ATEM switchers, OBS Studio, Bitfocus Companion, and Roland switchers that support Smart Tally.

Copyright 2019 Joseph Adams.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

It is not sold, authorized, or associated in any way with any other company or product. To contact the author or for more information, please visit <www.techministry.blog>.

## SEE IT IN ACTION:
Here is a walkthrough video made by Alex Hasker to show you what this software can do: https://www.youtube.com/watch?v=rF347qKqC9Y

## HOW TO USE THIS PROGRAM:
Download the latest [release](https://github.com/josephdadams/ProTally/releases) from Github.
Open the ProTally Settings menu.

You can choose one of the following supported devices:

* Ross Carbonite
* Ross Carbonite Black
* Ross Carbonite Black Solo
* Ross Graphite
* Generic TSL 3.1 Device
* Blackmagic ATEM
* OBS Studio
* Bitfocus Companion
* Roland Smart Tally

### Using a Ross Carbonite, Carbonite Black, Carbonite Black Solo, or Graphite Switcher:

On your Ross switcher, configure a new device with these settings:
* IP Address of computer running ProTally
* Port to send data to (example: 9800)
* Transport Type: UDP
* In ProTally, select the Ross device type you are using in the device list at the top of the Settings menu.
* Make sure the Port number matches what you specified on your Ross device.
* Select "UDP" as the protocol type.
* Click "Connect".

### Using the TSL UMD 3.1 Protocol:

On your Tally server (ImageVideo TSI 4000, etc.), configure a client with these settings:
* IP Address of computer running ProTally
* Port to send data to (example: 9800)
* Transport Type: TCP or UDP (ProTally supports TSL data on either TCP or UDP depending on what your Tally Server needs)
* In ProTally, select "Generic TSL 3.1 Device" in the device list at the top of the Settings menu.
* Make sure the Port number matches what you specified on your Tally server.
* Click "Connect".

### Using a Blackmagic ATEM:

* Select "Blackmagic ATEM" in the device list at the top of the settings menu.
* If your Blackmagic ATEM Switcher is not in the drop down list, it was not detected automatically on the network via bonjour/mdns. Choose "manual entry" from the list and type in the IP address of your switcher.
* Click "Connect".
* ProTally will monitor for any internal or external sources based on what you choose for each tally window.

### Using OBS Studio:
* Install the OBS Websockets Plugin for your OBS Studio, and follow the configuration instructions provided.
* In ProTally, Select "OBS Studio" in the device list at the top of the settings menu.
* Enter the IP Address, Port, and Password you defined in the OBS Websocket settings.
* Click "Connect".
* ProTally can monitor any available source in OBS, whether it is a physical input via a capture card, or a virtual input like NDI, a browser window, color source, etc.

### Using Bitfocus Companion

* In Companion, create a new module instance for ProTally, using the IP address of the computer running ProTally. You can create multiple instances if you need to control multiple computers running ProTally.
* Specify the port Companion should send tally data to.
* In ProTally, choose "Bitfocus Companion" in the device list at the top of the settings menu.
* Enter a listen port that matches the port you chose in Companion. The default port in Companion is 9800.
* Click "Connect".
* Enable the ProTally windows you want to be controllable from Companion, and position them where desired.
* ProTally will listen for data from Companion to show a Preview, Program, or Preview/Program box. You can also send a "Beacon" from Companion which will flash a box with a custom color at a custom rate.

### Using Roland V-60HD Smart Tally:
* On your Roland device, make sure the IP address is set and the smart tally feature is enabled.
* In ProTally, choose "Roland V-60HD Smart Tally" in the device list at the top of the settings menu.
* Enter the IP Address of the Roland switcher.
* Click "Connect".
* ProTally can monitor any of the 8 input sources from the Roland switcher by continously polling the switcher for updates.

## Specifying Tally Addresses:

* ProTally supports up to 4 Tally Windows.
* Pick or enter an address (input number) into a Tally Address field. These are dropdown list choices if using a specific device, or text boxes if using the Generic TSL protocol.
* To disable a particular Tally Box, choose "Black" or enter "0" into the Tally Address field. (Or choose "Disabled" if using Bitfocus Companion
* Tally Boxes can either be displayed as transparent boxes with a color border, or as a filled-in box. The transparent box is turned on by default.
* Tally Boxes can display the label, if the name is known and transmitted with the tally data.
* To resize/position a tally box, click "Resize/Move" for that box. The Tally Box will appear on the screen. When you are finished, click "Save Window Position".
* To use a blink(1) device with ProTally, it must be connected to the system prior to opening ProTally. Then, select it from the list for the Tally window you want to pair it with. You can choose to have it mirror the tally window, not use the blink(1) device at all, or only use the blink(1) device with no visible on-screen window.
* Update all desired Tally Address fields and choose "Update Tally Settings" at the bottom of the menu to save the settings.

## Special Notes:
* Tally Windows will display on top of all other windows. To temporarily hide them, choose "Hide All Boxes" from the tray menu.
* You can resize/reposition windows to fit where you would like them on the screen by choosing "Resize" from the Settings window for each Tally Box.
* Preview, Program, and Preview+Program (when an input is set to both) colors can be customized for each window. Some TSL devices will send Preview data in Tally 2 with Program in Tally 1, whereas ProTally expects the opposite. If this is the case, simply change the colors to match the state desired. Click "Update Tally Settings" to save color changes.
