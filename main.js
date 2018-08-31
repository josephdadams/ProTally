/* 
Copyright 2018 Joseph Adams. www.techministry.blog.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

//Electron Modules
const electron = require("electron");
const WindowStateManager = require('electron-window-state-manager');
var eNotify = null;
var notificationArray = [];
    
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;

const ipc = electron.ipcMain;

//Local Storage Module
const Store = require('./store.js');
const store = new Store({
  configName: 'user-preferences',
  defaults: {}
});

//TSL Protocol
const TSLUMD = require("tsl-umd"); // UDP package
const defaultTSLListenPort = 9800;
var umd = null;
var tsltype_inuse = null;

//Blackmagic ATEM Module
const BlackmagicATEM = require('atem');
const defaultAtemServerPort = 9910;
var atemDevice = null;

//Device-Specific Arrays
var tallySettingsArray = [];
var useTallySettingsArray = false;
    
var TallySettings_Carbonite = [
    {address: 0, label: "BK, BG, no src"},
    {address: 1, label: "Input 1"},
    {address: 2, label: "Input 2"},
    {address: 3, label: "Input 3"},
    {address: 4, label: "Input 4"},
    {address: 5, label: "Input 5"},
    {address: 6, label: "Input 6"},
    {address: 7, label: "Input 7"},
    {address: 8, label: "Input 8"},
    {address: 9, label: "Input 9"},
    {address: 10, label: "Input 10"},
    {address: 11, label: "Input 11"},
    {address: 12, label: "Input 12"},
    {address: 13, label: "Input 13"},
    {address: 14, label: "Input 14"},
    {address: 15, label: "Input 15"},
    {address: 16, label: "Input 16"},
    {address: 17, label: "Input 17"},
    {address: 18, label: "Input 18"},
    {address: 19, label: "Input 19"},
    {address: 20, label: "Input 20"},
    {address: 21, label: "Input 21"},
    {address: 22, label: "Input 22"},
    {address: 23, label: "Input 23"},
    {address: 24, label: "Input 24"},
    {address: 25, label: "ME 1 BKGD", type: "Program"},
    {address: 26, label: "ME 1 PST", type: "Preview"},
    {address: 27, label: "ME 1 Key 1 Video"},
    {address: 28, label: "ME 1 Key 1 Alpha"},
    {address: 29, label: "ME 1 Key 2 Video"},
    {address: 30, label: "ME 1 Key 2 Alpha"},
    {address: 31, label: "ME 1 Key 3 Video"},
    {address: 32, label: "ME 1 Key 3 Alpha"},
    {address: 33, label: "ME 1 Key 4 Video"},
    {address: 34, label: "ME 1 Key 4 Alpha"},
    {address: 35, label: "ME 2 BKGD", type: "Program"},
    {address: 36, label: "ME 2 PST", type: "Preview"},
    {address: 37, label: "ME 2 Key 1 Video"},
    {address: 38, label: "ME 2 Key 1 Alpha"},
    {address: 39, label: "ME 2 Key 2 Video"},
    {address: 40, label: "ME 2 Key 2 Alpha"},
    {address: 41, label: "ME 2 Key 3 Video"},
    {address: 42, label: "ME 2 Key 3 Alpha"},
    {address: 43, label: "ME 2 Key 4 Video"},
    {address: 44, label: "ME 2 Key 4 Alpha"},
    {address: 45, label: "ME 3 BKGD", type: "Program"},
    {address: 46, label: "ME 3 PST", type: "Preview"},
    {address: 47, label: "ME 3 Key 1 Video"},
    {address: 48, label: "ME 3 Key 1 Alpha"},
    {address: 49, label: "ME 3 Key 2 Video"},
    {address: 50, label: "ME 3 Key 2 Alpha"},
    {address: 55, label: "MultiScreen 1 BKGD", type: "Program"},
    {address: 56, label: "MultiScreen 1 PST", type: "Preview"},
    {address: 57, label: "MultiScreen 1 Key 1 Video"},
    {address: 58, label: "MultiScreen 1 Key 2 Video"},
    {address: 59, label: "MultiScreen 1 Key 2 Alpha"},
    {address: 60, label: "MultiScreen 2 BKGD", type: "Program"},
    {address: 61, label: "MultiScreen 2 PST", type: "Preview"},
    {address: 62, label: "MultiScreen 2 Key 1 Video"},
    {address: 63, label: "MultiScreen 2 Key 2 Video"},
    {address: 64, label: "MultiScreen 2 Key 2 Alpha"},
    {address: 65, label: "Aux 1"},
    {address: 66, label: "Aux 2"},
    {address: 67, label: "Aux 3"},
    {address: 68, label: "Aux 4"},
    {address: 69, label: "Aux 5"},
    {address: 70, label: "Aux 6"},
    {address: 71, label: "Aux 7"},
    {address: 72, label: "Aux 8"},
    {address: 81, label: "MiniME™ 1 BKGD", type: "Program"},
    {address: 82, label: "MiniME™ 1 PST", type: "Preview"},
    {address: 83, label: "MiniME™ 1 Key 1 Video"},
    {address: 84, label: "MiniME™ 1 Key 2 Video"},
    {address: 85, label: "MiniME™ 1 Key 2 Alpha"},
    {address: 86, label: "MiniME™ 2 BKGD", type: "Program"},
    {address: 87, label: "MiniME™ 2 PST", type: "Preview"},
    {address: 88, label: "MiniME™ 2 Key 1 Video"},
    {address: 89, label: "MiniME™ 2 Key 2 Video"},
    {address: 90, label: "MiniME™ 2 Key 2 Alpha"},
    {address: 91, label: "MiniME™ 3 BKGD", type: "Program"},
    {address: 92, label: "MiniME™ 3 PST", type: "Preview"},
    {address: 93, label: "MiniME™ 3 Key 1 Video"},
    {address: 94, label: "MiniME™ 3 Key 2 Video"},
    {address: 95, label: "MiniME™ 3 Key 2 Alpha"},
    {address: 96, label: "MiniME™ 4 BKGD", type: "Program"},
    {address: 97, label: "MiniME™ 4 PST", type: "Preview"},
    {address: 98, label: "MiniME™ 4 Key 1 Video"},
    {address: 99, label: "MiniME™ 4 Key 2 Video"},
    {address: 100, label: "MiniME™ 4 Key 2 Alpha"},
    {address: 101, label: "Media-Store 1"},
    {address: 102, label: "Media-Store 2"},
    {address: 103, label: "Media-Store 3"},
    {address: 104, label: "Media-Store 4"},
    {address: 110, label: "Program", type: "Program"},
    {address: 111, label: "Preview", type: "Preview"},
    {address: 112, label: "Clean"},
    {address: 113, label: "ME 1 PGM", type: "Program"},
    {address: 114, label: "ME 1 PV", type: "Preview"},
    {address: 115, label: "ME 1 Clean"},
    {address: 116, label: "MiniME™ 1"},
    {address: 117, label: "MiniME™ 2"},
    {address: 118, label: "MiniME™ 3"},
    {address: 119, label: "MiniME™ 4"},
    {address: 120, label: "ME 2 PGM", type: "Program"},
    {address: 121, label: "ME 2 PV", type: "Preview"},
    {address: 122, label: "ME 2 Clean"}
];

var TallySettings_CarboniteBlack = [
    
];

var TallySettings_Acuity = [
    
];

var DeviceInUse = ""; // the current device type in use (TSL, Ross Carbonite, ATEM, etc.)

//General
const os = require('os');
const path = require('path');
const assetsDirectory = path.join(__dirname, 'fixtures');

//App Menus and Windows
let tray = null;
let contextMenuDefault, contextMenuShowBoxes;

let aboutWindow = null;
let settingsWindow = null;
let tallyBoxWindow1 = null;
let tallyBoxWindow2 = null;
let tallyBoxWindow3 = null;
let tallyBoxWindow4 = null;

let tallyBoxWindow1State, tallyBoxWindow2State, tallyBoxWindow3State, tallyBoxWindow4State;

let TallyArray = []; // Stores all Tally Data for the life of the app as it is processed, whether it is one of the four addresses or not

var TallyData1 = []; // Tally Data for Tally Box Window 1
var TallyData2 = []; // Tally Data for Tally Box Window 1
var TallyData3 = []; // Tally Data for Tally Box Window 1
var TallyData4 = []; // Tally Data for Tally Box Window 1

var TallyWatch1 = [];
var TallyWatch2 = [];
var TallyWatch3 = [];
var TallyWatch4 = [];

let hiddenMode = false; // Boolean for whether the Tally Boxes are currently hidden or visible

let tallyBox1_currentState = ""; // Current Tally Box State (Preview, Program, PreviewProgram)
let tallyBox2_currentState = "";
let tallyBox3_currentState = "";
let tallyBox4_currentState = "";

let tallyBox1_currentBus = ""; // Current Tally Box Bus (On Program on ME1, etc.)
let tallyBox2_currentBus = "";
let tallyBox3_currentBus = "";
let tallyBox4_currentBus = "";

let tallyBoxWindow1_resizeMode = false;
let tallyBoxWindow2_resizeMode = false;
let tallyBoxWindow3_resizeMode = false;
let tallyBoxWindow4_resizeMode = false;

//Electron App Events
app.on('ready', () => {      
      
    tray = new Tray(path.join(assetsDirectory, 'icon@2x.png'));
    
    contextMenuDefault = Menu.buildFromTemplate([
        {label: 'About', type: 'normal', click: createAboutWindow},
        {label: 'Hide All Boxes', type: 'normal', click: hideAllTallyBoxes},
        {label: 'Settings', type: 'normal', click: createSettingsWindow},
        {type:'separator'},
        {label: 'Quit', type: 'normal', click: quitApp}
    ]);
    
    contextMenuShowBoxes = Menu.buildFromTemplate([
        {label: 'About', type: 'normal', click: createAboutWindow},
        {label: 'Show All Boxes', type: 'normal', click: showAllTallyBoxes},
        {label: 'Settings', type: 'normal', click: createSettingsWindow},
        {type:'separator'},
        {label: 'Quit', type: 'normal', click: quitApp}
    ]);
    
    tray.setToolTip('ProTally');
    tray.setContextMenu(contextMenuDefault);
    
    tallyBoxWindow1State = new WindowStateManager("TallyBoxWindow1", {
        defaultWidth: 100,
        defaultHeight: 100
      });
      
    tallyBoxWindow2State = new WindowStateManager("TallyBoxWindow2", {
        defaultWidth: 100,
        defaultHeight: 100
      });
      
    tallyBoxWindow3State = new WindowStateManager("TallyBoxWindow3", {
        defaultWidth: 100,
        defaultHeight: 100
      });
      
    tallyBoxWindow4State = new WindowStateManager("TallyBoxWindow4", {
        defaultWidth: 100,
        defaultHeight: 100
      });
  
    app.dock.hide(); // Keep it out of the dock
    
    setUpNotifications();    
   
    let deviceInUse = store.get("DeviceInUse"); // The last device that was used
    
    setUpDevice(deviceInUse);    
    createTallyBoxWindows(true);
 });
 
function setUpDevice(deviceInUse)
{
    DeviceInUse = deviceInUse;
    
    switch(deviceInUse)
    {
        case "BlackmagicATEM":
            setUpAtemServer();
            break;
        case "RossCarbonite":
            stopTSLServer();
            setUpTSLServer();
            //tallySettingsArray = TallySettings_Carbonite.slice();
            //useTallySettingsArray = false;
            break;
        case "TSL3.1":
            stopTSLServer();
            setUpTSLServer();
            useTallySettingsArray = false;
            break;
        default:
            stopTSLServer();
            notify("No Device Stored. You need to configure a device before you can continue.", true);
            break;
    }
    
    console.log("Device In Use: *" + DeviceInUse + "*");
}
 
function quitApp()
{        
    try
    {
        if (eNotify !== null)
        {
            eNotify.closeAll();
        }
    
        tallyBoxWindow1State.saveState(tallyBoxWindow1);
        tallyBoxWindow2State.saveState(tallyBoxWindow2);
        tallyBoxWindow3State.saveState(tallyBoxWindow3);
        tallyBoxWindow4State.saveState(tallyBoxWindow4);
        
        closeTallyBoxWindows();
        
        tallyBoxWindow1.close();
        tallyBoxWindow2.close();
        tallyBoxWindow3.close();
        tallyBoxWindow4.close();
        
        stopTSLServer();
    }
    catch(error)
    {
        console.log(error);
    }
    
    app.quit();
}
 
function setUpNotifications() // Sets up Initial Notification Settings
{   
    eNotify = require("electron-notify");
    
    // Change config options
    eNotify.setConfig({
        appIcon: path.join(assetsDirectory, 'icons/png/1024x1024.png'),
        displayTime: 6000
    });
}

function setUpTSLServer_UDP()
{
    let TSLserverPort = store.get("TSLServerPort");
    if (!TSLserverPort)
    {
        TSLserverPort = defaultTSLListenPort;
    }
    
    try
    {
        if (atemDevice !== null)
        {
            atemDevice = null;
        }
            
        umd = new TSLUMD(TSLserverPort);

        umd.on('message', function(tally) {
            processTSLTally(tally);
        });
        
        tsltype_inuse = "UDP";

        notify("TSL 3.1 Server started. Listening for Tally data on UDP Port: " + TSLserverPort, true);
    }
    catch(error)
    {
        notify("TSL 3.1 Server Error occurred: " + error, true);
    }
}

function setUpTSLServer_TCP()
{ 
    let TSLListenPort = store.get("TSLListenPort");
    if (!TSLListenPort)
    {
        TSLListenPort = defaultTSLListenPort;
    }
    
    // Load the TCP Library
    var net = require('net');
    var packet = require('packet');

    var parser = packet.createParser();
    parser.packet('tsl', 'b8{x1, b7 => address},b8{x2, b2 => brightness, b1 => tally4, b1 => tally3, b1 => tally2, b1 => tally1 }, b8[16] => label');

    try
    {
        if (atemDevice !== null)
        {
            atemDevice = null;
        }
        
        // Start a TCP Server
        umd = net.createServer(function (socket) {
          // Handle incoming messages
          socket.on('data', function (data) {
            parser.extract("tsl", function (result) {
                result.label = new Buffer(result.label).toString();
                processTSLTally(result);
            });
            parser.parse(data);
          });

            socket.on('close', function () {
                notify("Connection closed from " + socket.remoteAddress + ":" + socket.remotePort, true);
            });

        }).listen(TSLListenPort);
        
        tsltype_inuse = "UDP";

        notify("TSL 3.1 Server started. Listening for Tally data on TCP Port: " + TSLListenPort, true);
    }
    catch (error)
    {
        notify("TSL 3.1 Server Error occurred: " + error, true);
    }
}

function setUpTSLServer()
{
    console.log("starting up TSL Server");
    let protocol = store.get("TSLProtocol");
    
    if (!protocol)
    {
        protocol = "TCP";
    }
    
    switch(protocol)
    {
        case "TCP":
            setUpTSLServer_TCP();
            break;
        case "UDP":
            setUpTSLServer_UDP();
            break;
        default:
            break;        
    }
}
 
function stopTSLServer()
{
    try
    {       
        switch(tsltype_inuse)
        {
            case "TCP":
                if (umd !== null)
                {
                    umd.close(function () {
                        umd.unref();
                    });
                    umd = null;
                }
                notify("TSL 3.1 TCP Server Stopped.", true);
                break;
            case "UDP":
                if (umd !== null)
                {
                    umd.server.close();
                    umd = null;
                }
                notify("TSL 3.1 UDP Server Stopped.", true);
                break;
            default:
                break;
        }
        
        atemDevice = null;
    }
    catch(error)
    {
        notify("TSL 3.1 Server Error occurred: " + error, true);
    }
}
 
function setUpAtemServer()
{
    let atemIP = store.get("BlackmagicATEMip");
    let atemPort = store.get("BlackmagicATEMport");
    
    stopTSLServer(); // stop the TSL Server, if running
     
    if (!atemPort)
    {
        atemPort = defaultAtemServerPort;
    }

    if (atemIP)
    {
        try
        {
            atemDevice = new BlackmagicATEM();

            atemDevice.ip = atemIP;
            notify("Initiating connection to ATEM: " + atemDevice.ip);
            atemDevice.connect();
            
            notify("Connection made to ATEM @ " + atemIP + ":" + atemPort + ". Listening for Tally data.");

            atemDevice.on('connectionStateChange', function(state) {
                notify("ATEM Status: " + state, true);
            });

            atemDevice.on('connectionLost', function() {
                notify("Connection to ATEM lost!", true);
            });       

            atemDevice.on('inputTally', function(inputNumber, tallyState) {
                notify("ATEM Tally received: " + inputNumber + ": " + tallyState, false);
                console.log("Input #" + inputNumber + ": ");
                console.log(tallyState);
                processAtemTally(inputNumber, tallyState);
            });
        }
        catch(error)
        {
            notify("ATEM Server error: " + error, true);
        }
    }
    else
    {
        notify("Invalid ATEM address.", false);
    }
}

function createAboutWindow() // About Window
{
    if (aboutWindow === null)
    {
        aboutWindow = new BrowserWindow({width: 600, height: 660, show: true, frame: true});
        aboutWindow.loadURL('file://' + path.join(__dirname, 'renderer/about.html'));
        aboutWindow.on('closed', () => { aboutWindow = null; });
    }
    else
    {
        aboutWindow.show();
    }
}

function createSettingsWindow() // Settings Window
{
    if (settingsWindow === null)
    {
        settingsWindow = new BrowserWindow({ width: 800, height: 570, show: true, frame: true});
        settingsWindow.loadURL('file://' + path.join(__dirname, 'renderer/settings.html'));
        //settingsWindow.webContents.openDevTools();
        settingsWindow.on('closed', () => {
        settingsWindow = null;
        });
    }
    else
    {
        settingsWindow.show();
    }
}

function createTallyBoxWindow1() // Tally Box Window 1
{
    if (tallyBoxWindow1 === null)
    {
        tallyBoxWindow1 = new BrowserWindow({x: tallyBoxWindow1State.x, y: tallyBoxWindow1State.y, width: tallyBoxWindow1State.width, height: tallyBoxWindow1State.height, show: true, frame: false, transparent: true});
        tallyBoxWindow1.setAlwaysOnTop(true, "floating", 1);
        tallyBoxWindow1.setHasShadow(false);
        tallyBoxWindow1.setIgnoreMouseEvents(true);
        tallyBoxWindow1.loadURL('file://' + path.join(__dirname, 'renderer/tallybox.html'));
        //tallyBoxWindow1.webContents.openDevTools();
        
        tallyBoxWindow1.once('ready-to-show', () => {
            tallyBoxWindow1.webContents.send('TallyBox-WindowNumber', "1");
            tallyBoxWindow1.webContents.send('TallyBox-Border', store.get("TallyBox1-Border"));
            tallyBoxWindow1.webContents.send('TallyBox-Label', store.get("TallyBox1-Label"));
            tallyBoxWindow1.webContents.send('TallyBox-ShowLabel', store.get("TallyBox1-ShowLabel"));
            tallyBoxWindow1.webContents.send('TallyBox-TransparencyValue', store.get("TallyBox1-TransparencyValue"));
        });
          
        tallyBoxWindow1.on('closed', () => {
            tallyBoxWindow1 = null; 
        });
    }
    else
    {
        tallyBoxWindow1.showInactive();
    }
}

function createTallyBoxWindow2() // Tally Box Window 2
{    
    if (tallyBoxWindow2 === null)
    {
        tallyBoxWindow2 = new BrowserWindow({x: tallyBoxWindow2State.x, y: tallyBoxWindow2State.y, width: tallyBoxWindow2State.width, height: tallyBoxWindow2State.height, show: true, frame: false, transparent: true});
        tallyBoxWindow2.setAlwaysOnTop(true, "floating", 1);
        tallyBoxWindow2.setHasShadow(false);
        tallyBoxWindow2.setIgnoreMouseEvents(true);
        tallyBoxWindow2.loadURL('file://' + path.join(__dirname, 'renderer/tallybox.html'));
        //tallyBoxWindow2.webContents.openDevTools();
        
        tallyBoxWindow2.once('ready-to-show', () => {
            tallyBoxWindow2.webContents.send('TallyBox-WindowNumber', "2");
            tallyBoxWindow2.webContents.send('TallyBox-Border', store.get("TallyBox2-Border"));
            tallyBoxWindow2.webContents.send('TallyBox-Label', store.get("TallyBox2-Label"));
            tallyBoxWindow2.webContents.send('TallyBox-ShowLabel', store.get("TallyBox2-ShowLabel"));
            tallyBoxWindow2.webContents.send('TallyBox-TransparencyValue', store.get("TallyBox2-TransparencyValue"));
        });
          
        tallyBoxWindow2.on('closed', () => {
            tallyBoxWindow2 = null; 
        });
    }
    else
    {
        tallyBoxWindow2.showInactive();
    }
}

function createTallyBoxWindow3() // Tally Box Window 3
{    
    if (tallyBoxWindow3 === null)
    {
        tallyBoxWindow3 = new BrowserWindow({x: tallyBoxWindow3State.x, y: tallyBoxWindow3State.y, width: tallyBoxWindow3State.width, height: tallyBoxWindow3State.height, show: true, frame: false, transparent: true});
        tallyBoxWindow3.setAlwaysOnTop(true, "floating", 1);
        tallyBoxWindow3.setHasShadow(false);
        tallyBoxWindow3.setIgnoreMouseEvents(true);
        tallyBoxWindow3.loadURL('file://' + path.join(__dirname, 'renderer/tallybox.html'));
        //tallyBoxWindow3.webContents.openDevTools();
        
        tallyBoxWindow3.once('ready-to-show', () => {
            tallyBoxWindow3.webContents.send('TallyBox-WindowNumber', "3");
            tallyBoxWindow3.webContents.send('TallyBox-Border', store.get("TallyBox3-Border"));
            tallyBoxWindow3.webContents.send('TallyBox-Label', store.get("TallyBox3-Label"));
            tallyBoxWindow3.webContents.send('TallyBox-ShowLabel', store.get("TallyBox3-ShowLabel"));
            tallyBoxWindow3.webContents.send('TallyBox-TransparencyValue', store.get("TallyBox3-TransparencyValue"));
        });
          
        tallyBoxWindow3.on('closed', () => {
            tallyBoxWindow3 = null; 
        });
    }
    else
    {
        tallyBoxWindow3.showInactive();
    }
}

function createTallyBoxWindow4() // Tally Box Window 4
{    
    if (tallyBoxWindow4 === null)
    {
        tallyBoxWindow4 = new BrowserWindow({x: tallyBoxWindow4State.x, y: tallyBoxWindow4State.y, width: tallyBoxWindow4State.width, height: tallyBoxWindow4State.height, show: false, frame: false, transparent: true});
        tallyBoxWindow4.setAlwaysOnTop(true, "floating", 1);
        tallyBoxWindow4.setHasShadow(false);
        tallyBoxWindow4.setIgnoreMouseEvents(true);
        tallyBoxWindow4.loadURL('file://' + path.join(__dirname, 'renderer/tallybox.html'));
        //tallyBoxWindow4.webContents.openDevTools();
        
        tallyBoxWindow4.once('ready-to-show', () => {
            tallyBoxWindow4.webContents.send('TallyBox-WindowNumber', "4");
            tallyBoxWindow4.webContents.send('TallyBox-Border', store.get("TallyBox4-Border"));
            tallyBoxWindow4.webContents.send('TallyBox-Label', store.get("TallyBox4-Label"));
            tallyBoxWindow4.webContents.send('TallyBox-ShowLabel', store.get("TallyBox4-ShowLabel"));
            tallyBoxWindow4.webContents.send('TallyBox-TransparencyValue', store.get("TallyBox4-TransparencyValue"));
        });
        
        tallyBoxWindow4.on('closed', () => {
            tallyBoxWindow4 = null; 
        });
    }
    else
    {
        tallyBoxWindow4.showInactive();
    }
}

function createTallyBoxWindows(hide) // Create all Tally Box Windows at startup
{
    createTallyBoxWindow1();
    createTallyBoxWindow2();
    createTallyBoxWindow3();
    createTallyBoxWindow4();
    
    if (hide)
    {
        tallyBoxWindow1.hide();
        tallyBoxWindow2.hide();
        tallyBoxWindow3.hide();
        tallyBoxWindow4.hide();
    }
}

function closeTallyBoxWindows() // Close all Tally Box Windows
{
    closeTallyBoxWindow("1");
    closeTallyBoxWindow("2");
    closeTallyBoxWindow("3");
    closeTallyBoxWindow("4");
}

function createTallyBoxWindow(tallyBoxWindowNumber, mode, label)
{    
    switch(tallyBoxWindowNumber)
    {
        case "1":
            tallyBoxWindow1.webContents.send('TallyBox-Mode', mode);
            tallyBoxWindow1.webContents.send('TallyBox-WindowNumber', tallyBoxWindowNumber);
            tallyBoxWindow1.webContents.send('TallyBox-Label', label);
            tallyBoxWindow1.webContents.send('TallyBox-ShowLabel', store.get("TallyBox1-ShowLabel"));
            createTallyBoxWindow1();
            break;
        case "2":
            tallyBoxWindow2.webContents.send('TallyBox-Mode', mode);
            tallyBoxWindow2.webContents.send('TallyBox-WindowNumber', tallyBoxWindowNumber);
            tallyBoxWindow2.webContents.send('TallyBox-Label', label);
            tallyBoxWindow2.webContents.send('TallyBox-ShowLabel', store.get("TallyBox2-ShowLabel"));
            createTallyBoxWindow2();
            break;
        case "3":
            tallyBoxWindow3.webContents.send('TallyBox-Mode', mode);
            tallyBoxWindow3.webContents.send('TallyBox-WindowNumber', tallyBoxWindowNumber);
            tallyBoxWindow3.webContents.send('TallyBox-Label', label);
            tallyBoxWindow3.webContents.send('TallyBox-ShowLabel', store.get("TallyBox3-ShowLabel"));
            createTallyBoxWindow3();
            break;
        case "4":
            tallyBoxWindow4.webContents.send('TallyBox-Mode', mode);
            tallyBoxWindow4.webContents.send('TallyBox-WindowNumber', tallyBoxWindowNumber);
            tallyBoxWindow4.webContents.send('TallyBox-Label', label);
            tallyBoxWindow4.webContents.send('TallyBox-ShowLabel', store.get("TallyBox4-ShowLabel"));
            createTallyBoxWindow4();
            break;
        default:
            break;
    }
}

function closeTallyBoxWindow(tallyBoxWindowNumber)
{    
    switch(tallyBoxWindowNumber)
    {
        case "1":
            if (!tallyBoxWindow1_resizeMode)
            {
                if (tallyBoxWindow1 !== null)
                {
                    tallyBoxWindow1.webContents.send("TallyBox-Mode", "Clear");
                    //tallyBoxWindow1.hide();
                }
            }
            break;
        case "2":  
            if (!tallyBoxWindow2_resizeMode)
            {
                if (tallyBoxWindow2 !== null)
                {
                    tallyBoxWindow2.webContents.send("TallyBox-Mode", "Clear");
                    //tallyBoxWindow2.hide();
                }
            }
            break;
        case "3":     
            if (!tallyBoxWindow3_resizeMode)
            {
                if (tallyBoxWindow3 !== null)
                {
                    tallyBoxWindow3.webContents.send("TallyBox-Mode", "Clear");
                    //tallyBoxWindow3.hide();
                }
            }
            break;
        case "4":     
            if (!tallyBoxWindow4_resizeMode)
            {
                if (tallyBoxWindow4 !== null)
                {
                    tallyBoxWindow4.webContents.send("TallyBox-Mode", "Clear");
                    //tallyBoxWindow4.hide();
                }
            }
            break;
        default:
            break;
    }
}

function hideAllTallyBoxes()
{
    closeTallyBoxWindows();
    tray.setContextMenu(contextMenuShowBoxes);
    hiddenMode = true;
    notify("All Tally Boxes Hidden. Use 'Show All Boxes' in the menu to restore them.", true);
}

function showAllTallyBoxes()
{
    //createTallyBoxWindows(false);
    createTallyBoxWindow("1", tallyBox1_currentState, "");
    createTallyBoxWindow("2", tallyBox2_currentState, "");
    createTallyBoxWindow("3", tallyBox3_currentState, "");
    createTallyBoxWindow("4", tallyBox4_currentState, "");
    
    tray.setContextMenu(contextMenuDefault);
    hiddenMode = false;
    notify("Tally Boxes will now appear. To hide them, choose 'Hide All Boxes' from the menu.", true);
}

function tellTallyBoxWindow(tallyBoxWindowNumber, mode, label)
{
    if (!hiddenMode)
    {
        switch(mode)
        {
            case "Preview":
            case "Program":
            case "PreviewProgram":
                createTallyBoxWindow(tallyBoxWindowNumber, mode, label);
                break;
            case "Clear":
                closeTallyBoxWindow(tallyBoxWindowNumber);
                break;
            default:
                break;
        }
    }
}

function notify(message, display)
{
    if (display)
    {
        if (eNotify !== null)
        {
            eNotify.notify({title: 'ProTally', text: message});
        }
    }
    
    console.log(message);
    
    let notificationObj = {};
    notificationObj.datetime = Date.now();
    notificationObj.message = message;
    notificationArray.push(notificationObj);
    
    if (notificationArray.length > 100) //drop the first item so we only keep a max of 100 items
    {
        notificationArray = notificationArray.slice(1);
    }
    
    if (settingsWindow !== null)
    {
        settingsWindow.webContents.send("NotificationArray", notificationArray);
    }
}

function processAtemTally(inputNumber, tallyState) // Process the data received from the ATEM
{
    //build an object like the TSL module creates so we can use the same function to process it
    let tallyObj = {};
    tallyObj.address = inputNumber;
    tallyObj.brightness = 1;
    tallyObj.tally1 = tallyState.program;
    tallyObj.tally2 = tallyState.preview;
    tallyObj.tally3 = 0;
    tallyObj.tally4 = 0;
    tallyObj.label = "Input " + inputNumber;
    
    processTSLTally(tallyObj);
}

function checkMainTallyValue(tallyObj, addressNumber)
{
    let addressReceived = false;
    let previewMode = false;
    let programMode = false;
    
    let returnObj = {};
    
    if (tallyObj.address.toString() === addressNumber.toString()) // this is the one we care about
    {
        addressReceived = true;
        if (tallyObj.tally2 === 1) // program
        {
            programMode = true;
        }

        if (tallyObj.tally1 === 1) // preview
        {
            previewMode = true;
        }
            
        returnObj.addressReceived = addressReceived;
        returnObj.previewMode = previewMode;
        returnObj.programMode = programMode;
        returnObj.label = tallyObj.label;
    }
    else
    {
        returnObj = null;
    }
    
    return returnObj;
}

function getDeviceSettingsTallyObject(tallyObj)
{
    // returns a TSL-like formatted object based on the data received in the label field, matched to the device settings array
    
        /*
        { address: 19,
        brightness: 3,
        tally4: 0,
        tally3: 0,
        tally2: 0,
        tally1: 0,
        label: '       19       ' }
    */
   
    let address = tallyObj.address.toString(); // the bus address that our address could be assigned to
    let label = tallyObj.label.toString(); // our address will be in this field

    let strAddressToCheck = label.substring(0, label.indexOf(":")); // grab the address in the label field
    let intAddressToCheck = parseInt(strAddressToCheck); //convert it to an int, removes leading zeroes
    let addressToCheck = intAddressToCheck.toString(); // converts back to string for comparison purposes
    
    let returnTallyObj = {};
    returnTallyObj.address = tallyObj.address; //temporary assignment
    returnTallyObj.brightness = tallyObj.brightness;
    returnTallyObj.tally4 = tallyObj.tally4;
    returnTallyObj.tally3 = tallyObj.tally3;
    returnTallyObj.tally2 = tallyObj.tally2; // temporary assignment
    returnTallyObj.tally1 = tallyObj.tally1; // temporary assignment
    returnTallyObj.label = tallyObj.label;
    returnTallyObj.busAddress = tallyObj.address; // the original address the data came in with, in this case, it's the bus that the real address (in the label field) is assigned to
    
    if ((addressToCheck !== "NaN")&&(addressToCheck !== "0")) // if there is an address value in the label field that isn't 0 or 000
    {
        returnTallyObj.address = intAddressToCheck; //assign that address in the label field to our object
        
        // check what the address type is in the array
        // Types are Program (ME1, ME2 PGM, etc.), Preview (ME1 PST, etc.), Aux, etc.
        // this searches a global array defined and is unique for every device type
        let tallyBusObj = tallySettingsArray.find(function (obj) { return obj.address.toString() === address; });
        let busType = null;

        if (tallyBusObj.type)
        {
            busType = tallyBusObj.type;
        }
        
        switch(busType)
        {
            case "Preview":
                returnTallyObj.tally1 = 1; // reassign the tally values based on what was received
                break;
            case "Program":
                returnTallyObj.tally2 = 1;
                break;
            default:
                break;
        }
    }
    else
    {
        returnTallyObj = null;
    }
    
    return returnTallyObj;
}

