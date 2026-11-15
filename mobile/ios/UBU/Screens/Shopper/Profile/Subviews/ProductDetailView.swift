//
//  ProductDetailView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 02/08/2024.
//

import SwiftUI

struct ProductDetailView: View {
    @State private var isDescExpanded = false
    @State var selectedColor: String?
    @State private var isFavorite: Bool = false
    @State private var currentPage = 0
    @State private var showRequestAlert = false

    @Binding var product: AmazonProductInfo?
    var openProductSheet: Binding<Bool>?
    
    init(product: Binding<AmazonProductInfo?>, openProductSheet: Binding<Bool>? = nil) {
        self._product = product
        self.openProductSheet = openProductSheet
        _isFavorite = State(initialValue: product.wrappedValue?.isFavorite ?? false)
    }
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                if showRequestAlert {
                    SendRequestAlert(
                        isPresented: $showRequestAlert,
                        product: $product,
                        onDismiss: {
                            openProductSheet?.wrappedValue = false
                        }
                    )
                } else {
                    postBanner
                        .padding(.top, 30)
                    
                    Text(product?.title ?? "")
                        .font(UBUFonts.manropeBold(withSize: 18))
                        .foregroundStyle(Color(hex: "1E1E1E"))
                        .padding(.top, 20)
                    
                    if let price = product?.price {
                        Text("$\(price)")
                            .font(UBUFonts.manropeExtraBold(withSize: 26))
                            .foregroundStyle(Color(hex: "1E1E1E"))
                            .padding(.top, 5)
                    }
                    
                    Text(product?.description ?? "")
                        .font(UBUFonts.manropeSemibold(withSize: 14))
                        .foregroundStyle(Color(hex: "1E1E1E").opacity(0.7))
                        .lineLimit(isDescExpanded ? nil : 2)
                        .animation(.linear, value: isDescExpanded)
                        .padding(.top, 10)
                    
                    Button {
                        isDescExpanded.toggle()
                    } label: {
                        Text(isDescExpanded ? "Read Less" : "Read More")
                            .font(UBUFonts.manropeBold(withSize: 14))
                            .foregroundStyle(Color(hex: "1E1E1E"))
                    }
                    
                    Spacer()
                    
                    purchaseButton
                        .padding(.vertical)
                }
                
                
            }
            .padding(.horizontal)
            .frame(maxWidth: .infinity)
        }
    }
    
    @ViewBuilder
    var postBanner: some View {
        GeometryReader { geometry in
            VStack {
                if let media = product?.images, !media.isEmpty {
                    TabView(selection: $currentPage) {
                        ForEach(media.indices, id: \.self) { index in
                            WebImageView(url: media[index], height: 450, shape: .rectangle(cornerRadius: 8), scaleMode: .fill)
                                .tag(index)
                        }
                    }
                    .tabViewStyle(PageTabViewStyle(indexDisplayMode: .always))
                    .frame(height: 450)
                }
            }
        }
        .frame(height: 450)
    }
    
    @ViewBuilder func postHeader(url: String, isVideoType: Bool) -> some View {
        ZStack(alignment: .bottomTrailing) {
            VStack {
                if !isVideoType {
                    WebImageView(url: url, height: 450, shape: .rectangle(cornerRadius: 8), scaleMode: .fill)
                } else {
                    VideoPlayerView(url: url)
                }
            }
            favouriteButton
        }
        
    }
    
    @ViewBuilder
    var favouriteButton: some View {
        HStack {
            Spacer()
            Button {
                if isFavorite {
                    NetworkService.shared.removeFromFavourites(id: String(product?.id ?? -1))
                } else {
                    NetworkService.shared.addToFavourites(id: String(product?.id ?? -1))
                }
                product?.isFavorite?.toggle()
                
            } label: {
                Image(systemName: isFavorite ? "heart.fill" : "heart")
                    .padding(5)
                    .foregroundStyle(.black)
                    .background(Color.white.opacity(0.4))
                    .clipShape(Circle())
                    .padding([.bottom, .trailing], 10)
                //            }
            }
        }
    }
    
    @ViewBuilder
    private func productColors(_ product: Product) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Available Colors")
                .font(UBUFonts.manropeBold(withSize: 16))
                .foregroundStyle(Color(hex: "1E1E1E"))
                .padding(.top, 20)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 15) {
                    ForEach(product.colors ?? [], id: \.self) { color in
                        Button {
                            selectedColor = color
                        } label: {
                            Circle()
                                .fill(Color(hex: color ?? "000000"))
                                .frame(width: 24, height: 24)
                                .overlay(
                                    Circle()
                                        .stroke(selectedColor == color ? .primaryColor.opacity(0.7) : Color.clear, lineWidth: 1)
                                        .frame(width: 28, height: 28)
                                )
                        }
                        
                    }
                }
                .padding(.top, 15)
            }
            
        }
    }
    
    @ViewBuilder
    private func productSizes(_ product: Product) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Available Sizes")
                .font(UBUFonts.manropeBold(withSize: 16))
                .foregroundStyle(Color(hex: "1E1E1E"))
                .padding(.top)
            
            HStack(spacing: 16) {
                ForEach(product.productSizes ?? [], id: \.size) { productSize in
                    Text(productSize.size ?? "")
                        .font(UBUFonts.manropeBold(withSize: 10))
                        .foregroundStyle(Color(hex: "1E1E1E"))
                        .padding(8)
                        .background(
                            RoundedRectangle(cornerRadius: 8, style: .continuous)
                                .foregroundColor(.white).shadow(radius: 1)
                        )
                }
            }
            .padding(.top, 15)
            
        }
    }
    
    private var purchaseButton: some View {
        VStack(spacing: 16) {
            if let profile = StateManager.shared.userProfile, !(profile.isPrimaryUser ?? true) {
                Button {
                    showRequestAlert = true
                } label: {
                    Label("Request to Buy", systemImage: "paperplane.fill")
                }
                .buttonStyle(SecondaryButtonStyle())
            }
            
            Button(action: purchaseProduct) {
                Label("Continue to Store", systemImage: "storefront.fill")
            }
            .buttonStyle(PrimaryButtonStyle())
        }
        .padding(.horizontal, 20)
    }
    
    
    @ViewBuilder
    var ratingsAndReviews: some View {
        HStack {
            
            Text("Limited Stock")
                .padding(8)
                .font(UBUFonts.manropeBold(withSize: 14))
                .background(Color.black)
                .foregroundColor(.white)
                .cornerRadius(10)
            
            Spacer()
            
            HStack {
                Image("stars")
                    .foregroundColor(.yellow)
                Text("5.0")
                    .font(UBUFonts.manropeBold(withSize: 14))
                    .foregroundStyle(Color(hex: "1E1E1E"))
                
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(
                RoundedRectangle(cornerRadius: 8, style: .continuous)
                    .foregroundColor(Color(hex: "EBEBEB"))
                    .shadow(radius: 2)
            )
            
            Text("(50)")
                .font(UBUFonts.manropeBold(withSize: 14))
                .foregroundStyle(Color(hex: "1E1E1E").opacity(0.7))
        }
        .padding(.top)
    }
    
    private func purchaseProduct() {
        guard let url = URL(string: product?.link ?? ""), UIApplication.shared.canOpenURL(url) else {
            return
        }
        UIApplication.shared.open(url, options: [:], completionHandler: {_ in})
    }
    
    
}

#Preview {
    ProductDetailView(product: .constant(mockAmazonFavouritesProduct))
}
