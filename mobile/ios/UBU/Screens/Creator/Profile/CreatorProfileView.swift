//
//  CreatorProfileView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 05/07/2025.
//

import SwiftUI

struct CreatorProfileView: View {
    @State private var openConnectedAccount: Bool = false
    
    var body: some View {
        ProfileView()
    }
    
    private var viewConnectedAccountButton: some View {
        Button(action: {
            openConnectedAccount.toggle()
        }) {
            Label("Connected Account", systemImage: "person.crop.circle.badge.plus")
        }
        .buttonStyle(PrimaryButtonStyle())
        .padding(.horizontal)
    }
}