function checkWatchArrayForAddress(TallyBoxWindowNumber, addressNumber)
{
    let watchArray = [];
    
    switch(TallyBoxWindowNumber)
    {
        case "1":
            watchArray = TallyWatch1;
            break;
        case "2":
            watchArray = TallyWatch2;
            break;
        case "3":
            watchArray = TallyWatch3;
            break;
        case "4":
            watchArray = TallyWatch4;
            break;
        default:
            break;
    }
    
    let found = false;
    
    for (let i = 0; i < watchArray.length; i++)
    {
        if (watchArray[i].address === addressNumber)
        {
            found = true;
            break;
        }
    }
    
    return found;
}

function checkTallySettingValues(deviceTallyObj, addressNumber, TallyBoxWindowNumber)
{
    //first check the watch array to see if this is one we are tracking
    let foundInWatch = false;
    foundInWatch = checkWatchArrayForAddress(TallyBoxWindowNumber, deviceTallyObj.busAddress); //check to see if the bus address is one we are watching
      
    let watchArray = [];
    switch(TallyBoxWindowNumber)
    {
        case "1":
            watchArray = TallyWatch1;
            break;
        case "2":
            watchArray = TallyWatch2;
            break;
        case "3":
            watchArray = TallyWatch3;
            break;
        case "4":
            watchArray = TallyWatch4;
            break;
        default:
            break;
    }
        
    let address = deviceTallyObj.address; // the
    
    let addressReceived = false;
    
    let previewMode = false;
    let programMode = false;

    if (foundInWatch)
    {
        if (address.toString() !== addressNumber.toString())
        {
            //remove it from the watch array, it's no longer valid there
            let index = watchArray.findIndex(w => w.address.toString() === deviceTallyObj.busAddress.toString());
            if (index !== -1)
            {
                watchArray.splice(index, 1);
            }
        }
    }
    else
    {
        if (address.toString() === addressNumber.toString())
        {
            addressReceived = true;
            
            let tallySettingsObj = tallySettingsArray.find(function (obj) { return obj.address.toString() === deviceTallyObj.busAddress.toString(); });

            let busType = null;
            let busName = null;

            if (tallySettingsObj)
            {
                if (tallySettingsObj.type)
                {
                    busType = tallySettingsObj.type;
                }

                busName = tallySettingsObj.label;
            }

            
            //new watch entry
            let watchObj = {};
            watchObj.address = deviceTallyObj.busAddress;
            watchObj.busType = busType;
            watchObj.busName = busName;
            watchObj.timestamp = Date.now();
            watchArray.push(watchObj);
        }
    }

        for (let i = 0; i < watchArray.length; i++)
        {
            switch(watchArray[i].busType)
            {
                case "Preview":
                    previewMode = true;
                    break;
                case "Program":
                    programMode = true;
                    break;
                default:
                    break;
            }
        }
    //}
    
    switch(TallyBoxWindowNumber) // assigns the temporrary watchArray object array back to the global array
    {
        case "1":
            TallyWatch1 = JSON.parse(JSON.stringify(watchArray));
            break;
        case "2":
            TallyWatch2 = JSON.parse(JSON.stringify(watchArray));
            break;
        case "3":
            TallyWatch3 = JSON.parse(JSON.stringify(watchArray));
            break;
        case "4":
            TallyWatch4 = JSON.parse(JSON.stringify(watchArray));
            break;
        default:
            break;
    }
    
    let returnObj = {};
        returnObj.previewMode = previewMode;
        returnObj.programMode = programMode;
        console.log("*** return object ***");
        console.log(returnObj);
        console.log("********");

    return returnObj;
}

