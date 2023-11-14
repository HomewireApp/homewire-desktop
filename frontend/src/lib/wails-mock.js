function noop() {}

const mockWires = [
  {
    id: 'foo',
    name: 'Foo',
    joinStatus: 'joined',
    connectionStatus: 'connected',
  },
  {
    id: 'bar',
    name: 'bar',
    joinStatus: 'joined',
    connectionStatus: 'connected',
  },
  {
    id: 'baz',
    name: 'Baz',
    joinStatus: 'not-joined',
    connectionStatus: 'not-connected',
  },
];

window['go'] = window['go'] || {
  app: {
    App: {
      ApplicationMenu: noop,
      Greet: console.log.bind(console),
      CreateNewWire: wire => {
        mockWires.push(wire);
        return wire;
      },
      ListWires: async () => {
        return mockWires;
      },
    },
  },
};

window['runtime'] = window['runtime'] || {
  LogPrint: console.log.bind(console),
  LogTrace: console.log.bind(console),
  LogDebug: console.log.bind(console),
  LogInfo: console.info.bind(console),
  LogWarning: console.warn.bind(console),
  LogError: console.error.bind(console),
  LogFatal: console.error.bind(console),
  EventsOnMultiple: noop,
  EventsOff: noop,
  EventsEmit: noop,
  WindowReload: noop,
  WindowReloadApp: noop,
  WindowSetAlwaysOnTop: noop,
  WindowSetSystemDefaultTheme: noop,
  WindowSetLightTheme: noop,
  WindowSetDarkTheme: noop,
  WindowCenter: noop,
  WindowSetTitle: noop,
  WindowFullscreen: noop,
  WindowUnfullscreen: noop,
  WindowIsFullscreen: noop,
  WindowGetSize: noop,
  WindowSetSize: noop,
  WindowSetMaxSize: noop,
  WindowSetMinSize: noop,
  WindowSetPosition: noop,
  WindowGetPosition: noop,
  WindowHide: noop,
  WindowShow: noop,
  WindowMaximise: noop,
  WindowToggleMaximise: noop,
  WindowUnmaximise: noop,
  WindowIsMaximised: noop,
  WindowMinimise: noop,
  WindowUnminimise: noop,
  WindowSetBackgroundColour: noop,
  ScreenGetAll: noop,
  WindowIsMinimised: noop,
  WindowIsNormal: noop,
  BrowserOpenURL: noop,
  Environment: noop,
  Quit: noop,
  Hide: noop,
  Show: noop,
  ClipboardGetText: noop,
  ClipboardSetText: noop,
};
