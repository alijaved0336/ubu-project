//
//  ConnectSocialView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 01/07/2024.
//

import SwiftUI

struct ConnectSocialView: View {
    @Environment(\.dismiss) var dismiss
    @State private var openConnectedSocials = false
    @State private var openTabbedView = false
    
    var body: some View {
        VStack(alignment: .leading) {
            
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
            
            
            
            HStack {
                Image("tiktok-logo")
                Text("Connect with tiktok")
                Spacer()
            }
            .padding()
            .frame(maxWidth: .infinity)
            .background (
                RoundedRectangle(cornerRadius: 8).fill(Color(hex: "FAFAFA"))
                    .stroke(Color(hex: "EBEBEB"), lineWidth: 1)
            )
            .padding(.top, 30)
            
            HStack {
                Image("facebook-logo")
                Text("Connect with Facebook")
                Spacer()
            }
            .padding()
            .frame(maxWidth: .infinity)
            .background (
                RoundedRectangle(cornerRadius: 8).fill(Color(hex: "FAFAFA"))
                    .stroke(Color(hex: "EBEBEB"), lineWidth: 1)
            )
            .padding(.top, 10)
            
            HStack {
                Image("instagram-logo")
                Text("Connect with Instagram")
                Spacer()
            }
            .padding()
            .frame(maxWidth: .infinity)
            .background (
                RoundedRectangle(cornerRadius: 8).fill(Color(hex: "FAFAFA"))
                    .stroke(Color(hex: "EBEBEB"), lineWidth: 1)
            ).padding(.top, 10)
            
            Button {
                openConnectedSocials.toggle()
            } label: {
                Text("Next")
                    .font(UBUFonts.manropeBold(withSize: 16))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(.black)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }.padding(.top, 20)
            
            Button {
                openConnectedSocials.toggle()
            } label: {
                Text("Skip For Now >>")
                    .font(UBUFonts.manropeSemibold(withSize: 14))
                    .foregroundStyle(.primaryColor.opacity(0.6))
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding(.top, 10)
            }
            
            Spacer()
            
        }
        .padding()
        .navigationDestination(isPresented: $openConnectedSocials, destination: {
            ConnectedSocialView()
                .toolbar(.hidden)
        })
        .navigationDestination(isPresented: $openTabbedView, destination: {
            TabbedView()
                .toolbar(.hidden)
        })
    }
}

#Preview {
    ConnectSocialView()
}
