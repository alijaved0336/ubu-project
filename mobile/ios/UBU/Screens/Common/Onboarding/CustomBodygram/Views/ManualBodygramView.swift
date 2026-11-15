//
//  ManualBodygramView.swift
//  UBU
//
//  Created by Codinngcops on 18/07/2025.
//
import SwiftUI

struct ManualBodygramView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var dialogManager: DialogManager
    @EnvironmentObject var viewModel: BodygramMeasurementVM
    
    @State private var isLoading: Bool = true
    @State private var openSurveyView: Bool = false
    @State private var openCreatorSurveyView: Bool = false
    private let feetRange = Array(2...8)
    private let inchRange = Array(0...11)
    @State var bodyMeasurements: BMResponse = BMResponse.emptyManualResponse()
    
    var body: some View {
        VStack(alignment: .leading) {
            UBUTopNavbar()
                .padding(.horizontal, 10)
            
            ManualBodyMeasurementsView(bodyMeasurements: $bodyMeasurements)
            
            Button(action: navigate) {
                Text("Save Measurements")
                    .font(UBUFonts.manropeMedium(withSize: 16))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 44)
                    .background(.black)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            .padding()
            
        }
        .toolbar(.hidden)
        .navigationDestination(isPresented: $openSurveyView, destination: {
            SurveyView(shouldLoadAllQuestions: false)
                .toolbar(.hidden)
        })
        .navigationDestination(isPresented: $openCreatorSurveyView, destination: {
            CreatorOnboardingIntroView(shouldLoadAllQuestions: false)
                .toolbar(.hidden)
        })
    }
    
    
    
    private func navigate() {
        func getMeasurementString(key: String) -> String {
            return String(format: "%.0f", bodyMeasurements.getMeasurementValue(key: key)?.value ?? 0.0)
        }
    
        if let validationError = validateFields() {
            dialogManager.showNotification(title: "Incomplete Information", message: validationError)
            return
        }
                
        guard let lbs = Double(viewModel.selectedWeightIndex), lbs >= 0 else {
            return
        }
        let weightGr = Int(lbs.lbsToGrams)
        let feet = Int(Constants.heightFeetOptions[viewModel.selectedHeightFeetIndex]) ?? 0
        let inches = (viewModel.selectedHeightInchesIndex >= 0 ? inchRange[viewModel.selectedHeightInchesIndex] : 0)
        let heightMm = Utilities.convertFeetInchesToMM(feet: feet, inches: inches)
        
        guard let age = Int(viewModel.selectedAgeIndex), (1...100).contains(age) else {
            return
        }
        let manualBodygramMeasurements = ApiRequest.ManualBodygramRequest(
            gender: viewModel.selectedGenderValue,
            age:String(age),
            height: heightMm ?? 0,
            weight: weightGr,
            outseam: getMeasurementString(key: "outseam"),
            thighGirth: getMeasurementString(key: "thighGirth"),
            bellyWaistGirth: getMeasurementString(key: "bellyWaistGirth"),
            bustGirth: getMeasurementString(key: "bustGirth"),
            hipGirth: getMeasurementString(key: "hipGirth"),
            outerArm: getMeasurementString(key: "outerArmLengthR"),
            acrossBack: getMeasurementString(key: "acrossBackShoulderWidth"),
            waistGirth: getMeasurementString(key: "waistGirth")
        )
        
        if StateManager.shared.userRole == .influencer
        {
            NetworkService.shared.saveManualMeasurementsCreator(measurements: manualBodygramMeasurements) { result in
                switch result {
                case .success(_):
                    StateManager.shared.updateRoute(route: .creatorSurvey)
                case .failure(let failure):
                    print(failure)
                }
            }
        }
        else
        {
            NetworkService.shared.saveManualMeasurements(measurements: manualBodygramMeasurements) { result in
                switch result {
                case .success(_):
                    StateManager.shared.updateRoute(route: .shopperSurvey)
                case .failure(let failure):
                    print(failure)
                }
            }
            
        }
    }
    
    private func getMeasurementValue(key: String) -> BodyMeasurement? {
        if let value = bodyMeasurements.measurements?.first(where: { $0.name == key }) {
            return value
        }
        return nil
    }
    
    private func validateFields() -> String? {
        guard let measurements = bodyMeasurements.measurements, !measurements.isEmpty else {
            return "Please fill in your body measurements."
        }
        for m in measurements {
            guard let val = m.value, val > 0 else {
                let label = m.name ?? "a measurement"
                return "Please enter a valid value for \(label)."
            }
        }

        return nil
    }

    
}


#Preview {
    ManualBodygramView(bodyMeasurements: BMResponse.emptyManualResponse())
}

struct ManualBodyMeasurementsView: View {
    @Binding var bodyMeasurements: BMResponse
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Text("Please enter your measurements manually:")
                    .font(UBUFonts.manropeBold(withSize: 16)).foregroundColor(.primaryColor)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.leading)
                EditMeasurementDiagram(bodyMeasurements: $bodyMeasurements, mode: .manual)
            }
            .padding(.bottom, 100)
        }
        .padding(.top)
    }
    
    // MARK: - Computed Properties
    private var formattedMeasurements: [(category: String, values: [(name: String, value: String)])] {
        let mapped: [(name: String, value: String)] = bodyMeasurements.measurements?.compactMap {
            guard let name = $0.name, let value = $0.value else { return (name: "", value: String(format: "%.1f", 0.0)) }
            let inches = Double(value) / 25.4
            return (name: name, value: String(format: "%.1f", inches))
        } ?? []
        
        return [("Body Measurements", mapped)]
    }
}
