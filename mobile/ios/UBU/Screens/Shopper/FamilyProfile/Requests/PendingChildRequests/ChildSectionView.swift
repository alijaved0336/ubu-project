//
//  ChildSectionView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 29/07/2025.
//

import SwiftUI

struct ChildSectionView: View {
    var requestedProducts: ChildRequestedProductsResponse
    var onStatusUpdated: () -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 10) {
                WebImageView(
                    url: requestedProducts.profile.childUser?.avatar ?? "",
                    width: 40,
                    height: 40,
                    shape: .circle,
                    scaleMode: .fill,
                    firstName: requestedProducts.profile.childUser?.firstName,
                    lastName: requestedProducts.profile.childUser?.lastName
                )
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(requestedProducts.profile.childUser?.firstName ?? "Child")
                        .font(UBUFonts.manropeSemibold(withSize: 16))
                        .foregroundStyle(.primaryColor)
                    
                    Text(requestedProducts.profile.relation ?? "Relation")
                        .font(UBUFonts.manropeRegular(withSize: 10))
                        .foregroundStyle(.primaryColor)
                }
                Spacer()
            }
            
            VStack {
                ForEach(requestedProducts.productRequests.indices, id: \.self) { index in
                    RequestRowView(product: requestedProducts.productRequests[index], onStatusUpdated: onStatusUpdated)
                }
            }
            
        }
        .padding()
        .background(StyledBackground())
    }
    
}
