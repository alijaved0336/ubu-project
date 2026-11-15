//
//  Delete.swift
//  UBU
//
//  Created by Irtaza Fiaz on 13/03/2025.
//

import SwiftUI

struct Deletea: View {
    let basicInfo = ("177.8 cm", "68.04 kg", "25 years old", "Male")
        
        let healthIndicator = (waistToHipRatio: "0.89", riskCategory: "Low risk")

        let measurements: [(category: String, values: [(name: String, value: String)])] = [
            ("Health Indicator", [
                ("Waist-to-Hip Ratio", "0.89")
            ]),
            ("Body Measurements", [
                ("Waist", "82.8 cm"), ("Bust", "93.6 cm"), ("Upper Arm", "28.8 cm"), ("Hip", "93.1 cm"),
                ("Thigh", "55.7 cm"), ("Calf", "36.2 cm"), ("Neck", "37 cm"), ("Neck Base", "41.4 cm"),
                ("Shoulder Width", "47 cm"), ("Wrist", "18.5 cm"), ("Sleeve Length", "81.1 cm"),
                ("Outer Arm Length", "59.4 cm"), ("Under Bust", "86.9 cm"), ("Belly Waist", "84.3 cm"),
                ("Back Length", "44.7 cm")
            ]),
            ("Lower Body & Legs", [
                ("Top Hip", "88.2 cm"), ("Mid Thigh", "48 cm"), ("Knee", "38.5 cm"),
                ("Outside Leg Length", "110.6 cm"), ("Inside Leg Length", "75.6 cm"),
                ("Inside Leg Height", "82.3 cm"), ("Outer Ankle Height", "6.9 cm"),
                ("Outseam", "103.4 cm"), ("Full Body Length", "156.1 cm")
            ])
        ]

        var body: some View {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Basic Info
                    HStack {
                        ForEach([basicInfo.0, basicInfo.1, basicInfo.2, basicInfo.3], id: \.self) { info in
                            Text(info)
                                .font(.headline)
                                .padding(.horizontal, 8)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(RoundedRectangle(cornerRadius: 10).fill(Color.gray.opacity(0.2)))

                    // Health Indicator
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Health Indicator")
                            .font(.title2).bold()
                        Text("Waist-to-Hip Ratio: \(healthIndicator.waistToHipRatio)")
                            .font(.headline)
                        Text("Risk Level: \(healthIndicator.riskCategory)")
                            .foregroundColor(.green)
                    }
                    .padding()
                    .background(RoundedRectangle(cornerRadius: 10).fill(Color.gray.opacity(0.2)))

                    // Body Measurements Grid
                    ForEach(measurements, id: \.category) { section in
                        VStack(alignment: .leading) {
                            Text(section.category)
                                .font(.title2).bold()
                                .padding(.vertical, 5)

                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                                ForEach(section.values, id: \.name) { item in
                                    VStack {
                                        Text(item.name)
                                            .font(.subheadline)
                                        Text(item.value)
                                            .font(.title3).bold()
                                    }
                                    .frame(maxWidth: .infinity, minHeight: 80)
                                    .padding()
                                    .background(RoundedRectangle(cornerRadius: 10).fill(Color.gray.opacity(0.2)))
                                }
                            }
                        }
                        .padding(.horizontal)
                    }
                }
                .padding(.bottom, 20)
            }
            .padding(.top)
        }
}

#Preview {
    Deletea()
}
