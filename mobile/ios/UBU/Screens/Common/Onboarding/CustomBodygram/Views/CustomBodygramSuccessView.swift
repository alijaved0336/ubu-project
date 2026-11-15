//
//  CustomBodygramSuccessView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 10/03/2025.
//

import SwiftUI

struct CustomBodygramSuccessView: View {
    let scanId: String
    @State private var scanResult: BodygramScanResponse?
    @State private var isLoading: Bool = true
    @State private var openSurveyView: Bool = false
    @State private var openCreatorSurveyView: Bool = false
    
    var body: some View {
        VStack {
            UBUTopNavbar()
                .padding(.horizontal)
            
            if isLoading {
                Spacer()
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle())
                    .padding()
                Spacer()
            } else if let scanResponse = scanResult {
                BodyMeasurementsView(scanResponse: scanResponse)
                
                Button(action: navigate) {
                    Text("Proceed")
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
                
                Button(action: navigate) {
                    Text("Proceed")
                        .font(UBUFonts.manropeMedium(withSize: 16))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background(.black)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }
                .padding()
                
            }
        }
        .onAppear(perform: fetchScanResults)
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
    private func fetchScanResults() {
        isLoading = true
        NetworkService.shared.getBodygramScanResults(scanId: scanId) { result in
            DispatchQueue.main.async {
                isLoading = false
                switch result {
                case .success(let success):
                    scanResult = success
                case .failure:
                    NSLog("Unable to fetch scan results")
                }
            }
        }
    }
    
    private func navigate() {
        if StateManager.shared.userRole == .influencer {
            NetworkService.shared.fetchCreatorProfile { result in
                switch result {
                case .success(let profile):
                    UserDefaults.standard.set(false, forKey: "didLogoutManually")
                    StateManager.shared.updateUserProfile(with: profile)
                    if !(profile.isSurveyDone ?? false) {
                        openCreatorSurveyView.toggle()
                    } else {
                        StateManager.shared.updateRoute(route: .tabview)
                    }
                case .failure(let error):
                    print(error)
                }
            }
        } else {
            StateManager.shared.updateRoute(route: .shopperSurvey)
        }
    }
}


#Preview {
    CustomBodygramSuccessView(scanId: "scan_JpMNMg0ne1hiXBi41Z90K")
}

// MARK: - Body Measurements View
struct BodyMeasurementsView: View {
    let scanResponse: BodygramScanResponse
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Text("Body Measurements")
                    .font(UBUFonts.manropeBold(withSize: 16)).foregroundColor(.primaryColor)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.leading)
                MeasurementDiagram(scanResponse: scanResponse)
                GeneralInfoView(scanResponse: scanResponse)
                MeasurementGrid(measurements: formattedMeasurements)
            }
            .padding(.bottom, 20)
        }
        .padding(.top)
    }
    
    // MARK: - Computed Properties
    private var formattedMeasurements: [(category: String, values: [(name: String, value: String)])] {
        let mapped: [(name: String, value: String)] = scanResponse.entry?.measurements?.compactMap {
            guard let name = $0.name, let value = $0.value else { return nil }
            let inches = value / 25.4
            return (name: name, value: String(format: "%.1f", inches))
        } ?? []
        
        return [("Body Measurements", mapped)]
    }

}

// MARK: - Measurement Diagram
struct MeasurementDiagram: View {
    let scanResponse: BodygramScanResponse
    
    var body: some  View {
        ZStack {
            Avatar3DView(base64OBJ: scanResponse.entry!.avatar!.data!)
                .background(StyledBackground())
            GeometryReader { geometry in
                let size = geometry.size
                let positions = MeasurementPositions.getPositions(using: scanResponse)
                
                ForEach(positions, id: \ .title) { pos in
                    MeasurementBox(title: pos.title, value: pos.value)
                        .position(x: size.width * pos.x, y: size.height * pos.y)
                }
            }
        }
        .frame(height: 362)
        .background(StyledBackground())
        .padding(.horizontal)
    }
}

// MARK: - General Info View
struct GeneralInfoView: View {
    let scanResponse: BodygramScanResponse
    
