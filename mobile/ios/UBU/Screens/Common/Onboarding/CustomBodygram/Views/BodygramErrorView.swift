//
//  BodygramErrorView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 12/09/2024.
//

import SwiftUI

struct BodygramErrorView: View {
    @State private var openBodygramView = false
    @State private var bodygramToken: String?
    
    var body: some View {
        VStack {
            Spacer()
            Image("bodygram-error")
            Text("Oops! Something went wrong on our side")
                .font(UBUFonts.manropeExtraBold(withSize: 18))
                .foregroundStyle(.primaryColor)
                .multilineTextAlignment(.center)
                .padding(.top)
            Text("We appreciate your patience. Please try again in a few minutes.")
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundStyle(.primaryColor.opacity(0.7))
                .multilineTextAlignment(.center)
                .padding(.top, 5)
            
            Spacer()
            
            Button(action: retryBodygramScan) {
                Text("Retry")
                    .font(UBUFonts.manropeBold(withSize: 16))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(.black)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
        }
        .padding()
        .navigationDestination(isPresented: $openBodygramView, destination: {
            BodygramMetricsView()
                .toolbar(.hidden)
        })
    }
    
    private func retryBodygramScan() {
        openBodygramView.toggle()
    }
}

#Preview {
    BodygramErrorView()
}
