//
//  PostCardView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 21/11/2024.
//

import SwiftUI

struct PostCardView: View {
    
    var creatorPost: CreatorPost
    
    @State private var currentPage = 0
    var onEditButtonTapped: () -> Void
    var onProductTapped: (CreatorProductInfo) -> Void
    var onDeleteButtonTapped: () -> Void

    private var placeholderView: some View {
        Text("No images available")
            .foregroundColor(.primaryColor.opacity(0.7))
            .font(UBUFonts.manropeRegular(withSize: 8))
            .frame(width: 50, height: 50)
            .background(Color.gray.opacity(0.2))
            .clipShape(Circle())
        
    }
    
    var body: some View {
        VStack {
            HStack {
                if let media = creatorPost.media {
                    VStack(spacing: 0) {
                        TabView(selection: $currentPage) {
                            ForEach(media.indices, id: \.self) { index in
                                postHeader(media: media[index])
                                    .tag(index)
                            }
                        }
                        .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
                        .frame(width: 80, height: 80)
                        
                        progressIndicators(media: media)
                    }
                    
                }
                
                HStack {
                    VStack(alignment: .leading) {
                        Text(creatorPost.title)
                            .font(UBUFonts.manropeSemibold(withSize: 12))
                            .foregroundStyle(.primaryColor)
                            .lineLimit(2)
                        Text(creatorPost.body)
                            .font(UBUFonts.manropeRegular(withSize: 10))
                            .foregroundStyle(.primaryColor.opacity(0.7))
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .lineLimit(5)
                            .multilineTextAlignment(.leading)
                        
                    }
                    
                    VStack {
                        Button(action: onEditButtonTapped) {
                            Image("edit-with-black-bg")
                                .resizable()
                                .frame(width: 24, height: 24)
                        }
                        .buttonStyle(PlainButtonStyle())
                        Button(action: onDeleteButtonTapped) {
                            Image(systemName: "trash.circle.fill")
                                .resizable()
                                .foregroundStyle(Color(hex: "#FF5733"))
                                .frame(width: 24, height: 24)
                        }
                        .buttonStyle(PlainButtonStyle())
                    
                }
                
                
//                
//                VStack(alignment: .leading, spacing: 8) {
//                    HStack(spacing: 0) {
//                        Text(creatorPost.title)
//                            .font(UBUFonts.manropeSemibold(withSize: 12))
//                            .foregroundStyle(.primaryColor)
//                        Spacer()
//                        VStack {
//                            Button(action: onEditButtonTapped) {
//                                Image("edit-with-black-bg")
//                                    .resizable()
//                                    .frame(width: 24, height: 24)
//                            }
//                            .buttonStyle(PlainButtonStyle())
//                            Button(action: onEditButtonTapped) {
//                                Image(systemName: "trash.circle.fill")
//                                    .resizable()
//                                    .foregroundStyle(.red)
//                                    .frame(width: 24, height: 24)
//                            }
//                            .buttonStyle(PlainButtonStyle())
//                        }
//                        
//                    }
//                    .frame(height: 24)
//                    
//                    Text(creatorPost.body)
//                        .font(UBUFonts.manropeRegular(withSize: 10))
//                        .foregroundStyle(.primaryColor.opacity(0.7))
//                        .frame(maxWidth: .infinity, alignment: .leading)
//                        .lineLimit(5)
//                        .multilineTextAlignment(.leading)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(8)
            }
            
            if let products = creatorPost.productData, !products.isEmpty {
                Text("Associated Products:")
                    .font(UBUFonts.manropeSemibold(withSize: 10))
                    .foregroundStyle(.primaryColor)
                    .frame(maxWidth: .infinity, alignment: .leading)
                HStack(spacing: 0) {
                    ScrollView(.horizontal) {
                        HStack {
                            ForEach(products) { product in
                                
                                if let firstImage = product.images?.first {
                                    Button { onProductTapped(product)
                                    } label: {
                                        WebImageView(
                                            url: firstImage,
                                            width: 40,
                                            height: 40,
                                            shape: .circle,
                                            scaleMode: .fill
                                        )
                                        .frame(width: 40, height: 40)
                                        .overlay(
                                            Circle()
                                                .stroke(Color.gray.opacity(0.5), lineWidth: 1)
                                        )
                                        .clipShape(Circle())
                                    }
                                    .buttonStyle(PlainButtonStyle())
                                }
                                else
                                {
                                    Button {
                                           onProductTapped(product)
                                       } label: {
                                           placeholderView
                                               .overlay(
                                                   Circle()
                                                       .stroke(Color.gray.opacity(0.5), lineWidth: 1)
                                               )
                                               .clipShape(Circle())
                                       }
                                       .buttonStyle(PlainButtonStyle())
                                }
                            }
                        }
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            
            HStack {
                if let tags = creatorPost.tags {
                    ScrollView(.horizontal) {
                        HStack {
                            ForEach(tags, id: \.self) { tag in
                                Text("#\(tag)")
                                    .font(UBUFonts.manropeRegular(withSize: 10))
                                    .foregroundStyle(.primaryColor.opacity(0.7))
                                    .padding(6)
                                    .background(RoundedRectangle(cornerRadius: 8).fill(.black.opacity(0.08)))
                                
                            }
                        }
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)

        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(.primaryColor.opacity(0.03))
    }
    
    func extractFirstFourWords(from input: String) -> String {
        let words = input.split(separator: " ")
        let firstFourWords = words.prefix(4)
        return firstFourWords.joined(separator: " ")
    }
    
    @ViewBuilder
    private func postHeader(media: CreatorMedia) -> some View {
        ZStack {
            if media.type == MediaType.video.rawValue {
                VideoPlayerView(url: media.url, height: 80, displaySoundIcon: false)
                    .frame(width: 80)
            } else {
                WebImageView(url: media.url, width: 80, height: 80, shape: .rectangle(cornerRadius: 8), scaleMode: .fill, previewable: true)
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
    
    @ViewBuilder
    private func progressIndicators(media: [CreatorMedia]) -> some View {
        HStack(spacing: 8) {
            if media.count <= 6 {
                ForEach(media.indices, id: \.self) { index in
                    Circle()
                        .fill(index == currentPage ? .primaryColor : .primaryColor.opacity(0.3))
                        .frame(width: 3, height: 3)
                }
            } else {
                ForEach(0..<2, id: \.self) { index in
                    Circle()
                        .fill(index == currentPage ? .primaryColor : .primaryColor.opacity(0.3))
                        .frame(width: 3, height: 3)
                }
                
                Circle()
                    .fill(currentPage >= 2 && currentPage < media.count - 2 ? .primaryColor : .primaryColor.opacity(0.3))
                    .frame(width: 5, height: 5)
                    .overlay(
                        Text("...")
                            .font(.caption2)
                            .foregroundColor(.white)
                    )
                
                ForEach(media.count - 2..<media.count, id: \.self) { index in
                    Circle()
                        .fill(index == currentPage ? .primaryColor : .primaryColor.opacity(0.3))
                        .frame(width: 3, height: 3)
                }
            }
        }
        .padding(.top, 4)
    }
    
}

#Preview {
    PostCardView(creatorPost: mockCreatorPost, onEditButtonTapped: {}, onProductTapped: {_ in }, onDeleteButtonTapped: {})
}
