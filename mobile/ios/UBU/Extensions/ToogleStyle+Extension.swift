//
//  ToogleStyle+Extensions.swift
//  UBU
//
//  Created by Irtaza Fiaz on 27/06/2024.
//

import Foundation
import SwiftUI

struct CheckboxToggleStyle: ToggleStyle {
    func makeBody(configuration: Configuration) -> some View {
        HStack {
            
            RoundedRectangle(cornerRadius: 5.0)
                .stroke(lineWidth: 2)
                .frame(width: 25, height: 25)
                .cornerRadius(5.0)
                .overlay {
                    Image(systemName: configuration.isOn ? "checkmark.square.fill" : "")
                        .resizable()
                        .frame(width: 25, height: 25)
                }
                .onTapGesture {
                    withAnimation(.spring()) {
                        configuration.isOn.toggle()
                    }
                }
            
            configuration.label
            
        }
    }
}

#Preview {
    VStack {
        @State var agreedTermsAndPolicy = true
        Toggle(isOn: $agreedTermsAndPolicy) {
            HStack(spacing: 0) {
                Text("I Agree with ")
            }
            .lineSpacing(0)
        }
        .foregroundStyle(.primaryColor)
        .toggleStyle(CheckboxToggleStyle())
        .padding(.top, 10)
    }
    
}
