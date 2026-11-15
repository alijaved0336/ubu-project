//
//  ProfileView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 01/07/2024.
//

import SwiftUI

struct ProfileView: View {
    @Environment(\.isTabBarVisible) var isTabBarVisible
    @Environment(\.isTopNavVisible) var isTopNavVisible
    @EnvironmentObject var dialogManager: DialogManager
    
    @StateObject var profileVM = ProfileViewModel()
    @ObservedObject var stateManager = StateManager.shared
    
    @State private var searchText = ""
    @State private var openMatchesView = false
    @State private var isLoading = false
    @State private var openProductRequestsView = false
    @State private var openParentRequestView = false
    @State private var openRecoverDeletedProfilesView = false
    @State private var openConnectedAccount: Bool = false
    @State private var openSearchUserProfileView: Bool = false
    @State private var openRelationRequestsView: Bool = false
    @State private var showGroupProfilesView = false

    @State private var selectedProfile = mockProfiles[0]
    @State private var matchedInfluencers: MatchedInfluencers?
    @State private var recentPosts: HomeFeedPosts?
    
    var body: some View {
        NavigationStack {
            VStack {

                
                profileSection
                physicalAttributes
                    .padding(.horizontal).padding(.top, 10)
                
                if stateManager.userRole == .consumer {
                    viewAllRequestsButton.padding(.top, 10)
                    
                    if (stateManager.userProfile?.isPrimaryUser ?? false) {
                        searchProfilesButton.padding(.vertical, 10)
                        relationRequestsButton
                    }
                    
                } else {
                    viewConnectedAccountButton
                        .padding(.top, 10)
                }
                
                Spacer()
            }
            .blur(radius: stateManager.matchesLoading ? 8 : 0)
            .navigationDestination(isPresented: $openProductRequestsView, destination: {
                AllRequestsView()
                    .toolbar(.hidden)
            })
            .navigationDestination(isPresented: $openParentRequestView, destination: {
                PendingChildRequestsView()
                    .toolbar(.hidden)
            })
            .navigationDestination(isPresented: $openRecoverDeletedProfilesView, destination: {
                SoftDeletedProfilesView()
                    .toolbar(.hidden)
            })
            .navigationDestination(isPresented: $openConnectedAccount, destination: {
                ConnectedAccountView()
                    .toolbar(.hidden)
            })
            .navigationDestination(isPresented: $openSearchUserProfileView, destination: {
                SearchProfilesView()
                    .toolbar(.hidden)
            })
            .navigationDestination(isPresented: $openRelationRequestsView, destination: {
                RelationRequestsView()
                    .toolbar(.hidden)
            })
            .navigationDestination(isPresented: $showGroupProfilesView) {
                FamilyProfilesView(isPresented: $showGroupProfilesView)
                    .toolbar(.hidden)
            }
        }
        .onAppear {
            isTabBarVisible.wrappedValue = true
            profileVM.isProfileSaved = false
            fetchRecentPosts()
        }
    }
    
    // MARK: - Header View
    
    private var profileSection: some View {
        Group {
            if let profile = stateManager.userProfile {
                profileTopHeader(profile)
                Text("\(profile.firstName ?? "") \(profile.lastName ?? "")")
                    .font(UBUFonts.manropeBold(withSize: 20))
                    .foregroundStyle(.primaryColor)
            }
        }
    }
    
