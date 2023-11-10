package app

import "github.com/HomewireApp/homewire/logger"

type WailsLogBridge struct {
	l logger.Logger
}

func NewLogBridge(l logger.Logger) *WailsLogBridge {
	return &WailsLogBridge{l: l}
}

func (wl *WailsLogBridge) Print(message string) {
	wl.l.Trace(message)
}

func (wl *WailsLogBridge) Trace(message string) {
	wl.l.Trace(message)
}

func (wl *WailsLogBridge) Debug(message string) {
	wl.l.Debug(message)
}

func (wl *WailsLogBridge) Info(message string) {
	wl.l.Info(message)
}

func (wl *WailsLogBridge) Warning(message string) {
	wl.l.Warn(message)
}

func (wl *WailsLogBridge) Error(message string) {
	wl.l.Error(message)
}

func (wl *WailsLogBridge) Fatal(message string) {
	wl.l.Fatal(message)
}
