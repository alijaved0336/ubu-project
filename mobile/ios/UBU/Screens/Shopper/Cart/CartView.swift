//
//  CartView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 01/07/2024.
//

import SwiftUI

struct CartView: View {
    @State var searchText: String = ""
    
    var body: some View {
        VStack {
            Image("cart-bag")
                .resizable()
                .frame(width: 84, height: 84)
            
            Text("Coming Soon...")
                .font(UBUFonts.manropeExtraBold(withSize: 16))
                .foregroundStyle(.primaryColor)
                .padding(.top)
        }
    }
}



#Preview {
    CartView()
}
