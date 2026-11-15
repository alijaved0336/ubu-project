//
//  nfluencerProfileView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 09/12/2024.
//

import SwiftUI

struct InfluencerProfileView: View {
    @Environment(\.dismiss) var dismiss

    @State private var influencerBio: InfluencerBio? = nil
    @State private var influencerPosts: InfluencerPosts? = nil
    
    @State var selectedPost: Post?
    @State var openInfluencerPostView: Bool = false
    @State var openInfluencerPostListView: Bool = false

    @State private var isFollower: Bool = false

    @State private var selectedCategory: String? = nil
    @State private var selectedInfluencer: InfluencerAttributes? = nil
    @State private var selectedInfluencerBio: InfluencerBio? = nil
    @State private var selectedInfluencerPosts: InfluencerPosts? = nil
    
    
    let id: String
    
    var body: some View {
        VStack {
            HStack {
                Button {
                    dismiss()
                    
                } label: {
                    Image("arrow-left")
                }
                Spacer()
            }
            .padding(.bottom)
            
            ScrollView(showsIndicators: false) {
                VStack {
                    HStack {
                        influencerInfo
                            .frame(maxWidth: UIScreen.main.bounds.width * 0.3, alignment: .leading)
                        influencerPhysicalAttributes
                            .frame(maxWidth: UIScreen.main.bounds.width * 0.7, alignment: .leading)
                            .padding(.leading, 10)
                    }
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 8).fill(Color(hex: "FAFAFA"))
                            .stroke(Color(hex: "EBEBEB"), lineWidth: 1)
                    )
                    
                    recentPosts
                        .padding(.top)
                }
                .onAppear{
                    isFollower = influencerBio?.isFollower ?? false
                }
            }
            
        }
        .padding()
        .onAppear {
            fetchInfluencerProfileAndPosts()
        }
        .navigationDestination(isPresented: $openInfluencerPostView, destination: {
            InfluencerPostDetailView(influencerBio: $influencerBio, influencerPost: $selectedPost)
        })
        .navigationDestination(isPresented: $openInfluencerPostListView, destination: {
            InfluencerPostListView(influencerBio: $influencerBio, influencerPosts: influencerPosts)
        })
    }
    
    var influencerInfo: some View {
        VStack {
            WebImageView(
                url: influencerBio?.avatar ?? "",
                width: 90,
                height: 90,
                shape: .circle,
                scaleMode: .fill,
                firstName: influencerBio?.firstName,
                lastName: influencerBio?.lastName
            )
            Text("\(influencerBio?.firstName ?? "") \(influencerBio?.lastName ?? "")")
                .font(UBUFonts.manropeBold(withSize: 20))
                .foregroundColor(.primaryColor)
                .lineLimit(2)
                .multilineTextAlignment(.center)
            
            Button {
                if isFollower {
                    NetworkService.shared.unfollowInfluencer(id: influencerBio?.influencerID ?? -1)
                } else {
                    NetworkService.shared.followInfluencer(id: influencerBio?.influencerID ?? -1)
                }
                isFollower.toggle()
            } label: {
                Text(isFollower ? "Following" : "Follow")
                    .font(UBUFonts.manropeMedium(withSize: 14))
                    .frame(width: 100, height: 44)
                    .background(!isFollower ? .primaryColor : Color(hex: "B0B0B0"))
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
        }
        .frame(maxWidth: .infinity, alignment: .center)
    }
    
    var influencerPhysicalAttributes: some View {
        VStack(alignment: .leading, spacing: 10) {
            if let bio = influencerBio {
                
                // Height
                if let height = bio.height, height.name != nil {
                    HStack {
                        Text("Height:")
                            .font(UBUFonts.manropeSemibold(withSize: 14))
                            .foregroundColor(.primaryColor)
                        Text("\(convertHeightToFeetAndInches(for: height.name ?? 0)) (\(Int(height.match ?? 0))%)")
                            .font(UBUFonts.manropeMedium(withSize: 12))
                            .foregroundColor(.primaryColor.opacity(0.7))
                    }
                }

                // Weight
                if let weight = bio.weight, weight.name != nil {
                    HStack {
                        Text("Weight:")
                            .font(UBUFonts.manropeSemibold(withSize: 14))
                            .foregroundColor(.primaryColor)
                        Text("\(Utilities.convertWeightToLbs(Int(weight.name ?? 0)) ?? 0) (\(Int(weight.match ?? 0))%)")
                            .font(UBUFonts.manropeMedium(withSize: 12))
                            .foregroundColor(.primaryColor.opacity(0.7))
                    }
                }

                // Shape
                if let shape = bio.shape, shape.name != nil {
                    HStack {
                        Text("Shape:")
                            .font(UBUFonts.manropeSemibold(withSize: 14))
                            .foregroundColor(.primaryColor)
                        Text("\(shape.name ?? "N/A") (\(Int(shape.match ?? 0))%)")
                            .font(UBUFonts.manropeMedium(withSize: 12))
                            .foregroundColor(.primaryColor.opacity(0.7))
                    }
                }

                // Budget
                if let budget = bio.budget, let budgetNames = budget.name, !budgetNames.isEmpty {
                    HStack {
                        Text("Budget:")
                            .font(UBUFonts.manropeSemibold(withSize: 14))
                            .foregroundColor(.primaryColor)
                        
                        let displayedBudgets = budgetNames.prefix(2)
                        HStack {
                            Text(displayedBudgets.joined(separator: ", ") + (budgetNames.count > 2 ? "..." : ""))
                                .multilineTextAlignment(.leading)
                                .lineLimit(1)
                            Text(" (\(Int(budget.match ?? 0))%)")
                        }
                        .font(UBUFonts.manropeMedium(withSize: 12))
                        .foregroundColor(.primaryColor.opacity(0.7))
                    }
                }

                // Region
                if let region = bio.region, let regionNames = region.name, !regionNames.isEmpty {
                    HStack {
                        Text("Region:")
                            .font(UBUFonts.manropeSemibold(withSize: 14))
                            .foregroundColor(.primaryColor)
                        
                        let displayedRegions = regionNames.prefix(2)
                        HStack {
                            Text(displayedRegions.joined(separator: ", ") + (regionNames.count > 2 ? "..." : ""))
                                .lineLimit(1)
                            Text(" (\(Int(region.match ?? 0))%)")
                        }
                        .font(UBUFonts.manropeMedium(withSize: 12))
                        .foregroundColor(.primaryColor.opacity(0.7))
                    }
                }

                // Style
                if let style = bio.style, let styleNames = style.name, !styleNames.isEmpty {
                    HStack {
                        Text("Style:")
                            .font(UBUFonts.manropeSemibold(withSize: 14))
                            .foregroundColor(.primaryColor)
                        
                        let displayedStyles = styleNames.prefix(2)
                        HStack {
                            Text(displayedStyles.joined(separator: ", ") + (styleNames.count > 2 ? "..." : ""))
                                .lineLimit(1)
                            Text(" (\(Int(style.match ?? 0))%)")
                        }
                        .font(UBUFonts.manropeMedium(withSize: 12))
                        .foregroundColor(.primaryColor.opacity(0.7))
                    }
                }
            }
        }
    }

    var recentPosts: some View {
        VStack() {
            
            HStack {
                Text("Sorted: Most Recent")
                    .font(UBUFonts.manropeSemibold(withSize: 12))
                    .foregroundStyle(.primaryColor.opacity(0.7))
                
                Spacer()
                
                Button {
                    openInfluencerPostListView.toggle()
                } label: {
                    Text("View All >")
                        .font(UBUFonts.manropeSemibold(withSize: 12))
                        .foregroundStyle(.primaryColor)
                }
            }
            
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                ForEach(influencerPosts?.posts ?? [], id: \.id) { post in
                    Button {
                        selectedPost = post
                        openInfluencerPostView.toggle()
                    } label: {
                        if let media = post.media, media.count > 0 {
                            if media[0].type == MediaType.video.rawValue {
                                VideoPlayerView(url: media[0].url, height: 190)
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                            } else {
                                WebImageView(url: media[0].url, height: 190, shape: .rectangle(cornerRadius: 8), scaleMode: .fill)

                            }
                        }
                    }
                    
                }
            }
            
        }
    }
    
    func convertHeightToFeetAndInches(for heightInMM: Int) -> String {
        let millimetersPerInch = 25.4
        let totalInches = Double(heightInMM) / millimetersPerInch
        
        let feet = Int(totalInches) / 12
        let inches = Int(totalInches) % 12
        
        return "\(feet)'\(inches)\""
    }
    
    private func getUrlForImage(_ post: Post) -> String {
        if let media = post.media, media.count > 0 {
            if media[0].type == "video" {
                return media[0].thumbnail ?? ""
            } else {
                return media[0].url
            }
        }
        return ""
    }
    
    func fetchInfluencerProfileAndPosts() {
        NetworkService.shared.fetchInfluencerBio(id: id) { result in
            switch result {
            case .success(let response):
                DispatchQueue.main.async {
                    self.influencerBio = response
                    self.isFollower = influencerBio?.isFollower ?? false
                }
            case .failure:
                print("Error")
            }
        }
        
        NetworkService.shared.fetchInfluencerPosts(id: id, page: 1, limit: 6) { result in
            switch result {
            case .success(let response):
                DispatchQueue.main.async {
                    self.influencerPosts = response
                }
            case .failure:
                break
            }
        }
    }
    
    
}


#Preview {
    InfluencerProfileView(id: "1")
}
