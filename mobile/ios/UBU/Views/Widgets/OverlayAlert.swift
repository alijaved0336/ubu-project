//
//  OverlayAlert.swift
//  UBU
//
//  Created by Irtaza Fiaz on 23/07/2024.
//

import Foundation
import SwiftUI

enum AlertType {
    case notification
    case confirmation
}

struct OverlayAlert: View {
    
    @Environment(\.colorScheme) var colorScheme
    @Binding var isPresented: Bool
    var alertType: AlertType
    
    let title: String
    let description: String
    let primaryAction: (() -> Void)?
    let secondaryAction: (() -> Void)?
    
    var body: some View {
        ZStack {
            Color.black.opacity(colorScheme == .dark ? 0.4 : 0.5)
                .ignoresSafeArea()
            VStack(spacing: 0) {
                Spacer()
                VStack(spacing: 0) {
                    
                    if alertType == .confirmation {
                        Image("warning-sign")
                            .padding(.top)
                    }
                    
                    Text(title)
                        .font(UBUFonts.manropeBold(withSize: 16))
                        .foregroundStyle(.primaryColor)
                        .padding(.horizontal, 40)
                        .multilineTextAlignment(.center)
                        .padding(.top, 10)
                        
                    
                    Text(description)
                        .font(UBUFonts.manropeSemibold(withSize: 14))
                        .foregroundStyle(.primaryColor.opacity(0.9))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                        .padding(.top, 10)
                    
                    Divider()
                        .padding(.top, 10)

                    actionButtons
                }
                .background( Color.white.cornerRadius(20.0) )
                .padding(.horizontal)
                
                Spacer()
            }
        }
    }
    
    @ViewBuilder
    private var actionButtons: some View {
        switch alertType {
        case .notification:
            Button {
                isPresented = false
                primaryAction?()
            } label: {
                Text("OK")
                    .font(UBUFonts.manropeBold(withSize: 16))
                    .foregroundStyle(.primaryColor)
                    .frame(maxWidth: .infinity)
            }
            .frame(height: 50)
        case .confirmation:
            HStack {
                Button {
                    isPresented = false
                    secondaryAction?()
                } label: {
                    Text("Cancel")
                        .font(UBUFonts.manropeBold(withSize: 16))
                        .foregroundStyle(.primaryColor)
                        .frame(maxWidth: .infinity)
                }
                Divider()
                Button {
                    isPresented = false
                    primaryAction?()
                } label: {
                    Text("Yes")
                        .font(UBUFonts.manropeBold(withSize: 16))
                        .foregroundStyle(.primaryColor)
                        .frame(maxWidth: .infinity)
                }
            }
            .frame(height: 60)
        }
    }
}

#Preview {
    OverlayAlert(
        isPresented: .constant(true),
        alertType: .notification,
        title: "Why Do I Need To Invite Classmates?",
        description: "Inviting classmates helps you stay connected and collaborate more effectively.",
        primaryAction: {
            NSLog("Primary action triggered")
        },
        secondaryAction: {
            NSLog("Secondary action triggered")
        }
    )
}
