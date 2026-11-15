//
//  LogManager.swift
//  UBU
//
//  Created by Irtaza Fiaz on 28/07/2025.
//

import Foundation
import os.log

// MARK: - LogType Enum

enum LogType: String {
    case success = "SUCCESS"
    case error = "ERROR"
    case info = "INFO"
    case warning = "WARNING"
    case debug = "DEBUG"
    
    var symbol: String {
        switch self {
            case .success: return "✅"
            case .error: return "❌"
            case .info: return "ℹ️"
            case .warning: return "⚠️"
            case .debug: return "🐞"
        }
    }
}

// MARK: - LogManager

final class LogManager {
    static let shared = LogManager()
    private init() {}
    
    var isLoggingEnabled: Bool = true
    
    private var isDebugBuild: Bool {
#if DEBUG
        return true
#else
        return false
#endif
    }
    
    /// Centralized log method
    func log(
        _ message: Any,
        type: LogType = .info,
        file: String = #file,
        function: String = #function,
        line: Int = #line
    ) {
        guard isLoggingEnabled else { return }
        
        let fileName = (file as NSString).lastPathComponent
        let timestamp = LogManager.timestamp()
        let fullMessage = """
        \(type.symbol) [\(type.rawValue)] \(timestamp)
        📄 \(fileName):\(line)
        🔧 \(function)
        📦 \(message)
        """
        
        if isDebugBuild {
            print(fullMessage)
        }
    }
    
    /// Formats the timestamp
    private static func timestamp() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss.SSS"
        return formatter.string(from: Date())
    }
}

extension LogManager {
    func prettyPrintJSON(
        _ data: Data,
        type: LogType = .debug,
        title: String? = nil,
        file: String = #file,
        function: String = #function,
        line: Int = #line
    ) {
        guard isLoggingEnabled else { return }
        
        do {
            let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers)
            prettyPrint(json, type: type, title: title, file: file, function: function, line: line)
        } catch {
            log("❌ Failed to parse JSON: \(error.localizedDescription)", type: .error, file: file, function: function, line: line)
            if let raw = String(data: data, encoding: .utf8) {
                log(raw, type: .error, file: file, function: function, line: line)
            }
        }
    }
}

extension LogManager {
    func prettyPrint(
        _ object: Any,
        type: LogType = .debug,
        title: String? = nil,
        file: String = #file,
        function: String = #function,
        line: Int = #line
    ) {
        guard isLoggingEnabled else { return }
        
        let formatted: String
        
        if JSONSerialization.isValidJSONObject(object),
           let data = try? JSONSerialization.data(withJSONObject: object, options: .prettyPrinted),
           let jsonString = String(data: data, encoding: .utf8) {
            formatted = jsonString
        } else {
            formatted = String(describing: object)
        }

        let finalMessage = """
        --------- \(title ?? type.rawValue.uppercased()) START ---------
        \(formatted)
        --------- \(title ?? type.rawValue.uppercased()) END -----------
        """
        
        log(finalMessage, type: type, file: file, function: function, line: line)
    }
}