function processTSLTally(jsonTally) // Process the TSL Data
{    
    /*
        { address: 19,
        brightness: 3,
        tally4: 0,
        tally3: 0,
        tally2: 0,
        tally1: 0,
        label: '       19       ' }
    */
     
    let address1 = store.get("TallyBox1-Address");
    let address2 = store.get("TallyBox2-Address");
    let address3 = store.get("TallyBox3-Address");
    let address4 = store.get("TallyBox4-Address");
    
    if (!address1)
    {
        address1 = "0";
    }
    
    if (!address2)
    {
        address2 = "0";
    }
    
    if (!address3)
    {
        address3 = "0";
    }
    
    if (!address4)
    {
        address4 = "0";
    }
        
    let bus = "";
    
    //notify("***** RAW DATA *******", false);
    //notify(JSON.stringify(jsonTally), false);
    //notify("***** END RAW DATA *******", false);
     
    if ((address1!=="")&&(address1!=="0"))
    {
        let address_received = false;
        let mode_Preview = false;
        let mode_Program = false;
        let labelText = "";
    
        let obj = checkMainTallyValue(jsonTally, address1);
        if (obj !== null)
        {
            if (obj.addressReceived === true)
            {
                console.log("*** Received Address 1 ***");
                console.log(jsonTally);
                mode_Preview = obj.previewMode;
                mode_Program = obj.programMode;
                labelText = obj.label;
                address_received = true;
                //notify("Tally Box 1 address received.", true);
            }
        }
        /*else if (useTallySettingsArray)
        {
            let deviceTallyObj = getDeviceSettingsTallyObject(jsonTally);            
            if (deviceTallyObj !== null) //if null, then there was not an address present in the label field, or it was 0/000
            {
                //console.log(deviceTallyObj);
                            
                //check tally settings array if Ross or Acuity
                let returnObj = checkTallySettingValues(deviceTallyObj, address1, "1");
                if (returnObj !== null)
                {
                    mode_Preview = returnObj.previewMode;
                    mode_Program = returnObj.programMode;
                    //address_received = true;
                    if ((mode_Preview) || (mode_Program))
                    {
                        address_received = true;
                    }
                    //notify("Tally Box 1 address received in the label field.", true);
                }
            }
        }*/

        if (address_received)
        {
            let mode = GetModeName(mode_Preview, mode_Program);
            if(tallyBox1_currentState !== mode)
            {
                tellTallyBoxWindow("1", mode, labelText);
                store.set("TallyBox1-Label", labelText);
                tallyBox1_currentState = mode;
                notify("Tally Box 1 set to " + mode, false);
            }
        }
    }
    
   if ((address2!=="")&&(address2!=="0"))
    {
        let address_received = false;
        let mode_Preview = false;
        let mode_Program = false;
        let labelText = "";
    
        let obj = checkMainTallyValue(jsonTally, address2);
        if (obj !== null)
        {
            if (obj.addressReceived === true)
            {
                console.log("*** Received Address 2 ***");
                console.log(jsonTally);
                mode_Preview = obj.previewMode;
                mode_Program = obj.programMode;
                labelText = obj.label;
                address_received = true;
            }
        }

        if (address_received)
        {
            let mode = GetModeName(mode_Preview, mode_Program);
            if(tallyBox2_currentState !== mode)
            {
                tellTallyBoxWindow("2", mode, labelText);
                store.set("TallyBox2-Label", labelText);
                tallyBox2_currentState = mode;
                notify("Tally Box 2 set to " + mode, false);
            }
        }
    }
    
   if ((address3!=="")&&(address3!=="0"))
    {
        let address_received = false;
        let mode_Preview = false;
        let mode_Program = false;
        let labelText = "";
    
        let obj = checkMainTallyValue(jsonTally, address3);
        if (obj !== null)
        {
            if (obj.addressReceived === true)
            {
                console.log("*** Received Address 3 ***");
                console.log(jsonTally);
                mode_Preview = obj.previewMode;
                mode_Program = obj.programMode;
                labelText = obj.label;
                address_received = true;
            }
        }

        if (address_received)
        {
            let mode = GetModeName(mode_Preview, mode_Program);
            if(tallyBox3_currentState !== mode)
            {
                tellTallyBoxWindow("3", mode, labelText);
                store.set("TallyBox3-Label", labelText);
                tallyBox3_currentState = mode;
                notify("Tally Box 3 set to " + mode, false);
            }
        }
    }
    
   if ((address4!=="")&&(address4!=="0"))
    {
        let address_received = false;
        let mode_Preview = false;
        let mode_Program = false;
        let labelText = "";
    
        let obj = checkMainTallyValue(jsonTally, address4);
        if (obj !== null)
        {
            if (obj.addressReceived === true)
            {
                console.log("*** Received Address 4 ***");
                console.log(jsonTally);
                mode_Preview = obj.previewMode;
                mode_Program = obj.programMode;
                labelText = obj.label;
                address_received = true;
            }
        }

        if (address_received)
        {
            let mode = GetModeName(mode_Preview, mode_Program);
            if(tallyBox4_currentState !== mode)
            {
                tellTallyBoxWindow("4", mode, labelText);
                store.set("TallyBox4-Label", labelText);
                tallyBox4_currentState = mode;
                notify("Tally Box 4 set to " + mode, false);
            }
        }
    }
    
    AddTallyToArray(jsonTally);
    //notify(JSON.stringify(jsonTally), false);
    
    if (settingsWindow !== null)
    {
        settingsWindow.webContents.send("TallyArray", TallyArray);
    }
 }
 
