//
//  UserDefaultsManager.swift
//  UBU
//
//  Created by Irtaza Fiaz on 12/08/2025.
//


import Foundation

actor UserDefaultsManager: UserDefaultsManaging {
    // MARK: - Stored properties

    static let shared = UserDefaultsManager()
    private let userDefaults = UserDefaults.standard

    private init() {}

    func readObject<T: Sendable>(forKey: PersistentStorageKeys, for type: T.Type) -> T? {
        if let value = userDefaults.value(forKey: forKey.rawValue) as? T {
            
            return value
        }
        return nil
    }

    func saveObject<T: Sendable>(forKey: PersistentStorageKeys, value: T) {
        userDefaults.set(value, forKey: forKey.rawValue)
    }

    func deleteObject(forKey: PersistentStorageKeys) {
        userDefaults.removeObject(forKey: forKey.rawValue)
    }

    func readEncodableObject<Value: Sendable>(forKey: PersistentStorageKeys, castTo type: Value.Type) throws -> Value where Value: Decodable {
        let data = userDefaults.data(forKey: forKey.rawValue) ?? Data()
        let decoder = JSONDecoder()
        do {
            let object = try decoder.decode(type, from: data)
            return object
        } catch {
            throw ObjectSavableError.unableToDecode
        }
    }

    func saveEncodableObject<Value: Sendable>(forKey: PersistentStorageKeys, _ value: Value) throws where Value: Encodable {
        let encoder = JSONEncoder()
        do {
            let data = try encoder.encode(value)
            userDefaults.set(data, forKey: forKey.rawValue)
        } catch {
            throw ObjectSavableError.unableToEncode
        }
    }
}

extension UserDefaultsManager {
    enum ObjectSavableError: String, LocalizedError {
        case unableToEncode = "Unable to encode object into data"
        case noValue = "No data object found for the given key"
        case unableToDecode = "Unable to decode object into given type"

        var errorDescription: String? {
            rawValue
        }
    }
}

extension UserDefaultsManager {
    // MARK: - clearAllData

    func clearAllData() {}
}
