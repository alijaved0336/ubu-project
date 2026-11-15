//
//  EmailVerificationBanner.swift
//  UBU
//
//  Created by Irtaza Fiaz on 07/01/2025.
//

import SwiftUI

struct EmailVerificationBanner: View {
    @EnvironmentObject var dialogManager: DialogManager
    @State private var isVisible: Bool = true

    var body: some View {
        if isVisible {
            HStack(alignment: .center, spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Your email is not verified yet. Please verify your email to unlock all features and access your account fully.")
                        .foregroundColor(.primaryColor)
                        .font(UBUFonts.manropeBold(withSize: 12))

                    Button(action: resendVerificationEmail) {
                        Text("Resend Verification Email")
                            .foregroundColor(.primaryColor)
                            .font(UBUFonts.manropeExtraBold(withSize: 12))
                    }
                }

                Spacer()

                Button(action: {
                    isVisible = false
                }) {
                    Image(systemName: "xmark")
                        .resizable()
                        .frame(width: 10, height: 10)
                        .foregroundStyle(.primaryColor)
                }
            }
            .padding(12)
            .frame(maxWidth: .infinity)
            .background(Color(hex: "#29F79E1B"))
            .frame(height: 100)
            .transition(.slide)
            .animation(.easeInOut, value: isVisible)
        }
    }

    private func resendVerificationEmail() {
        NetworkService.shared.resendVerificationEmail()
        dialogManager.showNotification(title: "Email Sent", message: "A new link has been sent to your email address.")
    }
}
