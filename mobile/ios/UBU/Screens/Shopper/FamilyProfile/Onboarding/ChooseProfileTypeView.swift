//
//  ChooseProfileTypeView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 05/06/2025.
//

import SwiftUI

struct ChooseProfileTypeView: View {
    let selectedRelation: ProfileRelationship
    
    // MARK: - State
    @State private var selectedType: ProfileType?
    @State private var openRegisterProfileView: Bool = false
        
    var body: some View {
        VStack(spacing: 20) {
            
            BackButton()
            
            ForEach(ProfileType.allCases) { type in
                let isSelected = (selectedType == type)
                Button {
                    selectedType = type
                } label: {
                    HStack {
                        Image(type.image)
                        Text(type.displayName)
                            .font(UBUFonts.manropeBold(withSize: 14))
                            .foregroundStyle(.primaryColor)
                        
                        Spacer()
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(
                        isSelected
                        ? Color(hex: "#FFF6DD")
                        : Color.primaryColor.opacity(0.04),
                        in: RoundedRectangle(cornerRadius: 8)
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(
                                isSelected
                                ? Color(hex: "#FFC529")
                                : Color.primaryColor.opacity(0.1),
                                lineWidth: 1
                            )
                    )
                }
            }
            
            Spacer()
            
            Button(action: continueAndChooseProfileType) {
                Text("Continue")
                    .font(UBUFonts.manropeMedium(withSize: 16))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 44)
                    .background(.black)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            .padding()
        }
        .padding()
        .navigationDestination(isPresented: $openRegisterProfileView, destination: {
            if let type = selectedType {
                RegisterProfileView(relationship: selectedRelation, profileType: type)
                    .toolbar(.hidden)
            }
        })
    }
    
    private func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
    
    private func continueAndChooseProfileType() {
        openRegisterProfileView.toggle()
    }
}

#Preview {
    ChooseProfileTypeView(selectedRelation: .husband)
}
