//
//  SegmentControl.swift
//  UBU
//
//  Created by Irtaza Fiaz on 12/12/2024.
//

import SwiftUI

struct SegmentedControl<Option: Identifiable & Hashable, Label: View>: View {
    @Binding var selectedOption: Option
    var options: [Option]
    var labelForOption: (Option) -> Label
    var idForOption: (Option) -> String
    
    @Namespace private var segmentedControl
    
    var body: some View {
        HStack {
            ForEach(options) { option in
                Button {
                    self.selectedOption = option
                } label: {
                    labelForOption(option)
                        .padding(.vertical, 10)
                        .foregroundStyle(selectedOption == option ? .white : .primaryColor)
                        .frame(maxWidth: .infinity)
                }
                .matchedGeometryEffect(
                    id: idForOption(option),
                    in: segmentedControl
                )
            }
        }
        .frame(maxWidth: .infinity)
        .background(
            Capsule()
                .fill(.primaryColor)
                .matchedGeometryEffect(
                    id: idForOption(selectedOption),
                    in: segmentedControl,
                    isSource: false
                )
        )
        .background(
            Capsule()
                .stroke(Color(hex: "EBEBEB"), lineWidth: 1)
                .fill(Color(hex: "FAFAFA"))
        )
    }
}

struct ExampleOption: Identifiable, Hashable {
    let id: Int
    let title: String
}

struct ContentView: View {
    @State private var selectedOption: ExampleOption = ExampleOption(id: 1, title: "Option 1")
    
    let options = [
        ExampleOption(id: 1, title: "Option 1"),
        ExampleOption(id: 2, title: "Option 2")
    ]
    
    var body: some View {
        SegmentedControl(
            selectedOption: $selectedOption,
            options: options,
            labelForOption: { option in
                Text(option.title)
            },
            idForOption: { option in
                "\(option.id)"
            }
        )
        .padding()
    }
}

#Preview {
    ContentView()
        .padding()
}
