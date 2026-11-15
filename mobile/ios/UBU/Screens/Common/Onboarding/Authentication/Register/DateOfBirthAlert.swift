//
//  DateOfBirthAlert.swift
//  UBU
//
//  Created by Codinngcops on 30/07/2025.
//

import Foundation
import SwiftUI

struct DateOfBirthAlert: View {
    @Environment(\.colorScheme) var colorScheme
    @ObservedObject var appState = StateManager.shared
    @State private var selectedProfileId: Int?
    @State private var showDatePicker = false
    @State private var openChooseRelationView: Bool = false
    @State private var dateOfBirth = Date()
    @State private var dateOfBirthError: LocalizedStringKey?

    var body: some View {
        ZStack {
            NavigationStack {
                ZStack {
                    Color.black.opacity(colorScheme == .dark ? 0.4 : 0.5)
                        .ignoresSafeArea()
                    
                    VStack(alignment: .center) {
                        HeaderRow()
                        
                        Text("Please enter date of birth:")
                            .font(UBUFonts.manropeMedium(withSize: 16))
                            .foregroundStyle(.primaryColor)
                            .padding(.horizontal)
                            .multilineTextAlignment(.center)
                        
                        DateInputView(
                               selectedDate: $dateOfBirth,
                               errorMessage: $dateOfBirthError,
                               label: "",
                               isDisabled: false
                           )
                        .padding(14)
                        actionButtons
                            .padding(.bottom)
                    }
                    .background(Color.white.cornerRadius(20.0))
                    .padding(.horizontal)
                }
            }
        }
    }
    
    private func dateOfBirthHandler() {
        NetworkService.shared.updateDateOfBirth(dateOfBirth: .init(dob: Utilities.dateToISOString(dateOfBirth))) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let response):
//                    StateManager.shared.updateDateOfBirth(dateOfBirth: response.data?.dateOfBirth)
                    if let profile =  StateManager.shared.userProfile {
                        LoginManager.shared.routeAfterSwitch(profile:profile)
                    }
                case .failure:
                    NSLog("Error occurred while fetching sub profiles")
                }
            }
        }
    }
    
    private struct HeaderRow: View {
        var body: some View {
            HStack {
                Image(systemName: "calendar")
                    .resizable()
                    .frame(width: 50, height: 50)
                    .padding(12)
                    .padding(.bottom, 2)
                    .foregroundColor(.red)
            }
        }
    }
    
    @ViewBuilder
    private var actionButtons: some View {
        VStack (spacing: 10) {
            Button {
                dateOfBirthHandler()
            } label: {
                Text("Continue")
            }
            .buttonStyle(PrimaryButtonStyle())
            .padding(10)
        }
    }
}

#Preview {
    DateOfBirthAlert()
}
