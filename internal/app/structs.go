package app

import (
	"time"

	"github.com/HomewireApp/homewire/wire"
)

type WireInfo struct {
	Id               string                `json:"id"`
	Name             string                `json:"name"`
	JoinStatus       wire.JoinStatus       `json:"joinStatus"`
	ConnectionStatus wire.ConnectionStatus `json:"connectionStatus"`
	Providers        int                   `json:"providers"`
}

type Otp struct {
	Code      string    `json:"code"`
	Ttl       uint64    `json:"ttl"`
	ExpiresAt time.Time `json:"expiresAt"`
}

func InfoForWire(w *wire.Wire) *WireInfo {
	return &WireInfo{
		Id:               w.Id,
		Name:             w.Name,
		JoinStatus:       w.JoinStatus,
		ConnectionStatus: w.ConnectionStatus,
		Providers:        len(w.KnownProviderPeers),
	}
}
