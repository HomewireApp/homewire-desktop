package app

import (
	"sort"
)

type WireInfoSorter []WireInfo

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
func SortWireList(wires []WireInfo) {
	sort.Sort(WireInfoSorter(wires))
}
