//
//  ForgotPassword.swift
//  UBU
//
//  Created by Irtaza Fiaz on 28/06/2024.
//

import SwiftUI

struct ForgotPasswordView: View {
    @Environment(\.dismiss) var dismiss

    @State private var email = ""
    @State private var emailError: LocalizedStringKey?
    @State private var openEnterOTPView = false
    @State private var successMessage: String?
    @State var toast: Toast? = nil

    var body: some View {
        VStack(alignment: .leading) {
            headerView

            if let successMessage = successMessage {
                successMessageView(successMessage)
            } else {
                formView
            }
        }
        .padding()
        .toastView(toast: $toast)
    }

    private var headerView: some View {
        HStack {
            Button(action: {dismiss()}) {
                Image("arrow-left")
            }
            Spacer()
        }
        .padding(.bottom, successMessage == nil ? 20 : 0)
    }

    private var formView: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Forgot Password")
                .font(UBUFonts.manropeMedium(withSize: 34))
                .foregroundStyle(.primaryColor)
                .lineLimit(2)

            Text("Enter your registered email below to receive password reset instructions")
                .font(UBUFonts.manropeMedium(withSize: 14))
                .foregroundStyle(.primaryColor.opacity(0.7))

            Text("Email Address")
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundStyle(.primaryColor)

            UBUTextField(
                label: $email,
                textfieldType: .normal,
                placeholder: "Email",
                hasError: emailError != nil,
                errorMessage: emailError
            )

            Button(action: validateInputs) {
                Text("Continue")
                    .font(UBUFonts.manropeMedium(withSize: 16))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(.black)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            .padding(.top, 20)

            Spacer()
        }
    }

    private func successMessageView(_ message: String) -> some View {
        VStack {
            Spacer()
            Text(message)
                .font(UBUFonts.manropeExtraBold(withSize: 18))
                .foregroundStyle(.primaryColor)
                .multilineTextAlignment(.center)
                .frame(maxWidth: .infinity, alignment: .center)
            Spacer()
        }
    }

    private func validateInputs() {
        emailError = nil

        guard !email.isEmpty else {
            emailError = "Email cannot be empty"
            return
        }

        guard email.contains("@") else {
            emailError = "Enter a valid email"
            return
        }

        forgotPassword()
    }

    private func forgotPassword() {
        NetworkService.shared.forgotPassword(email: email) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(_):
                    self.toast = Toast(message: "Password reset link sent to your email.", type: .success)
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                        dismiss()
                    }
                case .failure(let error):
                    self.emailError = "\(error.message)"
                }
            }
        }
    }
}


#Preview {
    ForgotPasswordView()
}
