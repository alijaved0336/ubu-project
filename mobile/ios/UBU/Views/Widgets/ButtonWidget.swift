//
//  ButtonWidget.swift
//  UBU
//
//  Created by Irtaza Fiaz on 12/06/2025.
//

import SwiftUI

// MARK: – Custom Button Styles

enum ButtonSize {
    case regular
    case small
}

/// Filled primary button (e.g. “Continue to Store”)
struct PrimaryButtonStyle: ButtonStyle {
    var size: ButtonSize = .regular

    func makeBody(configuration: Configuration) -> some View {
        let fontSize: CGFloat = size == .regular ? 16 : 14
        let verticalPadding: CGFloat = size == .regular ? 12 : 10
        let cornerRadius: CGFloat = size == .regular ? 12 : 8

        return configuration.label
            .font(UBUFonts.manropeMedium(withSize: fontSize))
            .foregroundColor(.white)
            .padding(.vertical, verticalPadding)
            .padding(.horizontal)
            .frame(maxWidth: .infinity)
            .background(.primaryColor)
            .cornerRadius(cornerRadius)
            .shadow(
                color: .black.opacity(configuration.isPressed ? 0.1 : 0.2),
                radius: configuration.isPressed ? 2 : 5,
                x: 0, y: configuration.isPressed ? 1 : 3
            )
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0)
    }
}


/// Outlined secondary button (e.g. “Request to Buy”)
struct SecondaryButtonStyle: ButtonStyle {
    var size: ButtonSize = .regular

    func makeBody(configuration: Configuration) -> some View {
        let fontSize: CGFloat = size == .regular ? 16 : 14
        let verticalPadding: CGFloat = size == .regular ? 12 : 10
        let cornerRadius: CGFloat = size == .regular ? 12 : 8

        return configuration.label
            .font(UBUFonts.manropeBold(withSize: fontSize))
            .foregroundColor(.primaryColor)
            .padding(.vertical, verticalPadding)
            .padding(.horizontal)
            .frame(maxWidth: .infinity)
            .background(Color.white)
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(Color.primaryColor.opacity(0.5), lineWidth: 1)
            )
            .cornerRadius(cornerRadius)
            .shadow(
                color: .black.opacity(configuration.isPressed ? 0.05 : 0.1),
                radius: configuration.isPressed ? 1 : 3,
                x: 0, y: configuration.isPressed ? 0 : 2
            )
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0)
    }
}


extension View {
    func styledButton(type: StyledButtonType = .primary) -> some View {
        let (bg, fg, strokeColor): (Color, Color, Color?) = {
            switch type {
            case .primary:
                return (Color.primaryColor, Color.white, nil)
            case .stroke:
                return (Color(.white), Color.primaryColor, Color.primaryColor)
            case .danger:
                return (Color(hex: "#8B0000"), Color.white, nil)
            }
        }()

        return self
            .font(.system(size: 15, weight: .semibold))
            .foregroundColor(fg)
            .frame(maxWidth: .infinity)
            .frame(height: 44)
            .background(bg)
            .cornerRadius(8)
            .overlay(
                strokeColor != nil ?
                RoundedRectangle(cornerRadius: 8).stroke(strokeColor!, lineWidth: 1) : nil
            )
    }
}


enum StyledButtonType {
    case primary
    case stroke
    case danger
}
