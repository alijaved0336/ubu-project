//
//  DraggableForeach.swift
//  UBU
//
//  Created by Irtaza Fiaz on 24/12/2024.
//

import UniformTypeIdentifiers
import SwiftUI

public struct DraggableForeach<Data, Content>: View where Data: Hashable, Content: View {
    @Binding var data: [Data]
    
    private let content: (Data, Bool) -> Content
    
    @State private var draggedItem: Data?
    @State private var hasChangedLocation: Bool = false
    
    public init(_ data: Binding<[Data]>,
                @ViewBuilder content: @escaping (Data, Bool) -> Content) {
        _data = data
        self.content = content
    }
    
    public var body: some View {
        ForEach(data, id: \.self) { item in
            content(item, hasChangedLocation && draggedItem == item)
                .onDrag {
                    draggedItem = item
                    return NSItemProvider(object: "\(item.hashValue)" as NSString)
                }
                .onDrop(of: [UTType.plainText], delegate: DraggableDropDelegate(
                    item: item,
                    data: $data,
                    draggedItem: $draggedItem,
                    hasChangedLocation: $hasChangedLocation
                ))
        }
    }
    
    struct DraggableDropDelegate<Item>: DropDelegate where Item: Equatable {
        let item: Item
        @Binding var data: [Item]
        @Binding var draggedItem: Item?
        @Binding var hasChangedLocation: Bool
        
        func dropEntered(info: DropInfo) {
            guard item != draggedItem,
                  let current = draggedItem,
                  let from = data.firstIndex(of: current),
                  let to = data.firstIndex(of: item)
            else {
                return
            }
            hasChangedLocation = true
            if data[to] != current {
                withAnimation {
                    data.move(fromOffsets: IndexSet(integer: from), toOffset: (to > from) ? to + 1 :to)
                }
            }
        }
        
        func dropUpdated(info: DropInfo) -> DropProposal? {
            DropProposal(operation: .move)
        }
        
        func performDrop(info: DropInfo) -> Bool {
            hasChangedLocation = false
            draggedItem = nil
            return true
        }
        
    }
    
}


