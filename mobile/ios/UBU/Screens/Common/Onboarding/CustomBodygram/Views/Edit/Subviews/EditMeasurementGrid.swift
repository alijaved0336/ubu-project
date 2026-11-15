//
//  EditMeasurementGrid.swift
//  UBU
//
//  Created by Irtaza Fiaz on 23/05/2025.
//

import SwiftUI

struct EditMeasurementGrid: View {
    @Binding var bodyMeasurements: BMResponse

    private let columns = [
        GridItem(.flexible()),
        GridItem(.flexible())
    ]
    
    private let excludedKeys: Set<String> =
        Set(ManualMeasurementPositions.layout.map(\.key))
    
    var body: some View {
        LazyVGrid(columns: columns, spacing: 12) {
            let displayIndices = (bodyMeasurements.measurements ?? [])
                .indices
                .filter { idx in
                    guard let name = bodyMeasurements.measurements?[idx].name else {
                        return false
                    }
                    return !excludedKeys.contains(name)
                }
            
            ForEach(displayIndices, id: \.self) { idx in
                let measurement = bodyMeasurements.measurements![idx]
                let name = measurement.name!
                
                let inchBinding = Binding<String>(
                    get: {
                        let mm = measurement.value ?? 0
                        let inches = mm / 25.4
                        return String(format: "%.1f", inches)
                    },
                    set: { newString in
                        if let newInches = Double(newString) {
                            bodyMeasurements
                                .measurements?[idx]
                                .value = newInches * 25.4
                        }
                    }
                )
                
                EditBodyMeasurementBox(title: name, value: inchBinding)
            }
        }
        .padding(.horizontal)
    }
}
