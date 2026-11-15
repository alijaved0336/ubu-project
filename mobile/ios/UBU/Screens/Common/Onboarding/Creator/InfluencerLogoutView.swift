//
//  InfluencerLogoutView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 09/12/2024.
//

import SwiftUI

struct InfluencerLogoutView: View {
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        VStack {
            Spacer()
            Image("bodygram-error")
            Text("You are not registered as an influencer.")
                .font(UBUFonts.manropeExtraBold(withSize: 18))
                .foregroundStyle(.primaryColor)
                .multilineTextAlignment(.center)
                .padding(.top)
            Text("Complete your registration on our website by signing in with your existing credentials.")
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundStyle(.primaryColor.opacity(0.7))
                .multilineTextAlignment(.center)
                .padding(.top, 5)
            
            Spacer()
            
            HStack {
                Button(action: logout) {
                    Text("Logout")
                        .font(UBUFonts.manropeBold(withSize: 16))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(.primaryColor)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }
            }
            
        }
        .padding()
    }
    
    private func logout() {
        NetworkService.shared.logout()
        dismiss()
    }
    
    private func openUBUWebLogin() {
        if let url = URL(string: "https://www.ubu.live/login") {
            UIApplication.shared.open(url)
        }
    }
    
}

#Preview {
    InfluencerLogoutView()
}
