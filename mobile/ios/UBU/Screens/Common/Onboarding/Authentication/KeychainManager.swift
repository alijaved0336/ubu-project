//
//  KeychainManager.swift
//  UBU
//
//  Created by Irtaza Fiaz on 13/01/2025.
//

import Security
import UIKit

enum FirstLaunchGuard {
    private static let key = "com.ubu.hasLaunchedBefore"

    static var isFirstLaunch: Bool {
        let launched = UserDefaults.standard.bool(forKey: key)
        if !launched {
            UserDefaults.standard.set(true, forKey: key)
        }
        return !launched
    }
}

class KeychainManager {
    static let shared = KeychainManager()
    
    private init() {}
    
    func storeAuthResponse(_ authResponse: ApiAuthResponse) {
        DispatchQueue.global().async {
            let service = "BioAppService"
            let account = "AuthResponseAccount"
            
            do {
                let data = try JSONEncoder().encode(authResponse)
                
                let query: [String: Any] = [
                    kSecClass as String: kSecClassGenericPassword,
                    kSecAttrService as String: service,
                    kSecAttrAccount as String: account,
                    kSecValueData as String: data
                ]
                
                let deleteStatus = SecItemDelete(query as CFDictionary)
                if deleteStatus == errSecItemNotFound {
                    NSLog("🔑❌ No existing item found to delete.")
                } else if deleteStatus != errSecSuccess {
                    NSLog("🔑❌ Failed to delete existing item. Status: \(deleteStatus)")
                }
                
                let status = SecItemAdd(query as CFDictionary, nil)
                if status == errSecSuccess {
                    NSLog("🔑✅ AuthResponse securely stored.")
                } else if let errorMessage = SecCopyErrorMessageString(status, nil) {
                    NSLog("🔑❌ Failed to store AuthResponse. Error: \(errorMessage)")
                } else {
                    NSLog("🔑❌ Failed to store AuthResponse. Status: \(status)")
                }
            } catch {
                NSLog("🔑❌ Failed to encode AuthResponse: \(error)")
            }
        }
    }
    
    func retrieveAuthResponse(completion: @escaping (ApiAuthResponse?, Error?) -> Void) {
        let service = "BioAppService"
        let account = "AuthResponseAccount"
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var dataTypeRef: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &dataTypeRef)
        
        if status == errSecSuccess {
            if let data = dataTypeRef as? Data {
                do {
                    // Decode the data back into the model
                    let authResponse = try JSONDecoder().decode(ApiAuthResponse.self, from: data)
                    completion(authResponse, nil)
                } catch {
                    completion(nil, error)
                }
            } else {
                completion(nil, NSError(domain: "KeychainErrorDomain", code: -1, userInfo: [NSLocalizedDescriptionKey: "No data found."]))
            }
        } else if let errorMessage = SecCopyErrorMessageString(status, nil) {
            completion(nil, NSError(domain: "KeychainErrorDomain", code: Int(status), userInfo: [NSLocalizedDescriptionKey: errorMessage as String]))
        } else {
            completion(nil, NSError(domain: "KeychainErrorDomain", code: Int(status), userInfo: nil))
        }
    }
    
    func deleteAuthResponse() {
        let service = "BioAppService"
        let account = "AuthResponseAccount"
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account
        ]
        
        let status = SecItemDelete(query as CFDictionary)
        if status == errSecSuccess {
            print("Auth response removed from Keychain.")
        } else {
            print("Failed to remove auth response. Status: \(status)")
        }
    }
    
    // MARK: - Store User Role
    func storeUserRole(_ role: UserRole) {
        DispatchQueue.global().async {
            let service = "BioAppService"
            let account = "UserRoleAccount"
            
            let roleData = role.rawValue.data(using: .utf8)
            
            guard let roleData = roleData else {
                print("🔑❌ Failed to convert UserRole to Data.")
                return
            }
            
            let query: [String: Any] = [
                kSecClass as String: kSecClassGenericPassword,
                kSecAttrService as String: service,
                kSecAttrAccount as String: account,
                kSecValueData as String: roleData
            ]
            
            SecItemDelete(query as CFDictionary) // Remove old entry
            let status = SecItemAdd(query as CFDictionary, nil)
            
            if status == errSecSuccess {
                print("🔑✅ UserRole securely stored.")
            } else {
                print("🔑❌ Failed to store UserRole. Status: \(status)")
            }
        }
    }
    
    // MARK: - Retrieve User Role
    func retrieveUserRole(completion: @escaping (UserRole?) -> Void) {
        let service = "BioAppService"
        let account = "UserRoleAccount"
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var dataTypeRef: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &dataTypeRef)
        
        if status == errSecSuccess, let data = dataTypeRef as? Data,
           let roleString = String(data: data, encoding: .utf8),
           let role = UserRole(rawValue: roleString) {
            completion(role)
        } else {
            completion(nil)
        }
    }
    
    // MARK: - Delete User Role
    func deleteUserRole() {
        let service = "BioAppService"
        let account = "UserRoleAccount"
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account
        ]
        
        let status = SecItemDelete(query as CFDictionary)
        
        if status == errSecSuccess {
            print("🔑✅ UserRole removed from Keychain.")
        } else {
            print("🔑❌ Failed to remove UserRole. Status: \(status)")
        }
    }
    
}

