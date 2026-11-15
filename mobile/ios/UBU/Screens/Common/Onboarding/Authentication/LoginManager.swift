//
//  LoginVM.swift
//  UBU
//
//  Created by Irtaza Fiaz on 30/07/2024.
//

import Foundation
import SwiftUI

extension UserRole {
    init?(rawRole: String) {
        switch rawRole.lowercased() {
            case "shopper": self = .consumer
            case "influencer": self = .influencer
            default: return nil
        }
    }
}

final class LoginManager {
    typealias LoginSuccess = (ApiAuthResponse) -> Void
    typealias LoginFailure = (ApiError) -> Void
    
    static let shared = LoginManager()
    private init() {}
    
    // MARK: - Email/Password Login
    func performLogin(email: String, password: String, role: UserRole, onSuccess: @escaping LoginSuccess, onFailure: @escaping LoginFailure) {
        let handler: (Result<ApiAuthResponse, ApiError>) -> Void = {
            self.handleLoginResponse(result: $0, role: role, onSuccess: onSuccess, onFailure: onFailure)
        }
        
        switch role {
            case .consumer:
                NetworkService.shared.loginConsumer(email: email, password: password, completion: handler)
            case .influencer:
                NetworkService.shared.loginInfluencer(email: email, password: password, completion: handler)
        }
    }
    
    // MARK: - Google Login
    func performGoogleLogin(accessToken: String, role: UserRole, onSuccess: @escaping LoginSuccess, onFailure: @escaping LoginFailure) {
        let handler: (Result<ApiAuthResponse, ApiError>) -> Void = {
            self.handleLoginResponse(result: $0, role: role, onSuccess: onSuccess, onFailure: onFailure)
        }
        
        switch role {
            case .consumer:
                NetworkService.shared.loginWithSocial(provider: "google", accessCode: accessToken, completion: handler)
            case .influencer:
                NetworkService.shared.verifyGoogleForInfluencer(accessCode: accessToken, completion: handler)
        }
    }
    
    // MARK: - Biometric Login
    func performBiometricLogin(biometricManager: BiometricAuthManager = .shared, onSuccess: @escaping LoginSuccess, onFailure: @escaping () -> Void) {
        biometricManager.handleBiometricAuthentication(shouldThrowError: true) {
            KeychainManager.shared.retrieveAuthResponse { response, _ in
                DispatchQueue.main.async {
                    guard let auth = response,
                          let expiry = Utilities.isoStringToDate(auth.expiresIn ?? ""),
                          expiry > Date() else {
                        NSLog("🚨 Biometric token expired or missing")
                        onFailure()
                        return
                    }
                    
                    NetworkService.shared.storeAuthToken(auth)
                    onSuccess(auth)
                }
            }
        }
    }
    
    // MARK: - Profile Switching
    func switchProfile(to roleString: String, for id: String, dialogManager: DialogManager, onDismiss: @escaping () -> Void, onTogglePresented: @escaping () -> Void) {
        guard let role = UserRole(rawRole: roleString) else {
            print("Invalid role: \(roleString)")
            return
        }
        
        NetworkService.shared.switchGroupProfile(id: id, role: roleString) { result in
            DispatchQueue.main.async {
                switch result {
                    case .success(let response):
                        StateManager.shared.userRole = role
                        StateManager.shared.updateSwitchBackToParent(true)
                        self.storeSession(response: response, role: role)
                        self.getUserProfile(
                            role: role,
                            onSuccess: { profile in
                                StateManager.shared.updateUserProfile(with: profile)
                                self.routeAfterSwitch(profile: profile, onDismiss: onDismiss, onTogglePresented: onTogglePresented)
                            },
                            onFailure: { error in
                                self.showLoginError(error, dialogManager: dialogManager)
                            }
                        )
                    case .failure(let error):
                        self.showLoginError(error, dialogManager: dialogManager)
                }
            }
        }
    }
    
