//
//  StateManager.swift
//  UBU
//
//  Created by Irtaza Fiaz on 01/12/2024.
//

import Foundation
import SwiftUI

enum AppRoute {
    case login, register, tabview, creatorScan, resetPassword, shopperSurvey, creatorSurvey
}

enum UserRole: String, CaseIterable, Identifiable {
    case consumer = "Shopper"
    case influencer = "Creator"
    
    var id: String { rawValue }
}

enum OnboardingState {
    case survey, bodygram, both, none
}

class StateManager: ObservableObject {
    static let shared = StateManager()
    
    private init() {
        loadSwitchBackToParent()
    }
    
    @Published private(set) var appRoute: AppRoute = .login
    @Published var userRole: UserRole = .consumer
    
    @Published private(set) var userProfile: UserProfile?
    @Published private(set) var bodygramKeys: BodygramApiKeys?
    @Published var selectedTab: TabbedItems = .matches
    @Published var bodyscanUrl: String?
    
    @Published var networkLoading: Bool = false
    @Published var matchesLoading: Bool = false
    @Published var showTabBar: Bool = true
    @Published private(set) var shouldSwitchBackToParent: Bool = false
    
    // MARK: - Public Methods
    
    func updateRoute(route: AppRoute) {
        Task { @MainActor in
            self.appRoute = route
        }
    }
    
    func updateUserRole(_ role: UserRole?) {
        Task { @MainActor in
            self.userRole = role ?? .consumer
        }
    }
    
    func updateUserProfile(with user: UserProfile?) {
        Task { @MainActor in
            self.userProfile = user
        }
    }
    
    func updateLoadingOverlay(loading: Bool) {
        Task { @MainActor in
            self.networkLoading = loading
        }
    }

    func updateSelectedBottomTab(with selectedTab: TabbedItems) {
        Task { @MainActor in
            self.selectedTab = selectedTab
        }
    }
    
    private func loadSwitchBackToParent() {
        Task { @MainActor in
            if let value = await UserDefaultsManager.shared.readObject(forKey: .shouldSwitchBackToParent, for: Bool.self) {
                self.shouldSwitchBackToParent = value
            }
        }
    }

    func updateSwitchBackToParent(_ value: Bool) {
        Task { @MainActor in
            await UserDefaultsManager.shared.saveObject(forKey: .shouldSwitchBackToParent, value: value)
            self.shouldSwitchBackToParent = value
        }
    }
}
