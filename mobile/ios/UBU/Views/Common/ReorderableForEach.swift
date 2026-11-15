//
//  Home.swift
//  UBU
//
//  Created by Irtaza Fiaz on 24/12/2024.
//

import SwiftUI
import UIKit
import UniformTypeIdentifiers

public struct ReorderableForEach<Data, Content>: View where Data : Hashable, Content : View {
    @Binding var data: [Data]
    @Binding var allowReordering: Bool
    private let content: (Data, Bool) -> Content
    
    @State private var draggedItem: Data?
    @State private var hasChangedLocation: Bool = false
    
    public init(_ data: Binding<[Data]>,
                allowReordering: Binding<Bool>,
                @ViewBuilder content: @escaping (Data, Bool) -> Content) {
        _data = data
        _allowReordering = allowReordering
        self.content = content
    }
    
    public var body: some View {
        ForEach(data, id: \.self) { item in
            if allowReordering {
                content(item, hasChangedLocation && draggedItem == item)
                    .onDrag {
                        draggedItem = item
                        return NSItemProvider(object: "\(item.hashValue)" as NSString)
                    }
                    .onDrop(of: [UTType.plainText], delegate: ReorderDropDelegate(
                        item: item,
                        data: $data,
                        draggedItem: $draggedItem,
                        hasChangedLocation: $hasChangedLocation))
            } else {
                content(item, false)
            }
        }
    }
    
    struct ReorderDropDelegate<Item>: DropDelegate where Item: Equatable {
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
                    data.move(fromOffsets: IndexSet(integer: from),
                              toOffset: (to > from) ? to + 1 : to)
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
