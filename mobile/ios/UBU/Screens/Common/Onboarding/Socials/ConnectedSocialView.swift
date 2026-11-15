//
//  ConnectedSocialView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 01/07/2024.
//

import SwiftUI
import Shimmer

struct ConnectedSocialView: View {
    
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var appState: StateManager
    
    @State private var openTabbedView: Bool = false
    
    private var gradientColors = [
        Color(uiColor: UIColor.systemGray5),
        Color(uiColor: UIColor.systemGray6),
        Color(uiColor: UIColor.systemGray5)
    ]
    
    var body: some View {
        VStack(alignment: .leading) {
            HStack {
                Button {
                    dismiss()
                } label: {
                    Image("arrow-left")
                }
                Spacer()
            }
            
            Text("Connect your Social Media")
                .font(UBUFonts.manropeMedium(withSize: 34))
                .foregroundStyle(.primaryColor)
                .padding(.top, 20)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.bottom, 1)
                .lineLimit(2)
            
            Text("Connect Your social accounts, and allow access to your media and files")
                .font(UBUFonts.manropeMedium(withSize: 14))
                .foregroundStyle(.primaryColor.opacity(0.7))
                .frame(maxWidth: .infinity, alignment: .leading)
            
            Text("TikTok Gallery")
                .font(UBUFonts.manropeBold(withSize: 16))
                .foregroundStyle(.primaryColor)
                .padding(.top, 20)
            
            HStack {
                shimmerBox
                Spacer()
                shimmerBox
                Spacer()
                shimmerBox
            }
            
            Text("Facebook Gallery")
                .font(UBUFonts.manropeBold(withSize: 16))
                .foregroundStyle(.primaryColor)
                .padding(.top, 10)
            HStack {
                shimmerBox
                Spacer()
                shimmerBox
                Spacer()
                shimmerBox
            }
            
            Text("Instagram Gallery")
                .font(UBUFonts.manropeBold(withSize: 16))
                .foregroundStyle(.primaryColor)
                .padding(.top, 10)
            
            HStack {
                shimmerBox
                Spacer()
                shimmerBox
                Spacer()
                shimmerBox
            }
            
            Spacer()
            
            Button(action: { StateManager.shared.updateRoute(route: .tabview) }) {
                Text("Next")
                    .font(UBUFonts.manropeBold(withSize: 16))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(.black)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            
        }
        .padding()
        .navigationDestination(isPresented: $openTabbedView, destination: {
            TabbedView()
                .toolbar(.hidden)
        })
    }
    
    var shimmerBox: some View {
        RoundedRectangle(cornerRadius: 8)
            .frame(width: 100, height: 100)
            .foregroundColor(Color(hex: "FFFFFF").opacity(0.1))
            .shimmering(
                gradient: Gradient(
                    colors: [
                        Color(hex: "DDDDDD"),
                        Color(hex: "FAFAFA"),
                        Color(hex: "DDDDDD")
                    ]), bandSize: 0.9, mode: .overlay(blendMode: .darken))
            .background(Color(hex: "DDDDDD").opacity(0.9))
            .clipShape(RoundedRectangle(cornerRadius: 8))
    }
    
}

#Preview {
    ConnectedSocialView()
}