function GetModeName(preview, program)
{
    let mode = "";
    
    if ((preview)&&(program))
    {
        mode = "PreviewProgram";
    }
    else if (program)
    {
        mode = "Program";
    }
    else if (preview)
    {
        mode = "Preview";
    }
    else
    {
        mode = "Clear";
    }
    
    return mode;
}
 
function AddTallyToArray(jsonTally)
{     
    let foundInArray = false;
    
    for (let i = 0; i < TallyArray.length; i++)
    {
        if (TallyArray[i].address === jsonTally.address)
        {
            //update in place
            TallyArray[i].label = jsonTally.label;
            TallyArray[i].tally1 = jsonTally.tally1;
            TallyArray[i].tally2 = jsonTally.tally2;
            TallyArray[i].tally3 = jsonTally.tally3;
            TallyArray[i].tally4 = jsonTally.tally4;
            TallyArray[i].brightness = jsonTally.brightness;
            foundInArray = true;
            break;
        }
    }
    
    if (!foundInArray)
    {
        TallyArray.push(jsonTally);
    }
}

//SETTIINGS IPCs
ipc.on("Notify", function (event, message, display) {
    notify(message, display);
});

ipc.on("LoadStore-Addresses", function (event) {
   event.sender.send("TallyBox-Address", "1", store.get('TallyBox1-Address'));
   event.sender.send("TallyBox-Address", "2", store.get('TallyBox2-Address'));
   event.sender.send("TallyBox-Address", "3", store.get('TallyBox3-Address'));
   event.sender.send("TallyBox-Address", "4", store.get('TallyBox4-Address'));
});

