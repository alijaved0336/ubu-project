//
//  PostActionModal.swift
//  UBU
//
//  Created by Irtaza Fiaz on 19/08/2024.
//

import SwiftUI

struct PostActionModal: View {
    @Binding var isPresented: Bool
    var buttonAction: (PostActions) -> ()
    
    var body: some View {
        VStack {
            VStack(spacing: 0) {
                ForEach(PostActions.allCases, id: \.self) { item in
                    Button {
                        buttonAction(item)
                        isPresented = false
                    } label: {
                        Text(item.title)
                            .font(UBUFonts.manropeSemibold(withSize: 16))
                            .foregroundColor(.primaryColor)
                            .padding(.vertical, 8)
                    }
                    if item != .cancel {
                        Divider()
                    }
                }
            }
            .frame(maxWidth: .infinity)
            .background(Color.white)
            .cornerRadius(16)
            .shadow(radius: 10)
            .padding(.horizontal)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.black.opacity(0.4).edgesIgnoringSafeArea(.all))
        .onTapGesture {
            isPresented = false
        }
    }

}

#Preview {
    PostActionModal(isPresented: .constant(false), buttonAction: {_ in})
}
