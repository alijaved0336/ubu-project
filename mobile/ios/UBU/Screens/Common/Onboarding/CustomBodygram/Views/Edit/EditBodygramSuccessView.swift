//
//  CustomBodygramEditView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 21/05/2025.
//

import SwiftUI

struct EditBodygramSuccessView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var dialogManager: DialogManager
    
    @State private var isLoading: Bool = true
    @State private var openSurveyView: Bool = false
    @State private var openCreatorSurveyView: Bool = false
    
    @State var bodyMeasurements: BMResponse?
    
    var body: some View {
        VStack {
            BackButton()
                .padding(.horizontal)
            
            if isLoading {
                Spacer()
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle())
                    .padding()
                Spacer()
            } else if let bodyMeasurements = $bodyMeasurements.unwrap() {
                
                EditBodyMeasurementsView(bodyMeasurements: bodyMeasurements)
                
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
            } else {
                Spacer()
                Text("Results not found")
                    .font(.headline)
                    .foregroundColor(.gray)
                    .padding()
                Spacer()
            }
        }
        .onAppear(perform: fetchBodyMeasurements)
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
    
    // MARK: - Network Call
    
    private func fetchBodyMeasurements() {
        isLoading = true
        NetworkService.shared.fetchBodyMeasurements() { result in
            DispatchQueue.main.async {
                isLoading = false
                switch result {
                case .success(let success):
                    self.bodyMeasurements = success
                case .failure:
                    NSLog("Unable to fetch scan results")
                }
            }
        }
    }
    
    private func navigate() {
        guard let response = bodyMeasurements else {
            dialogManager.showError(title: "Action Required", message: "No measurements to save.")
            return
        }
        
        if let validationError = validateFields() {
            dialogManager.showNotification(title: "Incomplete Information", message: validationError)
            return
        }
        
        NetworkService.shared.saveBodyMeasurements(measurements: response) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(_):
                    dismiss()
                case .failure(let failure):
                    print(failure)
                }
            }
            
        }
    }
    
    private func getMeasurementValue(key: String) -> BodyMeasurement? {
        if let bmr = bodyMeasurements {
            if let value = bmr.measurements?.first(where: { $0.name == key }) {
                return value
            }
        }
        return nil
    }
    
    private func validateFields() -> String? {
        
        guard let input = bodyMeasurements?.input else {
            return "Please complete your basic info (age, gender, height, weight)."
        }
        guard let age = input.age else {
            return "Please enter your age."
        }
        guard (1...100).contains(age) else {
            return "Age must be between 1 and 100."
        }
        guard let height = input.height, height > 0 else {
            return "Please enter a valid height."
        }
        guard input.weight != nil else {
            return "Please enter your weight."
        }
        guard (20...500).contains(Utilities.convertWeightToLbs(input.weight) ?? 0) else {
            return "Weight must be between 20 and 500."
        }

        guard let measurements = bodyMeasurements?.measurements, !measurements.isEmpty else {
            return "Please fill in your body measurements."
        }
        
        for m in measurements {
            if Constants.requiredFieldsEditBgView.contains(m.name ?? "") {
                guard let val = m.value, val > 0 else {
                    let label = m.name ?? "a measurement"
                    return "Please enter a valid value for \(label)."
                }
            }
        }
        
        return nil
    }
}


#Preview {
    EditBodygramSuccessView(bodyMeasurements: BMResponse.mock)
}

struct EditBodyMeasurementsView: View {
    @Binding var bodyMeasurements: BMResponse
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Text("Body Measurements")
                    .font(UBUFonts.manropeBold(withSize: 16)).foregroundColor(.primaryColor)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.leading)
                EditMeasurementDiagram(bodyMeasurements: $bodyMeasurements, mode: .edit)
                EditGeneralInfoView(bodyMeasurements: $bodyMeasurements)
                EditMeasurementGrid(bodyMeasurements: $bodyMeasurements)
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
