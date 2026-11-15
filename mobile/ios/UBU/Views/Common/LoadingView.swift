//
//  LoadingView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 03/07/2024.
//

import SwiftUI

struct LoadingView: View {
    @State private var activeIndex = 0
    private let animationDuration: Double = 0.5
    
    var body: some View {
        ZStack {
            Color.white.opacity(0.7)
            HStack(spacing: 20) {
                
                Capsule(style: .circular)
                    .fill(getCapsuleColor(capsule: 0))
                    .frame(width: 30, height: activeIndex == 0 ? 50 : 30)
                    .animation(.easeInOut(duration: animationDuration), value: activeIndex)
                
                Capsule(style: .circular)
                    .fill(getCapsuleColor(capsule: 1))
                    .frame(width: 30, height: activeIndex == 1 ? 50 : 30)
                    .animation(.easeInOut(duration: animationDuration), value: activeIndex)
                
                Capsule(style: .circular)
                    .fill(getCapsuleColor(capsule: 2))
                    .frame(width: 30, height: activeIndex == 2 ? 50 : 30)
                    .animation(.easeInOut(duration: animationDuration), value: activeIndex)
                
            }
        }
        .ignoresSafeArea()
        .onAppear {
            startAnimating()
        }
    }
    
    private func startAnimating() {
        Timer.scheduledTimer(withTimeInterval: animationDuration, repeats: true) { timer in
            activeIndex = (activeIndex + 1) % 3
        }
    }
    
    private func getCapsuleColor(capsule: Int = 0) -> Color {
        let baseColor = Color.primaryColor
        
        switch (capsule, activeIndex) {
        case (0, 0), (1, 1), (2, 2):
            return baseColor
        case (0, 1), (2, 1):
            return baseColor.opacity(0.3)
        case (0, 2), (1, 0):
            return baseColor.opacity(0.7)
        case (1, 2):
            return baseColor.opacity(0.3)
        case (2, 0):
            return baseColor.opacity(0.7)
        default:
            return baseColor.opacity(0.7)
        }
    }
    
}

#Preview {
    LoadingView()
}
