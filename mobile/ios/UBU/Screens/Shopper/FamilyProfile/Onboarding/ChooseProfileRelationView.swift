//
//  CreateProfileOptionsView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 04/06/2025.
//

import SwiftUI

struct ChooseProfileRelationView: View {
    
    // MARK: - State
    @State private var selectedRelationship: ProfileRelationship?
    @State private var openRegisterProfileView: Bool = false
    @State private var openProfileTypeView: Bool = false
    
    private let columns = Array(repeating: GridItem(.flexible()), count: 2)
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                BackButton()
                
                ForEach(ProfileRelationship.allCases) { relation in
                    let isSelected = (selectedRelationship == relation)
                    
                    Button {
                        selectedRelationship = relation
                    } label: {
                        HStack {
                            Image(relation.image)
                            Text(relation.displayName)
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
            .navigationDestination(isPresented: $openProfileTypeView, destination: {
                if let relationship = selectedRelationship {
                    ChooseProfileTypeView(selectedRelation: relationship)
                        .toolbar(.hidden)
                }
            })
        }

    }
    
    private func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
    
    private func continueAndChooseProfileType() {
        openProfileTypeView.toggle()
    }
}

#Preview {
    ChooseProfileRelationView()
}