ipc.on("LoadStore-Borders", function (event) {
   event.sender.send("TallyBox-Border", "1", store.get('TallyBox1-Border'));
   event.sender.send("TallyBox-Border", "2", store.get('TallyBox2-Border'));
   event.sender.send("TallyBox-Border", "3", store.get('TallyBox3-Border'));
   event.sender.send("TallyBox-Border", "4", store.get('TallyBox4-Border'));
});

ipc.on("LoadStore-ShowLabels", function (event) {
   event.sender.send("TallyBox-ShowLabel", "1", store.get('TallyBox1-ShowLabel'));
   event.sender.send("TallyBox-ShowLabel", "2", store.get('TallyBox2-ShowLabel'));
   event.sender.send("TallyBox-ShowLabel", "3", store.get('TallyBox3-ShowLabel'));
   event.sender.send("TallyBox-ShowLabel", "4", store.get('TallyBox4-ShowLabel'));
});

ipc.on("LoadStore-Colors", function (event) {
   event.sender.send("TallyBox-Color", "Preview", store.get('TallyBox-Color-Preview'));
   event.sender.send("TallyBox-Color", "Program", store.get('TallyBox-Color-Program'));
   event.sender.send("TallyBox-Color", "PreviewProgram", store.get('TallyBox-Color-PreviewProgram'));
});

