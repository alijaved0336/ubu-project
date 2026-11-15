//
//  UBURatingView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 08/07/2024.
//

import SwiftUI

struct UBURatingView: View {
    
    @Binding var value: Double
    private let totalStars = 5
    
    var body: some View {
        HStack(spacing: 0) {
            ForEach(0..<5) { index in
                Image(systemName: imageName(for: index, value: value))
                    .resizable()
                    .frame(width: 16, height: 16)
                    .padding(.leading, 10)
            }
        }
        .foregroundColor(.primaryColor.opacity(0.6))
    }
    
    func imageName(for starIndex: Int, value: Double) -> String {
        // Version A
        
        
        if value >= Double(starIndex + 1) {
            return "star.fill"
        }
        else if value >= Double(starIndex) + 0.5 {
            return "star.leadinghalf.filled"
        }
        else {
            return "star"
        }
        
        // Version B
        switch (value - Double(starIndex)) {
        case ..<0.5: return "star"
        case 0.5..<1.0: return "star.leadinghalf.filled"
        default: return "star.fill"
        }
    }
}

#Preview {
    UBURatingView(value: .constant(3))
}
