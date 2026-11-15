//
//  InputTextEditor.swift
//  UBU
//
//  Created by Irtaza Fiaz on 31/12/2024.
//

import SwiftUI

struct InputTextEditor: View {
    let title: String
    @Binding var text: String
    let error: LocalizedStringKey?
    
    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(title)
                .foregroundColor(.primaryColor)
                .font(UBUFonts.manropeSemibold(withSize: 14))
            
            TextEditor(text: $text)
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundStyle(.primaryColor)
                .frame(minHeight: 150, maxHeight: 300)
                .padding(10)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color(hex: "EBEBEB"), lineWidth: 1)
                        .fill(Color(hex: "FAFAFA"))
                )
                .scrollContentBackground(.hidden)
            
            if let error = error {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
            }
        }
        .padding(.top, 10)
        
    }
}
