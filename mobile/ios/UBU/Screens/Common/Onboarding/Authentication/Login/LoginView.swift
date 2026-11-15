//
//  LoginView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 30/07/2024.
//

import SwiftUI
import GoogleSignIn
import AuthenticationServices
import LogRocket
import FirebaseMessaging

struct LoginView: View {
    @EnvironmentObject var dialogManager: DialogManager
    @ObservedObject var appState = StateManager.shared

    private let biometricManager: BiometricAuthManager

    @State private var email: String
    @State private var password: String

    @State private var openSurveyView = false
    @State private var openCreatorScanView = false
    @State private var openForgotPassword = false
    @State private var openDateOfBirthAlert = false

    @State private var emailError: LocalizedStringKey?
    @State private var passwordError: LocalizedStringKey?

    @FocusState private var focusedField: Field?

    enum Field {
        case email, password
    }

    init(biometricManager: BiometricAuthManager = .shared) {
        self.biometricManager = biometricManager
        #if DEBUG
        _email = State(initialValue: "irtaza.fiaz+104@codingcops.com")
        _password = State(initialValue: "UBU@1234")
        #else
        _email = State(initialValue: "")
        _password = State(initialValue: "")
        #endif
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading) {
                    Text("Login to the revolution")
                        .font(UBUFonts.manropeMedium(withSize: 34))
                        .foregroundStyle(.primaryColor)

                    Text("Where AI and e-commerce collide: perfect matches, curated picks, create, and earn.")
                        .font(UBUFonts.manropeMedium(withSize: 14))
                        .foregroundStyle(.primaryColor.opacity(0.7))

                    SegmentedControl(
                        selectedOption: $appState.userRole,
                        options: UserRole.allCases,
                        labelForOption: { Text($0.rawValue) },
                        idForOption: { $0.id }
                    )
                    .padding(.top, 30)

                    inputField("Email Address", text: $email, error: $emailError, field: .email)
                    inputField("Password", text: $password, error: $passwordError, field: .password, isPassword: true)

                    HStack {
                        Spacer()
                        Button("Forgot password?") {
                            openForgotPassword.toggle()
                        }
                        .foregroundStyle(.primaryColor)
                        .font(UBUFonts.manropeSemibold(withSize: 14))
                    }
                    .padding(.top, 5)

                    loginButton.padding(.top, 30)
                    continueWithSocials.padding(.top)

                    HStack {
                        Text("Don't have an account?")
                            .foregroundStyle(.primaryColor.opacity(0.6))
                        Button("Register") {
                            StateManager.shared.updateRoute(route: .register)
                        }
                        .foregroundStyle(.primaryColor)
                    }
                    .font(UBUFonts.manropeSemibold(withSize: 14))
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding(.top, 10)
                }
                .padding()
                .navigationDestination(isPresented: $openSurveyView) {
                    SurveyView(shouldLoadAllQuestions: false).toolbar(.hidden)
                }
                .navigationDestination(isPresented: $openForgotPassword) {
                    ForgotPasswordView().toolbar(.hidden)
                }
                .navigationDestination(isPresented: $openCreatorScanView) {
                    CreatorOnboardingIntroView(shouldLoadAllQuestions: false).toolbar(.hidden)
                }
                .navigationDestination(isPresented: $openDateOfBirthAlert) {
                    DateOfBirthAlert().toolbar(.hidden)
                }
            }
        }
    }

    private func inputField(_ label: LocalizedStringKey, text: Binding<String>, error: Binding<LocalizedStringKey?>, field: Field, isPassword: Bool = false) -> some View {
        VStack(alignment: .leading) {
            Text(label)
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundStyle(.primaryColor)
                .padding(.top)

            UBUTextField(
                label: text,
                textfieldType: isPassword ? .password : .normal,
                placeholder: label,
                hasError: error.wrappedValue != nil,
                errorMessage: error.wrappedValue
            )
            .submitLabel(.next)
            .onSubmit {
                focusedField = (field == .email) ? .password : nil
            }
        }
    }

    private var loginButton: some View {
        HStack {
            Button(action: validateInputs) {
                Text("Sign in as \(appState.userRole.rawValue)")
                    .font(UBUFonts.manropeMedium(withSize: 16))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 44)
                    .background(.black)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            Button(action: performBiometricLogin) {
                Image("faceId")
            }
        }
    }

    private var continueWithSocials: some View {
        VStack {
            HStack {
                Rectangle().frame(height: 1).foregroundColor(.black.opacity(0.3))
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
            }
            .padding(.top)
            
        }
    }

    private func validateInputs() {
        emailError = email.isEmpty ? "Email cannot be empty" : (!email.contains("@") ? "Enter a valid email" : nil)
        passwordError = password.isEmpty ? "Password cannot be empty" : (password.count < 8 ? "Password must be at least 8 characters" : nil)
        if emailError == nil && passwordError == nil {
            performLogin()
        }
    }

    private func performLogin() {
        logSessioninLogRocket()
        LoginManager.shared.performLogin(
            email: email,
            password: password,
            role: appState.userRole,
            onSuccess: handleLoginSuccess,
            onFailure: showLoginError
        )
    }

    private func handleLoginSuccess(_ response: ApiAuthResponse) {
        let role = appState.userRole
        LoginManager.shared.getUserProfile(
            role: role,
            onSuccess: { profile in
                if profile.dateOfBirth == nil {
                    openDateOfBirthAlert.toggle()
                    return
                }
                LoginManager.shared.routeAfterSwitch(profile: profile)
                registerPushToken(for: profile.userId)
            },
            onFailure: showLoginError
        )
    }
    
    private func registerPushToken(for userId: Int) {
        Messaging.messaging().token { token, error in
            if let error = error {
                print("❌ Error fetching FCM token: \(error)")
                return
            }
            guard let token = token else { return }
            print("📲 Sending token to backend: \(token)")
            NetworkService.shared.registerForPushNotifications(token: token, userId: userId)
        }
    }

    private func performBiometricLogin() {
        LoginManager.shared.performBiometricLogin(
            biometricManager: biometricManager,
            onSuccess: handleLoginSuccess,
            onFailure: {}
        )
    }

    private func loginWithGoogle() {
        guard let controller = getRootViewController() else { return }
        GIDSignIn.sharedInstance.signIn(withPresenting: controller) { result, error in
            if let token = result?.user.accessToken.tokenString {
                LoginManager.shared.performGoogleLogin(
                    accessToken: token,
                    role: appState.userRole,
                    onSuccess: handleLoginSuccess,
                    onFailure: showLoginError
                )
            }
        }
    }

    private func showLoginError(_ error: ApiError) {
        dialogManager.showError(title: "Login Failed", message: error.message)
    }

    private func getRootViewController() -> UIViewController? {
        let scenes = UIApplication.shared.connectedScenes
        let windowScenes = scenes.first as? UIWindowScene
        return windowScenes?.windows.first?.rootViewController
    }

    private func logSessioninLogRocket() {
        SDK.identify(userID: email, userInfo: [
            "name": email,
            "email": email,
            "subscriptionPlan": "free",
        ])
    }
}

#Preview {
    LoginView().environmentObject(DialogManager())
}
