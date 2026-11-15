//
//  ProfileViewModel.swift
//  UBU
//
//  Created by Irtaza Fiaz on 11/11/2024.
//

import SwiftUI

class ProfileViewModel: ObservableObject {
    // MARK: - Published Properties
    
    @Published var path = NavigationPath()
    
    // Personal Info
    @Published var firstName = ""
    @Published var lastName = ""
    @Published var photoUrl = ""
    @Published var email = ""
    @Published var phoneNumber = ""
    @Published var address = ""
    
    // Images
    @Published var selectedPicture: UIImage?
    @Published var editedImage: UIImage?
    @Published var showPhotoMenu = false
    @Published var showImagePicker = false
    @Published var isEditingImage = false
    @Published var sourceType: UIImagePickerController.SourceType = .camera
    var imageEditCompletion: ((UIImage?) -> Void)?
    
    // UI State
    @Published var isProfileSaved = false
    @Published var openSurveyView = false
    @Published var openBodyMeasurementsView = false
    @Published var openCreatorSurveyView = false
    
    // Validation Errors
    @Published var firstNameError: LocalizedStringKey?
    @Published var lastNameError: LocalizedStringKey?
    @Published var emailError: LocalizedStringKey?
        
    // MARK: - Initialization
    
    func loadInitialData() {
        guard let user = StateManager.shared.userProfile else { return }
        firstName = user.firstName ?? ""
        lastName  = user.lastName  ?? ""
        photoUrl  = user.avatar    ?? ""
        email     = user.email
        phoneNumber = user.phoneNumber ?? ""
        address     = user.address     ?? ""
        self.editedImage = nil
    }
    
    // MARK: - Network Calls
    
    func saveProfile() {
        trimInputs()
        clearErrors()
        guard validateInputs() else { return }
        
        StateManager.shared.updateLoadingOverlay(loading: true)
        let firstNameToSend = firstName.presence
        
        if let data = editedImage?.jpegData(compressionQuality: 0.8) {
            uploadProfileImage(data, name: firstNameToSend)
        } else {
            updateProfile(imageUrl: nil)
        }
    }
    
    // MARK: - Private Helpers
    private func uploadProfileImage(_ data: Data, name: String?) {
        NetworkService.shared.updateProfileDetails(imageData: data, name: name) { [weak self] imageUrl in
            guard !imageUrl.isEmpty else { return }
            self?.updateProfile(imageUrl: imageUrl)
        }
    }
    
    private func updateProfile(imageUrl: String?) {
        
        let params = ApiRequest.UpdateUserProfileRequest(
            firstName: firstName.presence,
            lastName:  lastName.presence,
            phoneNumber: phoneNumber,
            address:     address,
            avatar:      imageUrl
        )
        
        switch StateManager.shared.userRole {
        case .consumer:
            NetworkService.shared.updateUserProfile(params: params) { [weak self] result in
                DispatchQueue.main.async {
                    StateManager.shared.updateLoadingOverlay(loading: false)
                    switch result {
                    case .success:
                        self?.fetchUpdatedProfile()
                    case .failure(let error):
                        NSLog("Error updating profile: \(error)")
                    }
                }
            }
        case .influencer:
            NetworkService.shared.updateCreatorProfile(params: params) { [weak self] result in
                DispatchQueue.main.async {
                    StateManager.shared.updateLoadingOverlay(loading: false)
                    switch result {
                    case .success:
                        self?.fetchCreatorProfile()
                    case .failure(let error):
                        NSLog("Error updating profile: \(error)")
                    }
                }
            }
        }
        
        
    }
    
    private func fetchUpdatedProfile() {
        NetworkService.shared.fetchShopperProfile { [weak self] result in
            DispatchQueue.main.async {
                if case .success(let profile) = result {
                    StateManager.shared.updateUserProfile(with: profile)
                    UserDefaults.standard.set(false, forKey: "didLogoutManually")
                    self?.isProfileSaved = true
                }
            }
        }
    }
    
    private func fetchCreatorProfile() {
        NetworkService.shared.fetchCreatorProfile { [weak self] result in
            DispatchQueue.main.async {
                if case .success(let profile) = result {
                    StateManager.shared.updateUserProfile(with: profile)
                    UserDefaults.standard.set(false, forKey: "didLogoutManually")
                    self?.isProfileSaved = true
                }
            }
        }
    }
    
    private func trimInputs() {
        firstName = firstName.trimmingCharacters(in: .whitespacesAndNewlines)
        lastName  = lastName.trimmingCharacters(in: .whitespacesAndNewlines)
    }
    
    private func clearErrors() {
        firstNameError = nil
        lastNameError  = nil
    }
    
    private func validateInputs() -> Bool {
        var valid = true
        if firstName.isEmpty { firstNameError = "First name is required."; valid = false }
        if lastName.isEmpty  { lastNameError  = "Last name is required."; valid = false }
        return valid
    }
    
    private func index(of value: Any?, in options: [String]) -> Int {
        guard let val = value else { return -1 }
        return options.firstIndex(of: "\(val)") ?? -1
    }
    
}

// MARK: - Conversions & Extensions

private extension ProfileViewModel {
    func mmToInches(_ mm: Int?) -> String {
        let inches = Double(mm ?? 0) / 25.4
        return String(format: "%.1f", inches)
    }
    
    func inchesToMM(_ text: String) -> Int {
        let value = Double(text) ?? 0
        return Int((value * 25.4).rounded())
    }
}

// MARK: - String Extension

private extension String {
    var presence: String? {
        isEmpty ? nil : self
    }
}