    // MARK: - Role Switching
    func switchToInfluencer(shouldShowLoadingOverlay: Bool = true, showErrorDialog: @escaping () -> Void) {
        NetworkService.shared.switchToInfluencer(shouldShowLoadingOverlay: shouldShowLoadingOverlay) { result in
            guard case .success(let response) = result else {
                showErrorDialog()
                return
            }
            self.getUserProfile(
                role: .influencer,
                onSuccess: { profile in
                    StateManager.shared.updateUserProfile(with: profile)
                    StateManager.shared.userRole = .influencer
                    self.storeSession(response: response, role: StateManager.shared.userRole)
                    self.routeAfterSwitch(profile: profile)
                },
                onFailure: { error in
                    showErrorDialog()
                }
            )
        }
    }
    
    func switchToConsumer(shouldShowLoadingOverlay: Bool = true, showErrorDialog: @escaping () -> Void) {
        NetworkService.shared.switchToConsumer(shouldShowLoadingOverlay: shouldShowLoadingOverlay) { [weak self] result in
            guard let self = self else { return }
            
            switch result {
                case .success(let response):
                    self.getUserProfile(
                        role: .consumer,
                        onSuccess: { profile in
                            StateManager.shared.updateUserProfile(with: profile)
                            StateManager.shared.userRole = .consumer
                            self.storeSession(response: response, role: StateManager.shared.userRole)
                            self.routeAfterSwitch(profile: profile)
                        },
                        onFailure: { error in
                            showErrorDialog()
                        }
                    )
                    
                case .failure:
                    showErrorDialog()
            }
        }
    }
    
    // MARK: - Get User Profile
    func getUserProfile(role: UserRole, onSuccess: @escaping (UserProfile) -> Void, onFailure: @escaping LoginFailure) {
        let completion: (Result<UserProfile, ApiError>) -> Void = { result in
            switch result {
                case .success(let profile):
                    UserDefaults.standard.set(false, forKey: "didLogoutManually")
                    StateManager.shared.updateUserProfile(with: profile)
                    onSuccess(profile)
                case .failure(let error):
                    onFailure(error)
            }
        }
        
        switch role {
            case .consumer:
                NetworkService.shared.fetchShopperProfile(completion: completion)
            case .influencer:
                NetworkService.shared.fetchCreatorProfile(completion: completion)
        }
    }
    
    // MARK: - Routing Helpers
    func routeAfterSwitch(profile: UserProfile, onDismiss: () -> Void = {}, onTogglePresented: () -> Void = {}) {
        if profile.isScanned == false {
            StateManager.shared.updateRoute(route: .creatorScan)
        } else if profile.isSurveyDone == false {
            switch StateManager.shared.userRole {
                case .consumer:
                    StateManager.shared.updateRoute(route: .shopperSurvey)
                case .influencer:
                    StateManager.shared.updateRoute(route: .creatorSurvey)
            }
        } else {
            StateManager.shared.updateRoute(route: .tabview)
            StateManager.shared.updateSelectedBottomTab(with: .profile)
            onDismiss()
            onTogglePresented()
        }
    }
    
    // MARK: - Session & Error Handling
    private func handleLoginResponse(result: Result<ApiAuthResponse, ApiError>, role: UserRole, onSuccess: @escaping LoginSuccess, onFailure: @escaping LoginFailure) {
        switch result {
            case .success(let response):
                storeSession(response: response, role: role)
                onSuccess(response)
            case .failure(let error):
                onFailure(error)
        }
    }
    
    private func storeSession(response: ApiAuthResponse, role: UserRole) {
        KeychainManager.shared.storeAuthResponse(response)
        KeychainManager.shared.storeUserRole(role)
        NetworkService.shared.storeAuthToken(response)
    }
    
    private func showLoginError(_ error: ApiError, dialogManager: DialogManager) {
        print("❌ LoginManager Error: \(error.localizedDescription)")
    }
}

extension LoginManager {
    func getUserProfileAsync(role: UserRole) async throws -> UserProfile {
        try await withCheckedThrowingContinuation { cont in
            self.getUserProfile(
                role: role,
                onSuccess: { profile in cont.resume(returning: profile) },
                onFailure: { error in cont.resume(throwing: error) }
            )
        }
    }
}
