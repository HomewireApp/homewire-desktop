package app

import (
	"context"
	"fmt"

	"github.com/HomewireApp/homewire"
	"github.com/HomewireApp/homewire-ui/internal/logger"
	"github.com/HomewireApp/homewire/wire"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
	hw  *homewire.Homewire
}

func New(ctx context.Context, hw *homewire.Homewire) *App {
	return &App{
		hw:  hw,
		ctx: ctx,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) CreateNewWire(name string) (*wire.Wire, error) {
	return a.hw.CreateNewWire(name)
}

func (a *App) ListWires() []wire.Wire {
	result := a.hw.ListWires()
	logger.Info("%v", result)
	SortWireList(result)
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
