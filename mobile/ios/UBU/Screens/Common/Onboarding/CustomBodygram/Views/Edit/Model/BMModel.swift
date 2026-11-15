//
//  BMModel.swift
//  UBU
//
//  Created by Irtaza Fiaz on 23/05/2025.
//

import SwiftUI

struct MeasurementPosition: Identifiable {
    let key: String       // matches your BMResponse.measurements.name
    let title: String     // what to display in the box
    let x, y: CGFloat     // relative position (0…1)
    
    // Conform to Identifiable
    var id: String { key }
}

struct EditMeasurementPositions {
    /// All the default positions you had in your tuple array
    static let layout: [MeasurementPosition] = [
        .init(key: "upperArmGirthR", title: "Upper Arm", x: 0.2, y: 0.15),
        .init(key: "bustGirth",      title: "Bust",      x: 0.8, y: 0.15),
        .init(key: "thighGirthR",    title: "Thigh",     x: 0.2, y: 0.50),
        .init(key: "waistGirth",     title: "Waist",     x: 0.8, y: 0.50),
        .init(key: "calfGirthR",     title: "Calf",      x: 0.2, y: 0.85),
        .init(key: "hipGirth",       title: "Hip",       x: 0.8, y: 0.85)
    ]
    
    /// You can still keep your helper if you like:
    static func getPositions(using scan: BMResponse) -> [(title: String, value: String?, x: CGFloat, y: CGFloat)] {
        layout.map { entry in
            let mm = Double(scan.getMeasurementValue(key: entry.key)?.value ?? 0)
            let inches = mm / 25.4
            let formatted = String(format: "%.1f", inches)
            return (title: entry.title, value: formatted, x: entry.x, y: entry.y)
        }
    }
}

struct ManualMeasurementPositions {
    /// All the default positions you had in your tuple array
    static let layout: [MeasurementPosition] = [
        .init(key: "outseam",                     title: "Outseam",  x: 0.2, y: 0.15),
        .init(key: "thighGirth",                  title: "Thigh Girth", x: 0.8, y: 0.15),
        .init(key: "bellyWaistGirth",             title: "Belly Waist", x: 0.2, y: 0.40),
        .init(key: "bustGirth",                   title: "Bust", x: 0.8, y: 0.40),
        .init(key: "hipGirth",                    title: "Hip Girth", x: 0.2, y: 0.65),
        .init(key: "outerArmLengthR",             title: "Outer Arm", x: 0.8, y: 0.65),
        .init(key: "acrossBackShoulderWidth",     title: "Across Back Shoulder",x: 0.2, y: 0.90),
        .init(key: "waistGirth",                  title: "Waist Girth", x: 0.8, y: 0.90)
    ]
    
    
    /// You can still keep your helper if you like:
    static func getPositions(using scan: BMResponse) -> [(title: String, value: String?, x: CGFloat, y: CGFloat)] {
        layout.map { entry in
            let mm = Double(scan.getMeasurementValue(key: entry.key)?.value ?? 0)
            let inches = mm / 25.4
            let formatted = String(format: "%.1f", inches)
            return (title: entry.title, value: formatted, x: entry.x, y: entry.y)
        }
    }
}

// - MARK: - Bodygram Measurements Model -

struct BMResponse: Codable {
    var measurements: [BodyMeasurement]?
    var input: BMInputData?
    
    enum CodingKeys: String, CodingKey {
        case measurements
        case input = "input"
    }
    
    func getMeasurementValue(key: String) -> BodyMeasurement? {
        if let value = measurements?.first(where: { $0.name == key }) {
            return value
        }
        return nil
    }
}

// MARK: - Measurement Item
struct BodyMeasurement: Codable {
    let name: String?
    let unit: String?
    var value: Double?
    var data: String?
}


// MARK: - Input Data
struct BMInputData: Codable {
    var age: Int?
    var frontPhoto: String?
    var gender: String?
    var height: Int?
    var rightPhoto: String?
    var weight: Int?
    
    enum CodingKeys: String, CodingKey {
        case age
        case frontPhoto
        case gender
        case height
        case rightPhoto
        case weight
    }
}


//  MARK: - Manual Bodygram

struct ManualBM: Codable {
    var outseam: Int
    var thighGirth: Int
    var bellyWaistGirth: Int
    var bustGirth: Int
    var hipGirth: Int
    var outerArmLength: Int
    var acrossBackShoulderWidth: Int
    var waistGirth: Int
    
    enum CodingKeys: String, CodingKey {
        case outseam = "outseamR"
        case thighGirth = "thighGirthR"
        case bellyWaistGirth
        case bustGirth
        case hipGirth
        case outerArmLength = "outerArmLengthR"
        case acrossBackShoulderWidth
        case waistGirth
    }
}
extension BMResponse {
    static var mock: BMResponse {
        let measurements: [BodyMeasurement] = [
            BodyMeasurement(name: "upperArmGirthR", unit: "mm", value: 279),
            BodyMeasurement(name: "bustGirth", unit: "mm", value: 938),
            BodyMeasurement(name: "thighGirthR", unit: "mm", value: 582),
            BodyMeasurement(name: "waistGirth", unit: "mm", value: 789),
            BodyMeasurement(name: "calfGirthR", unit: "mm", value: 368),
            BodyMeasurement(name: "hipGirth", unit: "mm", value: 973),
            BodyMeasurement(name: "hipGirthR", unit: "mm", value: 973)
        ]
        let inputData = BMInputData(
            age: 30,
            frontPhoto: nil,
            gender: "male",
            height: 1800,
            rightPhoto: nil,
            weight: 70000
        )
        return BMResponse(measurements: measurements, input: inputData)
    }
    
    static var mockManual: BMResponse {
        let measurements: [BodyMeasurement] = [
            BodyMeasurement(name: "outseam", unit: "mm", value: 582),
            BodyMeasurement(name: "thighGirth", unit: "mm", value: 582),
            BodyMeasurement(name: "bellyWaistGirth", unit: "mm", value: 582),
            BodyMeasurement(name: "bustGirth", unit: "mm", value: 789),
            BodyMeasurement(name: "hipGirth", unit: "mm", value: 368),
            BodyMeasurement(name: "outerArmLengthR", unit: "mm", value: 973),
            BodyMeasurement(name: "acrossBackShoulderWidth", unit: "mm", value: 973),
            BodyMeasurement(name: "waistGirth", unit: "mm", value: 973)
        ]
        let inputData = BMInputData(
            age: 30,
            frontPhoto: nil,
            gender: "male",
            height: 1800,
            rightPhoto: nil,
            weight: 70000
        )
        return BMResponse(measurements: measurements, input: inputData)
    }
    
    static func emptyManualResponse() -> BMResponse {
        let measurements: [BodyMeasurement] = ManualMeasurementPositions.layout.map {
            BodyMeasurement(name: $0.key, unit:"mm",value: nil)
        }
        return BMResponse(
            measurements: measurements,
            input: BMInputData(age: nil, gender: nil, height: nil, weight: nil)
        )
    }
}
