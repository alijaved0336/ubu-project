//
//  ShowProductSheet.swift
//  UBU
//
//  Created by Irtaza Fiaz on 27/01/2025.
//

import SwiftUI

struct ShowProductSheet: View {
    @Binding var isPresented: Bool
    let product: CreatorProductInfo

    @State private var contentHeight: CGFloat = 0

    var body: some View {
        VStack(alignment: .leading) {
            headerView
            
            ScrollView {
                VStack(alignment: .leading) {
                    productInfoSection
                    attachmentsSection
                }
                .background(GeometryReader { proxy in
                    Color.clear.preference(key: ViewHeightKey.self, value: proxy.size.height)
                })
            }
            .onPreferenceChange(ViewHeightKey.self) { newHeight in
                contentHeight = newHeight + 40 // Add padding
            }
        }
        .padding()
        .interactiveDismissDisabled()
        .presentationDetents([.height(400), .large])
    }

    private var headerView: some View {
        HStack {
            Text("Product")
                .foregroundColor(.primaryColor)
                .font(UBUFonts.manropeExtraBold(withSize: 18))
                .frame(maxWidth: .infinity, alignment: .leading)
            
            Button { isPresented.toggle() }
            label: {
                Image("cross")
                    .renderingMode(.template)
                    .foregroundStyle(.primaryColor)
            }
        }
    }

    private var productInfoSection: some View {
        VStack(alignment: .leading) {
            Text("Post Name")
                .foregroundColor(.primaryColor)
                .font(UBUFonts.manropeSemibold(withSize: 16))
                .padding(.top)
            
            Text(product.title ?? "NaN")
                .foregroundColor(.primaryColor.opacity(0.7))
                .font(UBUFonts.manropeRegular(withSize: 14))
            
            Text("Description")
                .foregroundColor(.primaryColor)
                .font(UBUFonts.manropeSemibold(withSize: 16))
                .padding(.top)
            
            Text(product.description ?? "NaN")
                .foregroundColor(.primaryColor.opacity(0.7))
                .font(UBUFonts.manropeRegular(withSize: 14))
        }
    }

    private var attachmentsSection: some View {
        VStack(alignment: .leading) {
            Text("Attachments")
                .foregroundColor(.primaryColor)
                .font(UBUFonts.manropeSemibold(withSize: 16))
                .padding(.top)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 10) {
                    if let firstWelcomeImage = product.images, !firstWelcomeImage.isEmpty {
                        ForEach(firstWelcomeImage, id: \.self) { image in
                            WebImageView(
                                url: image,
                                height: 100,
                                shape: .rectangle(cornerRadius: 10),
                                scaleMode: .fill
                            )
                            .frame(width: 100, height: 100)
                        }
                    } else {
                        Text("No images available")
                            .foregroundColor(.primaryColor.opacity(0.7))
                            .font(UBUFonts.manropeRegular(withSize: 14))
                    }
                }
            }
        }
    }
}

// Helper to measure the content height
struct ViewHeightKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}


#Preview {
    ShowProductSheet(isPresented: .constant(true), product: mockAmazonProduct)
}
