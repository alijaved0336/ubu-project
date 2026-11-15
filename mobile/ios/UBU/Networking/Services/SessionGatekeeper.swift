//
//  SessionGatekeeper.swift
//  UBU
//
//  Created by Irtaza Fiaz on 15/08/2025.
//

import SwiftUI

actor SessionGatekeeper {
    static let shared = SessionGatekeeper()
    private var running = false
    private let expiryGraceSeconds: TimeInterval = 60
    
    func checkAuthTokenStorage() async {
        guard !running else { return }
        running = true
        defer { running = false }
        
        if UserDefaults.standard.bool(forKey: "didLogoutManually") {
            await MainActor.run { StateManager.shared.updateRoute(route: .login) }
            LogManager.shared.log("User manually logged out.", type: .info)
            return
        }
        
        let auth = await KeychainManager.shared.authResponseAsync()
        let isValid: Bool = {
            guard let iso = auth?.expiresIn,
                  let expiry = Utilities.isoStringToDate(iso)
            else { return false }
            return expiry.timeIntervalSinceNow > expiryGraceSeconds
        }()
        
        let role = await KeychainManager.shared.userRoleAsync() ?? .consumer
        
        if let auth, isValid {
            NetworkService.shared.storeAuthToken(auth)
            await MainActor.run { StateManager.shared.updateUserRole(role) }
            
            do {
                let profile = try await LoginManager.shared.getUserProfileAsync(role: role)
                LoginManager.shared.routeAfterSwitch(profile: profile)
            } catch {
                LogManager.shared.log("Failed to fetch user profile after valid token. \(error)", type: .error)
            }
            return
        }
        switch role {
            case .consumer:
                LoginManager.shared.switchToConsumer(shouldShowLoadingOverlay: false) {}
                
            case .influencer:
                LoginManager.shared.switchToInfluencer(shouldShowLoadingOverlay: false) {}
        }
    }
}