// MARK: - Async/Await API

extension KeychainManager {
    enum KeychainError: Error, LocalizedError {
        case encodingFailed(String)
        case decodingFailed(String)
        case secError(OSStatus, String)
        case noData
        
        var errorDescription: String? {
            switch self {
                case .encodingFailed(let m): return "Encoding failed: \(m)"
                case .decodingFailed(let m): return "Decoding failed: \(m)"
                case .secError(let status, let m): return "Keychain error (\(status)): \(m)"
                case .noData: return "No data found in keychain."
            }
        }
    }
    
    // Convenience
    private static let authService = "BioAppService"
    private static let authAccount = "AuthResponseAccount"
    private static let roleService = "BioAppService"
    private static let roleAccount = "UserRoleAccount"
    
    // Make the background helper static too
    private static func performBackground<T>(
        _ work: @escaping () throws -> T
    ) async throws -> T {
        try await withCheckedThrowingContinuation { cont in
            DispatchQueue.global(qos: .userInitiated).async {
                do { cont.resume(returning: try work()) }
                catch { cont.resume(throwing: error) }
            }
        }
    }
    
    // MARK: AuthResponse (async)
    
    @discardableResult
    func storeAuthResponseAsync(_ authResponse: ApiAuthResponse) async throws {
        try await Self.performBackground {
            let data = try JSONEncoder().encode(authResponse)
            
            let query: [String: Any] = [
                kSecClass as String: kSecClassGenericPassword,
                kSecAttrService as String: Self.authService,
                kSecAttrAccount as String: Self.authAccount,
                kSecValueData as String: data
            ]
            
            let deleteStatus = SecItemDelete(query as CFDictionary)
            if deleteStatus != errSecSuccess && deleteStatus != errSecItemNotFound {
                let msg = (SecCopyErrorMessageString(deleteStatus, nil) as String?) ?? "Unknown"
                throw KeychainError.secError(deleteStatus, msg)
            }
            
            let status = SecItemAdd(query as CFDictionary, nil)
            if status != errSecSuccess {
                let msg = (SecCopyErrorMessageString(status, nil) as String?) ?? "Unknown"
                throw KeychainError.secError(status, msg)
            }
        }
    }
    
    func retrieveAuthResponseAsync() async throws -> ApiAuthResponse? {
        try await Self.performBackground {
            let query: [String: Any] = [
                kSecClass as String: kSecClassGenericPassword,
                kSecAttrService as String: Self.authService,
                kSecAttrAccount as String: Self.authAccount,
                kSecReturnData as String: true,
                kSecMatchLimit as String: kSecMatchLimitOne
            ]
            
            var dataTypeRef: AnyObject?
            let status = SecItemCopyMatching(query as CFDictionary, &dataTypeRef)
            
            if status == errSecItemNotFound { return nil }
            if status != errSecSuccess {
                let msg = (SecCopyErrorMessageString(status, nil) as String?) ?? "Unknown"
                throw KeychainError.secError(status, msg)
            }
            
            guard let data = dataTypeRef as? Data else { throw KeychainError.noData }
            return try JSONDecoder().decode(ApiAuthResponse.self, from: data)
        }
    }
    