    private var viewAllRequestsButton: some View {
        Group {
            if let profile = stateManager.userProfile {
                Button(action: {
                    profile.isPrimaryUser ?? true
                    ? openParentRequestView.toggle()
                    : openProductRequestsView.toggle()
                }) {
                    Label("View Requested Products", systemImage: "suitcase.cart.fill")
                }
                .buttonStyle(PrimaryButtonStyle())
                .padding(.horizontal)
            }
        }
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
    
    private var searchProfilesButton: some View {
        Button(action: {
            openSearchUserProfileView.toggle()
        }) {
            Label("Search Profiles", systemImage: "person.line.dotted.person.fill")
        }
        .buttonStyle(SecondaryButtonStyle())
        .padding(.horizontal)
    }
    
    private var relationRequestsButton: some View {
        Button(action: {
            openRelationRequestsView.toggle()
        }) {
            Label("Relation Requests", systemImage: "person.line.dotted.person.fill")
        }
        .buttonStyle(SecondaryButtonStyle())
        .padding(.horizontal)
    }
    
    @ViewBuilder
    private func profileTopHeader(_ profile: UserProfile) -> some View {
        ZStack(alignment: .topTrailing) {
            ZStack(alignment: .bottom) {
                Image("profile-background")
                    .resizable()
                    .scaledToFill()
                    .frame(maxWidth: .infinity)
                    .frame(height: 170)
                    .ignoresSafeArea()

                ZStack(alignment: .bottomTrailing) {
                    WebImageView(
                        url: profile.avatar ?? "",
                        width: 120,
                        height: 120,
                        shape: .circle,
                        scaleMode: .fill,
                        firstName: profile.firstName,
                        lastName: profile.lastName
                    )
                    .overlay(Circle().stroke(Color.white, lineWidth: 2))
                    
                    NavigationLink(destination: EditProfileView(profileVM: profileVM).toolbar(.hidden)) {
                        Image("edit-with-black-bg")
                            .resizable()
                            .frame(width: 28, height: 28)
                            .padding(.bottom, 10)
                            .padding(.trailing, 10)
                    }
                }
            }
            switchButton
        }
    }
    
    private var switchButton: some View {
        Menu {
            Button("Switch to \(stateManager.userRole == .consumer ? "creator" : "shopper")") { switchUser() }
            if (stateManager.userProfile?.isPrimaryUser ?? false) || StateManager.shared.shouldSwitchBackToParent {
                Button("See all Profiles") { showGroupProfilesView.toggle() }
                if stateManager.userProfile?.isPrimaryUser == true  {
                    Button("Recover deleted Profiles") { openRecoverDeletedProfilesView.toggle() }
                }
            }
            Button("Logout") { NetworkService.shared.logout() }
        } label: {
            Image("hamburger")
                .resizable()
                .scaledToFit()
                .frame(width: 44, height: 44)
                .clipShape(Circle())
                .padding(.top, 8)
                .padding(.trailing, 16)
        }
    }

    // MARK: - Physical Attributes
    private var physicalAttributes: some View {
        HStack(spacing: 8) {
            if let user = stateManager.userProfile {
                attributeBox(
                    iconName: "profile-height",
                    title: "Height",
                    value: [Utilities.getFeetAndInches(height: user.updatedHeight)]
                )
                attributeBox(
                    iconName: "profile-style",
                    title: "Style",
                    value: user.updatedStyle ?? []
                )
                attributeBox(
                    iconName: "profile-shape",
                    title: "Shape",
                    value: user.updatedShape ?? []
                )
            }
            
        }
    }
    
    private func attributeBox(iconName: String, title: String, value: [String]) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Image(iconName)
                .resizable()
                .scaledToFit()
                .frame(width: 24, height: 24)
            
            Text(title)
                .font(UBUFonts.manropeBold(withSize: 14))
                .foregroundStyle(.primaryColor)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.top, 5)
            
            profileStatArray(items: value)
                .padding(.top, 5)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color(hex: "FAFAFA"))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color(hex: "EBEBEB"), lineWidth: 1)
        )
    }
    
    private func profileStatArray(items: [String]) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            
            if items.isEmpty {
                Text("-")
                    .font(UBUFonts.manropeMedium(withSize: 10))
                    .foregroundStyle(.primaryColor)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(items, id: \.self) { item in
                            Text(item)
                                .font(UBUFonts.manropeMedium(withSize: 10))
                                .foregroundStyle(.primaryColor)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(
                                    RoundedRectangle(cornerRadius: 8)
                                        .fill(Color(hex: "FAFAFA"))
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(Color(hex: "EBEBEB"), lineWidth: 1)
                                )
                        }
                    }
                }
            }
        }
    }
    
    private func profileStat(title: String, value: String) -> some View {
        VStack {
            Text(title)
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundStyle(.primaryColor)
            Text(value)
                .font(UBUFonts.manropeMedium(withSize: 12))
                .foregroundStyle(.primaryColor.opacity(0.7))
        }
    }
    
    // MARK: - Helper
    private func fetchRecentPosts() {
        NetworkService.shared.fetchRecentPosts { result in
            if case .success(let posts) = result {
                DispatchQueue.main.async {
                    self.recentPosts = posts
                }
            }
        }
    }
    
    private func deleteUser() {
        NetworkService.shared.deleteConsumerAccount { result in
            if case .success = result {
                UserDefaults.standard.set(true, forKey: "didLogoutManually")
                NetworkService.authToken = nil
                StateManager.shared.updateUserProfile(with: nil)
                StateManager.shared.userRole = .consumer
                StateManager.shared.updateRoute(route: .login)
            }
        }
    }
    
    private func switchUser() {
        if stateManager.userRole == .influencer {
            LoginManager.shared
                .switchToConsumer {
                    dialogManager.showError(
                        title: "Error occured!",
                        message: "Unable to switch to shopper. Please try again later."
                    )
                }
        } else {
            LoginManager.shared
                .switchToInfluencer {
                    dialogManager
                        .showError(
                            title: "Error",
                            message: "Unable to switch to influencer. Please try again."
                        )
                }
        }
    }
    
}


#Preview {
    ProfileView()
        .environmentObject(DialogManager())
        .onAppear {
            StateManager.shared.updateUserProfile(with: UserProfile.mock)
        }
}
