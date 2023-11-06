package app

import (
	"sort"

	"github.com/HomewireApp/homewire/wire"
)

type WireInfoSorter []wire.Wire

func (s WireInfoSorter) Len() int {
	return len(s)
}

func (s WireInfoSorter) Less(i, j int) bool {
	return s[i].JoinStatus < s[j].JoinStatus &&
		s[i].Name < s[j].Name
}

func (s WireInfoSorter) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}

// Sorts a list of wires. Mutates the original array
func SortWireList(wires []wire.Wire) {
	sort.Sort(WireInfoSorter(wires))
}