    @discardableResult
    func deleteAuthResponseAsync() async throws {
        try await Self.performBackground {
            let query: [String: Any] = [
                kSecClass as String: kSecClassGenericPassword,
                kSecAttrService as String: Self.authService,
                kSecAttrAccount as String: Self.authAccount
            ]
            let status = SecItemDelete(query as CFDictionary)
            if status != errSecSuccess && status != errSecItemNotFound {
                let msg = (SecCopyErrorMessageString(status, nil) as String?) ?? "Unknown"
                throw KeychainError.secError(status, msg)
            }
        }
    }
    
    // MARK: UserRole (async)
    
    @discardableResult
    func storeUserRoleAsync(_ role: UserRole) async throws {
        try await Self.performBackground {
            guard let roleData = role.rawValue.data(using: .utf8) else {
                throw KeychainError.encodingFailed("Unable to convert role to UTF-8.")
            }
            
            let query: [String: Any] = [
                kSecClass as String: kSecClassGenericPassword,
                kSecAttrService as String: Self.roleService,
                kSecAttrAccount as String: Self.roleAccount,
                kSecValueData as String: roleData
            ]
            
            let deleteStatus = SecItemDelete(query as CFDictionary)
            if deleteStatus != errSecSuccess && deleteStatus != errSecItemNotFound {
                let msg = (SecCopyErrorMessageString(deleteStatus, nil) as String?) ?? "Unknown"
                throw KeychainError.secError(deleteStatus, msg)
            }
            
            let status = SecItemAdd(query as CFDictionary, nil)
            if status != errSecSuccess {
                let msg = (SecCopyErrorMessageString(status, nil) as String?) ?? "Unknown"
                throw KeychainError.secError(status, msg)
            }
        }
    }
    
    func retrieveUserRoleAsync() async throws -> UserRole? {
        try await Self.performBackground {
            let query: [String: Any] = [
                kSecClass as String: kSecClassGenericPassword,
                kSecAttrService as String: Self.roleService,
                kSecAttrAccount as String: Self.roleAccount,
                kSecReturnData as String: true,
                kSecMatchLimit as String: kSecMatchLimitOne
            ]
            
            var dataTypeRef: AnyObject?
            let status = SecItemCopyMatching(query as CFDictionary, &dataTypeRef)
            
            if status == errSecItemNotFound { return nil }
            if status != errSecSuccess {
                let msg = (SecCopyErrorMessageString(status, nil) as String?) ?? "Unknown"
                throw KeychainError.secError(status, msg)
            }
            
            guard let data = dataTypeRef as? Data,
                  let roleString = String(data: data, encoding: .utf8) else {
                return nil
            }
            return UserRole(rawValue: roleString)
        }
    }
    
    @discardableResult
    func deleteUserRoleAsync() async throws {
        try await Self.performBackground {
            let query: [String: Any] = [
                kSecClass as String: kSecClassGenericPassword,
                kSecAttrService as String: Self.roleService,
                kSecAttrAccount as String: Self.roleAccount
            ]
            let status = SecItemDelete(query as CFDictionary)
            if status != errSecSuccess && status != errSecItemNotFound {
                let msg = (SecCopyErrorMessageString(status, nil) as String?) ?? "Unknown"
                throw KeychainError.secError(status, msg)
            }
        }
    }
}

extension KeychainManager {
    func authResponseAsync() async -> ApiAuthResponse? {
        do { return try await retrieveAuthResponseAsync() }
        catch {
            LogManager.shared.log("Keychain auth read failed: \(error)", type: .error)
            return nil
        }
    }
    func userRoleAsync() async -> UserRole? {
        do { return try await retrieveUserRoleAsync() }
        catch {
            LogManager.shared.log("Keychain role read failed: \(error)", type: .error)
            return nil
        }
    }
}

extension KeychainManager {
    func wipeUBUItems() {
        let services = ["BioAppService"]
        let accounts = ["AuthResponseAccount", "UserRoleAccount"]

        for service in services {
            for account in accounts {
                let query: [String: Any] = [
                    kSecClass as String: kSecClassGenericPassword,
                    kSecAttrService as String: service,
                    kSecAttrAccount as String: account
                ]
                SecItemDelete(query as CFDictionary)
            }
        }
    }

    func wipeAllAccessibleToThisApp() {
        let classes: [CFString] = [
            kSecClassGenericPassword,
            kSecClassInternetPassword,
            kSecClassCertificate,
            kSecClassKey,
            kSecClassIdentity
        ]
        for secClass in classes {
            let query: [String: Any] = [kSecClass as String: secClass]
            SecItemDelete(query as CFDictionary)
        }
    }
}
