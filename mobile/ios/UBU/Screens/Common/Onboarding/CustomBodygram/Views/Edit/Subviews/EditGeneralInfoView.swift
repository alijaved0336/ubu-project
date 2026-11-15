//
//  EditGeneralInfoView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 23/05/2025.
//

import SwiftUI

struct EditGeneralInfoView: View {
    @Binding var bodyMeasurements: BMResponse
    @State private var isPresentingSheet = false

    var body: some View {
        HStack(spacing: 0) {
            Text(heightString)
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundColor(.primaryColor)

            Spacer()

            Text("\(Utilities.convertWeightToLbs(bodyMeasurements.input?.weight) ?? 0)")
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundColor(.primaryColor)
            Text(" lb")
                .font(UBUFonts.manropeSemibold(withSize: 10))
                .foregroundColor(.primaryColor.opacity(0.4))

            Spacer()

            Text("\(bodyMeasurements.input?.age ?? 0)")
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundColor(.primaryColor)
            Text(" yrs")
                .font(UBUFonts.manropeSemibold(withSize: 10))
                .foregroundColor(.primaryColor.opacity(0.4))

            Spacer()

            Text(bodyMeasurements.input?.gender?.capitalized ?? "")
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundColor(.primaryColor)
        }
        .padding()
        .background(StyledBackground())
        .padding(.horizontal)
        .onTapGesture { isPresentingSheet = true }
        .sheet(isPresented: $isPresentingSheet) {
            EditGeneralInfoSheet(
                original: $bodyMeasurements,
                isPresented: $isPresentingSheet
            )
            .presentationDetents([.medium, .large])
            .presentationDragIndicator(.visible)
        }
    }

    private var heightString: String {
        guard let hd = Utilities.convertHeightToFeetInches(bodyMeasurements.input?.height ?? 0) else {
            return "0'0\""
        }
        return "\(hd.feet)'\(hd.inches)\""
    }
}
