//
//  FavoriteProductDetailView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 05/08/2024.
//

import SwiftUI

struct FavoriteProductDetailView: View {
    @Environment(\.dismiss) var dismiss
    @Environment(\.isTabBarVisible) var isTabBarVisible
    
    @Binding var product: AmazonProductInfo?
    
    var body: some View {
        VStack(alignment: .leading) {
            backButton
                .padding(.leading)
                .padding(.top)
            
            ProductDetailView(
                product: Binding(get: { product }, set: { newValue in
                    product = newValue ?? nil
                })
            )
            .navigationBarBackButtonHidden()
            .onAppear {
                isTabBarVisible.wrappedValue = false
            }
        }
        .navigationBarBackButtonHidden()
        .onAppear {
            isTabBarVisible.wrappedValue = false
        }
        .toolbar(.hidden, for: .tabBar)
        .tabBarVisible(false)
    }
    
    var backButton: some View {
        HStack {
            Button {
                dismiss()
            } label: {
                Image("arrow-left")
                    
            }
            Spacer()
        }
    }
}

//#Preview {
//    FavoriteProductDetailView(product: .constant(mockFavouriteProduct[0]), postProductId: 1, postId: 2)
//}
