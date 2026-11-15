//
//  TextEditorWithPlaceholder.swift
//  UBU
//
//  Created by Irtaza Fiaz on 31/12/2024.
//

import SwiftUI

struct TextEditorWithPlaceholder: View {
    
    @FocusState private var isFocused: Bool
    @Binding var text: String
    private let placeholderText: String
    private let minHeight: CGFloat
    private let maxHeight: CGFloat
    private let backgroundColor: Color
    
    init(
        text: Binding<String>,
        placeholder: String = "",
        minHeight: CGFloat = 100,
        maxHeight: CGFloat = 150,
        backgroundColor: Color = Color(hex: "FAFAFA")
    ) {
        self._text = text
        self.placeholderText = placeholder
        self.minHeight = minHeight
        self.maxHeight = maxHeight
        self.backgroundColor = backgroundColor
    }
    
    var body: some View {
        ZStack(alignment: .topLeading) {
            if text.isEmpty {
                Text(placeholderText)
                    .font(UBUFonts.manropeSemibold(withSize: 14))
                    .foregroundColor(.gray)
                    .padding(16)
                    .allowsHitTesting(false)
            }
            
            TextEditor(text: $text)
                .focused($isFocused)
                .padding(12)
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(backgroundColor)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color(hex: "EBEBEB"), lineWidth: 1)
                        )
                )
                .scrollContentBackground(.hidden)
        }
        .frame(minHeight: minHeight, maxHeight: maxHeight)
        .onTapGesture {
            isFocused = true
        }
    }
}


#Preview {
    Delete()
}

struct Delete: View {
    @State private var text = ""
    
    var body: some View {
        TextEditorWithPlaceholder(
            text: $text,
            placeholder: "Write down...",
            minHeight: 120,
            maxHeight: 200
        )
        .padding()
    }
}
