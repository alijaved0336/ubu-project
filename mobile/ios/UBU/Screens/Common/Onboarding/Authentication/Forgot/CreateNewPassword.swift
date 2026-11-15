//
//  CreateNewPassword.swift
//  UBU
//
//  Created by Irtaza Fiaz on 28/06/2024.
//

import SwiftUI

struct CreateNewPassword: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var dialogManager: DialogManager

    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var passwordError: LocalizedStringKey?
    @State private var confirmPasswordError: LocalizedStringKey?
    @State var toast: Toast? = nil

    let resetPasswordUrl: String
    
    var body: some View {
        VStack(alignment: .leading) {

            Text("Create new password")
                .font(UBUFonts.manropeMedium(withSize: 34))
                .foregroundStyle(.primaryColor)
                .padding(.top, 40)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.bottom, 1)
                .lineLimit(2)
            
            Text("Choose a password")
                .font(UBUFonts.manropeMedium(withSize: 14))
                .foregroundStyle(.primaryColor.opacity(0.7))
                .frame(maxWidth: .infinity, alignment: .leading)
            
            Text("New Password")
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundStyle(.primaryColor)
                .padding(.top)
                .lineSpacing(0)
            UBUTextField(label: $password, textfieldType: .password, placeholder: "Password", hasError: passwordError != nil, errorMessage: passwordError)
            
            Text("Re-Enter New Password")
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundStyle(.primaryColor)
                .padding(.top)
                .lineSpacing(0)
            UBUTextField(label: $confirmPassword, textfieldType: .password, placeholder: "Confirm Password", hasError: confirmPasswordError != nil, errorMessage: confirmPasswordError)
            
            
            Button (action: createNewPassword) {
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
        .padding()
        .toastView(toast: $toast)
    }
    
    private func createNewPassword() {
        validateInputs()
            
            // Proceed only if there are no errors
            guard passwordError == nil, confirmPasswordError == nil else { return }
            
            let token = Utilities.extractToken(from: resetPasswordUrl) ?? ""
            NetworkService.shared.resetPassword(params: .init(token: token, newPassword: password)) { result in
                DispatchQueue.main.async {
                    switch result {
                    case .success(_):
                        self.toast = Toast(message: "Your password has been changed.", type: .success)
                        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                            StateManager.shared.updateRoute(route: .login)
                        }
                    case .failure(let error):
                        self.toast = Toast(message: error.localizedDescription, type: .success)
                    }
                }
            }
    }
    
    private func validateInputs() {
        passwordError = password.isEmpty ? "Password cannot be empty" : (password.count < 8 ? "Password must be at least 8 characters" : nil)
        confirmPasswordError = (confirmPassword != password) ? "Passwords do not match" : nil
    }
}

#Preview {
    CreateNewPassword(resetPasswordUrl: "")
}
