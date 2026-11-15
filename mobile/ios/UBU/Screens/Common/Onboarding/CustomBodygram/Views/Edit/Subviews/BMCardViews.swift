//
//  BodyMeasurementBoxViews.swift
//  UBU
//
//  Created by Irtaza Fiaz on 23/05/2025.
//

import SwiftUI

private struct EditMeasurementBoxBaseView: View {
    let title: String
    @Binding var value: String
    @Binding var showPad: Bool
    @Binding var padModel: KeyPadValue
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundColor(.primaryColor)
            
            Button {
                padModel = KeyPadValue(stringValue: value)
                showPad = true
            } label: {
                HStack(spacing: 2) {
                    Text(value)
                        .font(UBUFonts.manropeExtraBold(withSize: 20)).foregroundColor(.primaryColor)
                        .foregroundColor(.primaryColor)
                    Text("in")
                        .font(UBUFonts.manropeSemibold(withSize: 10))
                        .foregroundColor(.primaryColor.opacity(0.4))
                    Spacer()
                }
            }
        }
        
    }
    
}

struct EditMeasurementBox: View {
    @EnvironmentObject var dialogManager: DialogManager
    
    let title: String
    @Binding var value: String
    @State private var showPad = false
    @State private var padModel = KeyPadValue()
    
    var body: some View {
        EditMeasurementBoxBaseView(title: title, value: $value, showPad: $showPad, padModel: $padModel)
            .frame(width: 120)
            .padding(8)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .shadow(color: .primaryColor.opacity(0.2), radius: 1)
            .sheet(isPresented: $showPad) {
                MeasurementKeypad(model: $padModel, onCommit: handleValueEntry)
                    .background(.primaryColor)
            }
    }
    
    func handleValueEntry() {
        if padModel.isEmpty {
            dialogManager.showNotification(title: "Incomplete Information", message: "Measurement must be greater than 0.")
        } else {
            value = padModel.stringValue
        }
        showPad = false
    }
}

struct EditBodyMeasurementBox: View {
    @EnvironmentObject var dialogManager: DialogManager
    
    let title: String
    @Binding var value: String
    @State private var showPad = false
    @State private var padModel = KeyPadValue()
    
    var body: some View {
        EditMeasurementBoxBaseView(title: Constants.bodyMeasurementLabels[title] ?? title, value: $value, showPad: $showPad, padModel: $padModel)
            .frame(height: 80)
            .frame(maxWidth: .infinity)
            .padding(.leading)
            .background(StyledBackground())
            .sheet(isPresented: $showPad) {
                MeasurementKeypad(model: $padModel, onCommit: handleValueEntry)
                    .background(.primaryColor)
            }
    }
    
    func handleValueEntry() {
        if padModel.isEmpty {
            dialogManager.showNotification(title: "Incomplete Information", message: "Measurement must be greater than 0.")
        } else {
            value = padModel.stringValue
        }
        showPad = false
    }
    
}

#Preview {
    @Previewable @State var text = ""
    EditBodyMeasurementBox(title: "", value: $text)
}