ipc.on("LoadStore-ResizeModes", function (event) {
   event.sender.send("TallyBox-ResizeMode", "1", tallyBoxWindow1_resizeMode);
   event.sender.send("TallyBox-ResizeMode", "2", tallyBoxWindow2_resizeMode);
   event.sender.send("TallyBox-ResizeMode", "3", tallyBoxWindow3_resizeMode);
   event.sender.send("TallyBox-ResizeMode", "4", tallyBoxWindow4_resizeMode);
});

ipc.on("LoadStore-DeviceInUse", function (event) {
   event.sender.send("DeviceInUse", store.get("DeviceInUse")); 
});

ipc.on("LoadStore-TSLinfo", function (event) {
   event.sender.send("TSLinfo", store.get("TSLListenPort"), defaultTSLListenPort, store.get("TSLProtocol"));
});

ipc.on("LoadStore-BlackmagicATEMinfo", function (event) {
   event.sender.send("BlackmagicATEMinfo", store.get("BlackmagicATEMip"), store.get("BlackmagicATEMport"), defaultAtemServerPort);
});

ipc.on("LoadStore-NotificationArray", function (event) {
   event.sender.send("NotificationArray", notificationArray); 
});

ipc.on("LoadStore-TransparencyValues", function (event) {
   event.sender.send("TallyBox-Transparency", "1", store.get("TallyBox1-TransparencyValue"));
   event.sender.send("TallyBox-Transparency", "2", store.get("TallyBox2-TransparencyValue"));
   event.sender.send("TallyBox-Transparency", "3", store.get("TallyBox3-TransparencyValue"));
   event.sender.send("TallyBox-Transparency", "4", store.get("TallyBox4-TransparencyValue"));
});

