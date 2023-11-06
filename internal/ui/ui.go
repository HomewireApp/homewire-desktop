package ui

import (
	_ "embed"

	webview "github.com/webview/webview_go"
)

//go:embed ui.html
var HTML string

type UI struct {
	view webview.WebView
}

func New() *UI {
	w := webview.New(true)

	w.SetTitle("Homewire")
	w.SetSize(400, 600, webview.HintFixed)

	w.SetHtml(HTML)

	return &UI{
		view: w,
	}
}

func (ui *UI) Run() {
	ui.view.Run()
}

func (ui *UI) Destroy() {
	if ui.view != nil {
		ui.view.Destroy()
	}
}
