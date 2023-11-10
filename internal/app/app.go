package app

import (
	"context"
	"fmt"
	"sync"

	"github.com/HomewireApp/homewire"
	"github.com/HomewireApp/homewire/logger"
	"github.com/HomewireApp/homewire/wire"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx    context.Context
	hw     *homewire.Homewire
	logger logger.Logger

	wires    map[string]*wire.Wire
	mutWires *sync.RWMutex
}

func (a *App) storeWireInfo(w *wire.Wire) *WireInfo {
	if a.wires[w.Id] != nil {
		return nil
	}

	id := w.Id

	w.OnConnectionStatusChanged(func(new, old wire.ConnectionStatus) {
		a.mutWires.RLock()
		defer a.mutWires.RUnlock()

		if wire := a.wires[id]; wire != nil {
			runtime.EventsEmit(a.ctx, "wire:changed", *InfoForWire(wire))
		}
	})

	w.OnJoinStatusChanged(func(new, old wire.JoinStatus) {
		a.mutWires.RLock()
		defer a.mutWires.RUnlock()

		if wire := a.wires[id]; wire != nil {
			runtime.EventsEmit(a.ctx, "wire:changed", *InfoForWire(wire))
		}
	})

	a.wires[w.Id] = w
	info := InfoForWire(w)
	runtime.EventsEmit(a.ctx, "wire:discovered", info)
	return info
}

func New(ctx context.Context, hw *homewire.Homewire, logger logger.Logger) *App {
	return &App{
		hw:     hw,
		ctx:    ctx,
		logger: logger,

		wires:    make(map[string]*wire.Wire),
		mutWires: &sync.RWMutex{},
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx

	a.mutWires.Lock()
	defer a.mutWires.Unlock()

	for _, w := range a.hw.ListWires() {
		a.storeWireInfo(w)
	}

	a.hw.OnWireFound(func(w *wire.Wire) {
		a.logger.Debug("WIRE FOUND %v", w.Id)
		a.mutWires.Lock()
		defer a.mutWires.Unlock()

		a.storeWireInfo(w)
	})
}

func (a *App) CreateNewWire(name string) (*WireInfo, error) {
	w, err := a.hw.CreateNewWire(name)
	if err != nil {
		return nil, err
	}
	return InfoForWire(w), nil
}

func (a *App) ListWires() []WireInfo {
	a.mutWires.RLock()
	defer a.mutWires.RUnlock()

	result := make([]WireInfo, 0)

	for _, w := range a.wires {
		result = append(result, *InfoForWire(w))
	}

	return result
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) ApplicationMenu() *menu.Menu {
	m := menu.NewMenu()

	appMenu := menu.AppMenu()
	m.Append(appMenu)

	fileMenu := m.AddSubmenu("File")
	fileMenu.AddText("Quit", keys.CmdOrCtrl("q"), func(cd *menu.CallbackData) {
		runtime.Quit(a.ctx)
	})

	editMenu := menu.EditMenu()
	m.Append(editMenu)

	return m
}
