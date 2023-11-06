package app

import "github.com/HomewireApp/homewire/wire"

type WireInfo struct {
	Id               string                `json:"id"`
	Name             string                `json:"name"`
	JoinStatus       wire.JoinStatus       `json:"joinStatus"`
	ConnectionStatus wire.ConnectionStatus `json:"connectionStatus"`
}