ipc.on("UpdateStore-TallyBoxTransparency", function (event, tallyBoxWindowNumber, transparencyValue) {
    switch(tallyBoxWindowNumber)
    {
        case "1":
            tallyBoxWindow1.webContents.send("TallyBox-TransparencyValue", transparencyValue);
            store.set("TallyBox1-TransparencyValue", transparencyValue);
            break;
        case "2":
            tallyBoxWindow2.webContents.send("TallyBox-TransparencyValue", transparencyValue);
            store.set("TallyBox2-TransparencyValue", transparencyValue);
            break;
        case "3":
            tallyBoxWindow3.webContents.send("TallyBox-TransparencyValue", transparencyValue);
            store.set("TallyBox3-TransparencyValue", transparencyValue);
            break;
        case "4":
            tallyBoxWindow4.webContents.send("TallyBox-TransparencyValue", transparencyValue);
            store.set("TallyBox4-TransparencyValue", transparencyValue);
            break;
        default:
            break;
    }
});

ipc.on("UpdateStore-TallyBoxAddress", function (event, addressNumber, addressValue) {
    if (store.get("TallyBox" + addressNumber + "-Address") !== addressValue)
    {
        closeTallyBoxWindow(addressNumber);
    }
    store.set("TallyBox" + addressNumber + "-Address", addressValue);
    
    switch(addressNumber)
    {
        case "1":
            TallyWatch1 = {};
            break;
        case "2":
            TallyWatch2 = {};
            break;
        case "3":
            TallyWatch3 = {};
            break;
        case "4":
            TallyWatch4 = {};
            break;
        default:
            break;
    }
   
    let hideTallyBoxWindow = false;
   
    if (addressValue.toString() === "0")
    {
       hideTallyBoxWindow = true;
       notify("Tally Box " + addressNumber + " Address set to 0. Box will not be visible.", false);
    }
    else
    {
        notify("Tally Box " + addressNumber + " Address set to: " + addressValue, false);
    }
   
    if (hideTallyBoxWindow)
    {
        closeTallyBoxWindow(addressNumber);
    }
});

ipc.on("UpdateStore-Color", function (event, mode, color) {
    let oldColor = "";
    switch(mode)
    {
        case "Preview":
            oldColor = store.get("TallyBox-Color-Preview")
            store.set("TallyBox-Color-Preview", color);
            tallyBoxWindow1.webContents.send("TallyBox-Color", "Preview", color);
            tallyBoxWindow2.webContents.send("TallyBox-Color", "Preview", color);
            tallyBoxWindow3.webContents.send("TallyBox-Color", "Preview", color);
            tallyBoxWindow4.webContents.send("TallyBox-Color", "Preview", color);
            if (color !== oldColor)
            {
                notify("Preview Color set to: " + color, false);
            }
            break;
        case "Program":
            oldColor = store.get("TallyBox-Color-Program");
            store.set("TallyBox-Color-Program", color);
            tallyBoxWindow1.webContents.send("TallyBox-Color", "Program", color);
            tallyBoxWindow2.webContents.send("TallyBox-Color", "Program", color);
            tallyBoxWindow3.webContents.send("TallyBox-Color", "Program", color);
            tallyBoxWindow4.webContents.send("TallyBox-Color", "Program", color);
            if (color !== oldColor)
            {
                notify("Program Color set to: " + color, false);
            }
            break;
        case "PreviewProgram":
            oldColor = store.get("TallyBox-Color-PreviewProgram");
            store.set("TallyBox-Color-PreviewProgram", color);
            tallyBoxWindow1.webContents.send("TallyBox-Color", "PreviewProgram", color);
            tallyBoxWindow2.webContents.send("TallyBox-Color", "PreviewProgram", color);
            tallyBoxWindow3.webContents.send("TallyBox-Color", "PreviewProgram", color);
            tallyBoxWindow4.webContents.send("TallyBox-Color", "PreviewProgram", color);
            if (color !== oldColor)
            {
                notify("Preview+Program Color set to: " + color, false);
            }
            break;
        default:
            break;
    }    
});

