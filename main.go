package main

import (
	"context"
	"embed"

	"github.com/HomewireApp/homewire"
	"github.com/HomewireApp/homewire-ui/internal/app"
	"github.com/HomewireApp/homewire-ui/internal/logger"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	logger.Init()

	hw, err := homewire.Open(nil)
	if err != nil {
		panic(err)
	}

	// Create an instance of the a structure
	a := app.New(context.Background(), hw)

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
		Logger: logger.NewBridge(),
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
