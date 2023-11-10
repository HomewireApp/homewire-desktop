package main

import (
	"context"
	"embed"

	"github.com/HomewireApp/homewire"
	"github.com/HomewireApp/homewire-desktop/internal/app"
	"github.com/HomewireApp/homewire/logger"
	homewire_options "github.com/HomewireApp/homewire/options"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	hwOpts, err := homewire_options.Default()
	if err != nil {
		panic(err)
	}

	hwLogger := logger.DefaultConsoleConfig().WithLevel(logger.LevelDebug).CreateLogger("homewire")
	appLogger := logger.DefaultConsoleConfig().WithLevel(logger.LevelInfo).CreateLogger("homewire-desktop")

	hw, err := homewire.InitWithOptions(*hwOpts.WithLogger(hwLogger))
	if err != nil {
		panic(err)
	}

	// Create an instance of the a structure
	a := app.New(context.Background(), hw, appLogger)

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "Homewire",
		Width:  400,
		Height: 600,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        a.Startup,
		OnShutdown: func(_ context.Context) {
			// TODO enable this line?
			// wm.Destroy()
		},
		Bind: []interface{}{
			a,
			&app.WireInfo{},
		},
		Menu:   a.ApplicationMenu(),
		Logger: app.NewLogBridge(appLogger),
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
