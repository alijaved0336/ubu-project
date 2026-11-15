//
//  LoginView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 19/06/2024.
//

import SwiftUI
import GoogleSignIn

struct LoginView: View {
    @EnvironmentObject var alertManager: AlertManager
    @State private var email = "b@b.com"
    @State private var password = "qqqqqqqq"
    @State private var openRegisterView = false
    @State private var openBodygramView = false
    @State private var openForgotPassword = false
    @State private var openTabbedView = false
    
    @State private var emailError: LocalizedStringKey?
    @State private var passwordError: LocalizedStringKey?
    
    var body: some View {
        NavigationStack {
            VStack(alignment: .leading) {
                
//                HStack {
//                    Spacer()
//                    Button {
//                        NetworkService.shared.appRoute = .tabview
//                    } label: {
//                        Text("Continue as Guest")
//                            .font(UBUFonts.manropeSemibold(withSize: 14))
//                            .foregroundStyle(.primaryColor)
//                    }
//                    Image("arrow-right")
//                }
                
                Text("Login to the revolution")
                    .font(UBUFonts.manropeMedium(withSize: 34))
                    .foregroundStyle(.primaryColor)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.bottom, 1)
                    .lineLimit(2)
                
                Text("Where AI and e-commerce collide: perfect matches, curated picks, create, and earn.")
                    .font(UBUFonts.manropeMedium(withSize: 14))
                    .foregroundStyle(.primaryColor.opacity(0.7))
                    .frame(maxWidth: .infinity, alignment: .leading)
                
                Text("Email Address")
                    .font(UBUFonts.manropeSemibold(withSize: 14))
                    .foregroundStyle(.primaryColor)
                    .padding(.top)
                    .lineSpacing(0)
                UBUTextField(label: $email, textfieldType: .normal, placeholder: "Email", hasError: emailError != nil, errorMessage: emailError)
                
                Text("Password")
                    .font(UBUFonts.manropeSemibold(withSize: 14))
                    .foregroundStyle(.primaryColor)
                    .padding(.top)
                    .lineSpacing(0)
                UBUTextField(label: $password, textfieldType: .password, placeholder: "Password", hasError: passwordError != nil, errorMessage: passwordError)
                
                HStack {
                    Spacer()
                    Button {
                        openForgotPassword.toggle()
                    } label: {
                        Text("Forgot password?")
                            .foregroundStyle(.primaryColor)
                            .font(UBUFonts.manropeSemibold(withSize: 14))
                    }
                }
                .padding(.top, 5)
                
                loginButton
                    .padding(.top, 30)
                
                continueWithSocials
                    .padding(.top)
                
                Spacer()
                
                HStack {
                    Text("You don't have an account?")
                        .foregroundStyle(.primaryColor.opacity(0.6))
                    Button {
                        NetworkService.shared.appRoute = .register
                    } label: {
                        Text("Sign up")
                            .foregroundStyle(.primaryColor)
                    }
                }
                .padding(.top, 10)
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .frame(maxWidth: .infinity, alignment: .center)
                
            }
            .padding()
            .navigationDestination(isPresented: $openRegisterView, destination: {
                RegisterView()
                    .toolbar(.hidden)
            })
            .navigationDestination(isPresented: $openForgotPassword, destination: {
                ForgotPasswordView()
                    .toolbar(.hidden)
            })
            .navigationDestination(isPresented: $openTabbedView, destination: {
                TabbedView()
                    .toolbar(.hidden)
            })
        }
    }
    
    // MARK: Custom Views -
    
    private var loginButton: some View {
        HStack {
            Button {
                NetworkService.shared.loginUser(email: email, password: password) { error in
                    
                    guard let error = error else {
                        NetworkService.shared.appRoute = .tabview
                        return
                    }
                    
                    alertManager.showAlert(
                        alertType: .notification,
                        title: "Login Failed",
                        description: error.message,
                        primaryAction: {}
                    )

                }
            } label: {
                Text("Sign In")
                    .font(UBUFonts.manropeMedium(withSize: 16))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(.black)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            
//            Button {
//                // TODO: Perform face id login
//            } label: {
//                Image("finger-print")
//            }
        }
    }
    
    
    private var continueWithSocials: some View {
        VStack {
            HStack {
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(.black.opacity(0.3))
                Text("or continue with")
                    .foregroundColor(Color(hex: "090A0A"))
                    .font(UBUFonts.manropeRegular(withSize: 16))
                    .padding(.horizontal, 8)
                    .lineLimit(1)
                    .fixedSize(horizontal: true, vertical: false)
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(.black.opacity(0.3))
            }
            
            HStack {
                Button (action: loginWithGoogle) {
                    Rectangle()
                        .fill(Color.clear)
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .overlay(
                            Image("login-with-google")
                                .resizable()
                                .frame(width: 24, height: 24)
                                .foregroundColor(.white),
                            alignment: .center
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.black.opacity(0.1), lineWidth: 1)
                        )
                }
//                Spacer()
//                Button (action: {}) {
//                    Rectangle()
//                        .fill(Color.clear)
//                        .frame(maxWidth: .infinity)
//                        .frame(height: 50)
//                        .overlay(
//                            Image("login-with-apple")
//                                .resizable()
//                                .frame(width: 20, height: 24)
//                                .foregroundColor(.white),
//                            alignment: .center
//                        )
//                        .overlay(
//                            RoundedRectangle(cornerRadius: 8)
//                                .stroke(Color.black.opacity(0.1), lineWidth: 1)
//                        )
//                }
            }
            .padding(.top)
            
        }
    }
    
    // MARK: Actions -
    
    private func validateInputs() {
        emailError = nil
        passwordError = nil
        
        if email.isEmpty {
            emailError = "Email cannot be empty"
        } else if !email.contains("@") {
            emailError = "Enter a valid email"
        }
        
        if password.isEmpty {
            passwordError = "Password cannot be empty"
        } else if password.count < 8 {
            passwordError = "Password must be at least 8 characters"
        }
        
        if emailError == nil && passwordError == nil {
            NetworkService.shared.appRoute = .tabview
        }
    }
    
    private func loginWithGoogle() {
        guard let controller = getRootViewController() else {
            print("❌ \(#function) Cannot find rootViewController")
            return
        }
        
        GIDSignIn.sharedInstance.signIn(
            withPresenting: controller) { signInResult, error in
                guard signInResult != nil else {
                    print("❌ \(#function)\n\(error?.localizedDescription ?? "Unable to login with google")")
                    return
                }
                guard let code = signInResult?.user.accessToken.tokenString else {
                    return
                }
                guard let idToken = signInResult?.user.idToken else {
                    return
                }
                print("🤩 \(#function)\n Successfully logged in.")
                print(code)
                print(idToken)

                NetworkService.shared.loginWithSocial(provider: "google", accessCode: code) { error in
                    
                    guard let error = error else {
                        NetworkService.shared.appRoute = .tabview
                        return
                    }
                    
                    alertManager.showAlert(
                        alertType: .notification,
                        title: "Login Failed",
                        description: error.message,
                        primaryAction: {}
                    )

                }
                
                
            }
        
    }
    
    private func getRootViewController() -> UIViewController? {
        let scenes = UIApplication.shared.connectedScenes
        let windowScenes = scenes.first as? UIWindowScene
        return windowScenes?.windows.first?.rootViewController
    }
    
}

#Preview {
    LoginView()
        .environmentObject(AlertManager())
}
