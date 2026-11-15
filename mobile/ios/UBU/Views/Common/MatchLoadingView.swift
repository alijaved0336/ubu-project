//
//  MatchLoadingView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 11/07/2024.
//

import SwiftUI

struct MatchLoadingView: View {
    @State private var progress: Double = 0.05
        
    var body: some View {
        ZStack {
            Color.white.opacity(0.3)
            VStack {
                Spacer()
                
                ProgressCircle(progress: $progress)
                    .frame(width: 100, height: 100)
                
                Text("Calculating Matches")
                    .font(UBUFonts.manropeMedium(withSize: 36))
                    .foregroundStyle(.primaryColor)
                    .padding(.horizontal, 50)
                    .padding(.top, 40)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .multilineTextAlignment(.center)
                ProgressBar(progress: $progress)
                    .frame(height: 10)
                    .padding(.horizontal)
                Spacer()
            }
        }
        .ignoresSafeArea()
        .onAppear {
            Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { timer in
                if self.progress < 1.0 {
                    self.progress += 0.05
                } else {
                    timer.invalidate()
                }
            }
        }
    }
}

struct ProgressCircle: View {
    @Binding var progress: Double
    
    var body: some View {
        ZStack {
            Circle()
                .trim(from: 0.0, to: CGFloat(progress))
                .stroke(
                    AngularGradient(
                        gradient: Gradient(colors: [Color.black.opacity(0.7), Color.black.opacity(0.0)]),
                        center: .center
                    ),
                    style: StrokeStyle(lineWidth: 20, lineCap: .round)
                )
                .rotationEffect(.degrees( 90))
                .animation(.linear, value: progress)
            Color.black
                .clipShape(Circle())
                .frame(width: 120, height: 120)
            Text("\(Int(progress * 100))%")
                .font(UBUFonts.manropeBold(withSize: 34))
                .foregroundStyle(.white)
        }
    }
}

struct ProgressBar: View {
    @Binding var progress: Double
    
    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                Rectangle().frame(width: geometry.size.width , height: geometry.size.height)
                    .opacity(0.3)
                    .foregroundColor(.gray)
                
                Rectangle().frame(width: min(CGFloat(self.progress)*geometry.size.width, geometry.size.width), height: geometry.size.height)
                    .foregroundColor(.black)
                    .animation(.linear, value: progress)
            }.cornerRadius(45.0)
        }
    }
}

#Preview {
    MatchLoadingView()
}


struct UploadFileLoadingView: View {
    @Binding var progress: Double

    var body: some View {
        ZStack {
            Color.white.opacity(0.3)
            
            VStack {
                Spacer()
                
                ProgressCircle(progress: $progress)
                    .frame(width: 100, height: 100)
                
                Text("Uploading in progress")
                    .font(UBUFonts.manropeMedium(withSize: 20))
                    .foregroundStyle(.primaryColor)
                    .padding(.horizontal, 50)
                    .padding(.top, 40)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .multilineTextAlignment(.center)
                
                ProgressBar(progress: $progress)
                    .frame(height: 10)
                    .padding(.horizontal)
                
                Spacer()
            }
        }
        .ignoresSafeArea()
    }
}
