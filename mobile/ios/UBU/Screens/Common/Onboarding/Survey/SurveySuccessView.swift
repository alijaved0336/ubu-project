//
//  SurveySuccessView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 08/08/2024.
//

import SwiftUI

struct SurveySuccessView: View {
    var body: some View {
        VStack {
            Image("survey-success")
            Text("Survey Completed")
                .font(UBUFonts.manropeBold(withSize: 20))
                .foregroundStyle(.primaryColor)
        }
    }
}

#Preview {
    SurveySuccessView()
}
