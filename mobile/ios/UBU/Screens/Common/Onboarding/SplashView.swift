//
//  SplashView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 19/06/2024.
//

import SwiftUI

struct SplashView: View {
    @Binding var progress: Double
    var totalProgressCount: Double
    
    var body: some View {
        VStack {
            Spacer()
            Text("UBU")
                .font(UBUFonts.manropeRegular(withSize: 64))
            Text("Match. Discover. Inspire.")
                .font(UBUFonts.manropeRegular(withSize: 16))
                .foregroundColor(Color.black.opacity(0.3))
            
            ProgressView(value: progress, total: totalProgressCount)
                .progressViewStyle(LinearProgressViewStyle())
                .frame(height: 8.0)
                .scaleEffect(x: 1, y: 2, anchor: .center)
                .clipShape(RoundedRectangle(cornerRadius: 6))
                .padding(.horizontal, 40)
                .tint(.black)
                .padding(.top, 30)
            
            Spacer()
        }
        .onAppear {
            incrementProgress()
        }
    }

    private func incrementProgress() {
        withAnimation(.linear(duration: 0.1)) {
            progress += 2
            if progress < totalProgressCount {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                    incrementProgress()
                }
            }
        }
    }
}

#Preview {
    SplashView(progress: .constant(20), totalProgressCount: 20.0)
}