    var body: some View {
        HStack(spacing: 0) {
            Text("\(Utilities.getFeetAndInches(height: scanResponse.entry?.input?.photoScan?.height ?? 0))")
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundColor(.primaryColor)
            
            Spacer()
            
            Text("\(Utilities.convertWeightToLbs(scanResponse.entry?.input?.photoScan?.weight) ?? 0)")
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundColor(.primaryColor)
            Text(" lb")
                .font(UBUFonts.manropeSemibold(withSize: 10)).foregroundColor(.primaryColor.opacity(0.4))
            
            Spacer()
            
            Text("\(scanResponse.entry?.input?.photoScan?.age ?? 0)")
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundColor(.primaryColor)
            Text(" years old")
                .font(UBUFonts.manropeSemibold(withSize: 10)).foregroundColor(.primaryColor.opacity(0.4))
            Spacer()
            
            Text(scanResponse.entry?.input?.photoScan?.gender?.capitalized ?? "")
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundColor(.primaryColor)
        }
        .padding()
        .background(StyledBackground())
        .padding(.horizontal)
    }
}


// MARK: - Measurement Grid
struct MeasurementGrid: View {
    let measurements: [(category: String, values: [(name: String, value: String)])]
    
    var body: some View {
        ForEach(measurements, id: \ .category) { section in
            VStack(alignment: .leading) {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    ForEach(section.values, id: \ .name) { item in
                        BodyMeasurementBox(title: item.name, value: item.value)
                    }
                }
            }
            .padding(.horizontal)
        }
    }
}

// MARK: - Reusable Components
struct MeasurementBox: View {
    let title: String
    let value: String?
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(title).font(UBUFonts.manropeSemibold(withSize: 14)).foregroundColor(.primaryColor)
            HStack(spacing: 0) {
                Text(value ?? "-")
                    .font(UBUFonts.manropeSemibold(withSize: 14)).foregroundColor(.primaryColor)
                Text(" in")
                    .font(UBUFonts.manropeSemibold(withSize: 10)).foregroundColor(.primaryColor.opacity(0.4))
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .frame(width: 100, height: 60)
        .padding(.leading)
        .background(Color.white)
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .shadow(color: .primaryColor.opacity(0.2), radius: 1)
    }
}

struct BodyMeasurementBox: View {
    let title: String
    let value: String?
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(Constants.bodyMeasurementLabels[title] ?? "-").font(UBUFonts.manropeSemibold(withSize: 14)).foregroundColor(.primaryColor)
            HStack(spacing: 0) {
                Text(value ?? "-")
                    .font(UBUFonts.manropeExtraBold(withSize: 20)).foregroundColor(.primaryColor)
                Text(" in")
                    .font(UBUFonts.manropeSemibold(withSize: 10)).foregroundColor(.primaryColor.opacity(0.4))
                Spacer()
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            
        }
        .frame(height: 80)
        .frame(maxWidth: .infinity)
        .padding(.leading)
        .background(StyledBackground())
    }
}

struct InfoText: View {
    let text: String
    
    var body: some View {
        Text(text)
            .font(UBUFonts.manropeSemibold(withSize: 14))
            .foregroundColor(.primaryColor)
    }
}

struct StyledBackground: View {
    var body: some View {
        RoundedRectangle(cornerRadius: 10)
            .fill(Color.primaryColor.opacity(0.02))
            .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.primaryColor.opacity(0.04), lineWidth: 1))
    }
}

// MARK: - Extensions & Helpers
extension Int {
    var formattedHeight: String {
        let feet = self / 30
        let inches = Double(self % 30) / 2.54
        return "\(feet)'\(Int(inches))\""
    }
    
    var formattedWeight: String {
        "\(Int(Double(self) * 0.00220462))"
    }
}

struct MeasurementPositions {
    static func getPositions(using scanResponse: BodygramScanResponse) -> [(title: String, value: String?, x: CGFloat, y: CGFloat)] {
        return [
            ("Upper Arm", scanResponse.entry?.getValue(for: "upperArmGirthR"), 0.2, 0.15),
            ("Bust", scanResponse.entry?.getValue(for: "bustGirth"), 0.8, 0.15),
            ("Thigh", scanResponse.entry?.getValue(for: "thighGirthR"), 0.2, 0.5),
            ("Waist", scanResponse.entry?.getValue(for: "waistGirth"), 0.8, 0.5),
            ("Calf", scanResponse.entry?.getValue(for: "calfGirthR"), 0.2, 0.85),
            ("Hip", scanResponse.entry?.getValue(for: "hipGirth"), 0.8, 0.85)
        ]
    }
}

extension BodygramScanResponse.ScanEntry {
    func getValue(for key: String) -> String? {
        measurements?
            .first(where: { $0.name == key })?
            .value
            .map { String(format: "%.1f", $0 / 25.4) }
    }
}



