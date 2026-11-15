//
//  RegisterProfileView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 04/06/2025.
//

import SwiftUI

struct RegisterProfileView: View {
    
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var dialogManager: DialogManager
    @EnvironmentObject var appState: StateManager
    
    let relationship: ProfileRelationship
    let profileType: ProfileType
    @State private var datePickerID = UUID()
    private let defaultDOB = Date()

#if DEBUG
    @State private var firstName = "Irtaza"
    @State private var lastName = "Fiaz"
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var dateOfBirth = Date()

#else
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var dateOfBirth = Date()
#endif
    
    @State private var firstNameError: LocalizedStringKey?
    @State private var lastNameError: LocalizedStringKey?
    @State private var emailError: LocalizedStringKey?
    @State private var passwordError: LocalizedStringKey?
    @State private var confirmPasswordError: LocalizedStringKey?
    @State private var dateOfBirthError: LocalizedStringKey?

    
    @State private var openBodygramView = false
    @State private var agreedTermsAndPolicy = false
    @State private var openConnectSocials = false
    @State private var openTabbedView = false
    
    @State private var navigateToTerms = false
    @State private var navigateToPrivacyPolicy = false
    @State private var bodygramToken: String?
    
    @FocusState private var focusedField: Field?
    
    enum Field {
        case firstName, lastName, email, password, confirmPassword
    }
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading) {
                    topBar
                    Text("Create your new\nprofile")
                        .font(UBUFonts.manropeMedium(withSize: 34))
                        .foregroundStyle(.primaryColor)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.bottom, 1)
                    
                    Group {
                        inputField("First Name", text: $firstName, error: $firstNameError, field: .firstName)
                        inputField("Last Name", text: $lastName, error: $lastNameError, field: .lastName)
                        DateInputView(
                               selectedDate: $dateOfBirth,
                               errorMessage: $dateOfBirthError,
                               label: "Date of Birth",
                               isDisabled: false
                           )
                        if profileType == .independet {
                            inputField("Email Address", text: $email, error: $emailError, field: .email)
                            inputField("Password", text: $password, error: $passwordError, field: .password, isPassword: true)
                            inputField("Confirm Password", text: $confirmPassword, error: $confirmPasswordError, field: .confirmPassword, isPassword: true)
                        }
                    }
                    termsAndPolicyToggle
                        .padding(.top, 5)
                    
                    registerButton
                        .padding(.top, 10)
                }
                .padding(1)
            }
            .padding()
            .scrollIndicators(.hidden)
            .navigationDestination(isPresented: $openBodygramView) {
                BodygramMetricsView()
            }
            .navigationDestination(isPresented: $navigateToTerms) {
                TermsOfServiceView()
            }
            .navigationDestination(isPresented: $navigateToPrivacyPolicy) {
                PrivacyPolicyView()
            }
        }
    }
    
    private func inputField(_ label: LocalizedStringKey, text: Binding<String>, error: Binding<LocalizedStringKey?>, field: Field, isPassword: Bool = false) -> some View {
        VStack(alignment: .leading) {
            Text(label)
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundStyle(.primaryColor)
                .padding(.top)
                .lineSpacing(0)
            
            UBUTextField(
                label: text,
                textfieldType: isPassword ? .password : .normal,
                placeholder: label,
                hasError: error.wrappedValue != nil,
                errorMessage: error.wrappedValue
            )
            .focused($focusedField, equals: field)
            .submitLabel(.next)
            .onSubmit {
                switch field {
                case .firstName:
                    focusedField = .lastName
                case .lastName:
                    focusedField = .email
                case .email:
                    focusedField = .password
                case .password:
                    focusedField = .confirmPassword
                case .confirmPassword:
                    focusedField = nil
                }
            }
        }
    }
    
    // MARK: Custom Views -
    private var topBar: some View {
        HStack {
            Button {
                dismiss()
            } label: {
                Image("arrow-left")
            }
            Spacer()
        }
    }
    
    private var termsAndPolicyToggle: some View {
        Toggle(isOn: $agreedTermsAndPolicy) {
            VStack(alignment: .leading, spacing: 0) {
                HStack(spacing: 0) {
                    Text("I agree to the ")
                    Button { navigateToTerms.toggle() } label: {
                        Text("Terms & Conditions")
                            .font(UBUFonts.manropeExtraBold(withSize: 14))
                            .foregroundStyle(.primaryColor)
                            .lineSpacing(0)
                    }
                    Text(" and ")
                }
                HStack(spacing: 0) {
                    Button { navigateToPrivacyPolicy.toggle() } label: {
                        Text("Privacy Policy")
                            .font(UBUFonts.manropeExtraBold(withSize: 14))
                            .foregroundStyle(.primaryColor)
                            .lineSpacing(0)
                    }
                }
            }
            .font(UBUFonts.manropeSemibold(withSize: 14))
            .lineSpacing(0)
        }
        .foregroundStyle(.primaryColor)
        .toggleStyle(CheckboxToggleStyle())
        .padding(.top, 10)
    }
    
    private var registerButton: some View {
        Button(action: performRegisterAction) {
            Text("Next")
                .font(UBUFonts.manropeBold(withSize: 16))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .background(.black)
                .clipShape(RoundedRectangle(cornerRadius: 8))
        }
    }
    
    // MARK: Actions -
    private func performRegisterAction() {
        let registerHandler: (Result<ApiAuthResponse, ApiError>) -> Void = { result in
            switch result {
            case .success(let response):
                KeychainManager.shared.storeAuthResponse(response)
                KeychainManager.shared.storeUserRole(appState.userRole)
                NetworkService.shared.storeAuthToken(response)
                self.getUserProfile(response: response)
                StateManager.shared.updateSwitchBackToParent(true)
            case .failure(let error):
                self.showLoginError(error)
            }
        }
        if !agreedTermsAndPolicy {
            dialogManager.showNotification(
                title: "Action Required",
                message: "To complete your registration, please agree to our Terms and Privacy Policy."
            )
        } else {
            validateInputs()
            if allFieldsValid() {
                NetworkService.shared
                    .createChildProfile(
                    params: .init(
                        user: .init(
                            email: email,
                            password: password,
                            firstName: firstName,
                            lastName: lastName,
                            dateOfBirth: Utilities.dateToISOString(dateOfBirth)
                        ),
                        profile: .init(
                            relation: relationship.rawValue,
                            isDependant: profileType == .dependent ? true : false
                        )
                    ),
                    completion: registerHandler
                )
            }
        }
    }
    
    private func getUserProfile(response: ApiAuthResponse) {
        switch appState.userRole {
        case .consumer:
            NetworkService.shared.fetchShopperProfile { result in
                switch result {
                case .success(let profile):
                    UserDefaults.standard.set(false, forKey: "didLogoutManually")
                    StateManager.shared.updateUserProfile(with: profile)
                    openBodygramView.toggle()
                case .failure(let error):
                    NSLog("❌ User Profile Error: \(error.localizedDescription)")
                }
            }
        case .influencer:
            NetworkService.shared.fetchCreatorProfile { result in
                switch result {
                case .success(let profile):
                    UserDefaults.standard.set(false, forKey: "didLogoutManually")
                    StateManager.shared.updateUserProfile(with: profile)
                    openBodygramView.toggle()
                case .failure(let error):
                    showLoginError(error)
                }
            }
        }
    }       
    
    private func showLoginError(_ error: ApiError) {
        dialogManager.showError(title: "Error", message: error.message)
    }
    
    private func validateInputs() {
        firstNameError = firstName.isEmpty ? "First name cannot be empty" : nil
        lastNameError = lastName.isEmpty ? "Last name cannot be empty" : nil
        if Calendar.current.isDate(dateOfBirth, inSameDayAs: defaultDOB) {
            dateOfBirthError = "Please select a valid date"
        } else {
            dateOfBirthError = nil
        }
        
        if profileType == .independet {
            emailError = email.isEmpty ? "Email cannot be empty" : (!Utilities.isValidEmail(email) ? "Enter a valid email" : nil)
            passwordError = password.isEmpty ? "Password cannot be empty" : (password.count < 8 ? "Password must be at least 8 characters" : nil)
            confirmPasswordError = (confirmPassword != password) ? "Passwords do not match" : nil
        }
    }
    
    private func allFieldsValid() -> Bool {
        let basicValid = (firstNameError == nil && lastNameError == nil && dateOfBirthError == nil && agreedTermsAndPolicy)
        if profileType == .dependent {
            return basicValid
        } else {
            return basicValid
            && emailError == nil
            && passwordError == nil
            && confirmPasswordError == nil
        }
    }
    
}

#Preview {
    RegisterProfileView(relationship: .husband, profileType: .dependent)
}