ipc.on("UpdateStore-Border", function (event, tallyBoxWindowNumber, borderValue) {
    //if true, show border, if false, show box
    store.set("TallyBox" + tallyBoxWindowNumber + "-Border", borderValue);
    
    switch(tallyBoxWindowNumber)
    {
        case "1":
            tallyBoxWindow1.webContents.send('TallyBox-Border', borderValue);
            break;
        case "2":
            tallyBoxWindow2.webContents.send('TallyBox-Border', borderValue);
            break;
        case "3":
            tallyBoxWindow3.webContents.send('TallyBox-Border', borderValue);
            break;
        case "4":
            tallyBoxWindow4.webContents.send('TallyBox-Border', borderValue);
            break;
        default:
            break;
    }
});

ipc.on("UpdateStore-ShowLabel", function (event, tallyBoxWindowNumber, showLabelValue) {
    //if true, show border, if false, show box
    store.set("TallyBox" + tallyBoxWindowNumber + "-ShowLabel", showLabelValue);
    
    switch(tallyBoxWindowNumber)
    {
        case "1":
            tallyBoxWindow1.webContents.send('TallyBox-ShowLabel', showLabelValue);
            break;
        case "2":
            tallyBoxWindow2.webContents.send('TallyBox-ShowLabel', showLabelValue);
            break;
        case "3":
            tallyBoxWindow3.webContents.send('TallyBox-ShowLabel', showLabelValue);
            break;
        case "4":
            tallyBoxWindow4.webContents.send('TallyBox-ShowLabel', showLabelValue);
            break;
        default:
            break;
    }
});

ipc.on("UpdateStore-DeviceInUse", function (event, deviceInUse) {
   store.set("DeviceInUse", deviceInUse);
   setUpDevice(deviceInUse);
});

ipc.on("UpdateStore-TSLSettings", function (event, TSLListenPort, TSLProtocol) {
   store.set("TSLListenPort", TSLListenPort);
   store.set("TSLProtocol", TSLProtocol);
});

ipc.on("UpdateStore-BlackmagicATEMinfo", function (event, ATEMip, ATEMport) {
   store.set("BlackmagicATEMip", ATEMip);
   store.set("BlackmagicATEMport", ATEMport);
   setUpAtemServer();
});

ipc.on("ShowResizer", function (event, tallyBoxWindowNumber) {
    switch(tallyBoxWindowNumber)
    {
        case "1":
            tallyBoxWindow1.webContents.send('TallyBox-Resize');
            createTallyBoxWindow1();
            tallyBoxWindow1.setIgnoreMouseEvents(false);
            tallyBoxWindow1_resizeMode = true;
            break;
        case "2":
            tallyBoxWindow2.webContents.send('TallyBox-Resize');
            createTallyBoxWindow2();
            tallyBoxWindow2.setIgnoreMouseEvents(false);
            tallyBoxWindow2_resizeMode = true;
            break;
        case "3":
            tallyBoxWindow3.webContents.send('TallyBox-Resize');
            createTallyBoxWindow3();
            tallyBoxWindow3.setIgnoreMouseEvents(false);
            tallyBoxWindow3_resizeMode = true;
            break;
        case "4":
            tallyBoxWindow4.webContents.send('TallyBox-Resize');
            createTallyBoxWindow4();
            tallyBoxWindow4.setIgnoreMouseEvents(false);
            tallyBoxWindow4_resizeMode = true;
            break;
        default:
            break;
    }
    
    if (settingsWindow !== null)
    {
        settingsWindow.webContents.send("TallyBox-ResizeMode", tallyBoxWindowNumber, true);
    };
});

//TALLYBOX IPCs
ipc.on("SaveWindowPosition", function (event, tallyBoxWindowNumber) {
    switch(tallyBoxWindowNumber)
    {
        case "1":
            if ((tallyBox1_currentState === "Clear") || (tallyBox1_currentState === ""))
            {
                tallyBoxWindow1.hide();                
            }
            tallyBoxWindow1.setIgnoreMouseEvents(true);
            tallyBoxWindow1_resizeMode = false;
            tallyBoxWindow1.webContents.send("TallyBox-HideResize");
            break;
        case "2":
            if ((tallyBox2_currentState === "Clear") || (tallyBox2_currentState === ""))
            {
                tallyBoxWindow2.hide();                
            }
            tallyBoxWindow2.setIgnoreMouseEvents(true);
            tallyBoxWindow2_resizeMode = false;
            tallyBoxWindow2.webContents.send("TallyBox-HideResize");
            break;
        case "3":
            if ((tallyBox3_currentState === "Clear") || (tallyBox3_currentState === ""))
            {
                tallyBoxWindow3.hide();                
            }
            tallyBoxWindow3.setIgnoreMouseEvents(true);
            tallyBoxWindow3_resizeMode = false;
            tallyBoxWindow3.webContents.send("TallyBox-HideResize");
            break;
        case "4":
            if ((tallyBox4_currentState === "Clear") || (tallyBox4_currentState === ""))
            {
                tallyBoxWindow4.hide();                
            }
            tallyBoxWindow4.setIgnoreMouseEvents(true);
            tallyBoxWindow4_resizeMode = false;
            tallyBoxWindow4.webContents.send("TallyBox-HideResize");
            break;
        default:
            break;
    }
    
    if (settingsWindow !== null)
    {
        settingsWindow.webContents.send("TallyBox-ResizeMode", tallyBoxWindowNumber, false);
    };
    
    notify("Window position saved for Tally Box " + tallyBoxWindowNumber + ".", true);
});

//ABOUT IPCs
ipc.on("OpenSettingsWindow", function (event) {
   createSettingsWindow(); 
});

ipc.on("LoadIPSettings", function (event) {    
    let ipAddresses = [];
            
    function GetIPAddressSettings()
    {
        let ifaces = os.networkInterfaces();

        Object.keys(ifaces).forEach(function (ifname) {
          let ipAddressObj = {};
          let alias = 0;

          ifaces[ifname].forEach(function (iface){
            if ('IPv4' !== iface.family || iface.internal !== false) {
              // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
              return;
            }

            if (alias >= 1) {
              // this single interface has multiple ipv4 addresses
              ipAddressObj.name = ifname + ":" + alias;
              ipAddressObj.address = iface.address;
            } else {
              // this interface has only one ipv4 adress
              ipAddressObj.name = ifname;
              ipAddressObj.address = iface.address;
            }

            ipAddresses.push(ipAddressObj);

            ++alias;
          });
        });
    }
    
    GetIPAddressSettings();
    
    let TSLListenPort = store.get("TSLListenPort");
    if (!TSLListenPort)
    {
        TSLListenPort = defaultTSLListenPort;
    }
    
     event.sender.send("IPSettings", ipAddresses, TSLListenPort);     
});