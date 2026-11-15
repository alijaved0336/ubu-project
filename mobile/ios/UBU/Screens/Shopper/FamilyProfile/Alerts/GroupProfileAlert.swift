//
//  ProfileAlert.swift
//  UBU
//
//  Created by Codinngcops on 03/06/2025.
//

import Foundation
import SwiftUI

struct GroupProfileAlert: View {
    @Environment(\.colorScheme) var colorScheme
    @Binding var isPresented: Bool
    
    @State private var selectedProfileId: Int?
    @State private var showGroupProfilesView = false
    @State private var openChooseRelationView: Bool = false
    @State private var isLoading = false
    
    @State private var profiles: [GroupProfile] = []
    @State private var groupProfileResp: GroupProfileResponse?
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.opacity(colorScheme == .dark ? 0.4 : 0.5)
                    .ignoresSafeArea()
                VStack(alignment: .leading) {
                    
                    HeaderRow(isPresented: $isPresented)
                    
                    Text("Switch Profile")
                        .font(UBUFonts.manropeBold(withSize: 16))
                        .foregroundStyle(.primaryColor)
                        .padding(.horizontal)
                        .multilineTextAlignment(.center)
                    
                    Text("Choose the profile you want to switch")
                        .font(UBUFonts.manropeSemibold(withSize: 14))
                        .foregroundStyle(.primaryColor.opacity(0.7))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                    
                 
                    ProfileListView(isLoading: isLoading, profiles: profiles, selectedProfileId: $selectedProfileId) { profile in
                        if let id = profile.childUserID.map(String.init) {
                            LoginManager.shared.switchProfile(
                                to: "shopper",
                                for: id,
                                dialogManager: DialogManager(),
                                onDismiss: {},
                                onTogglePresented: { isPresented.toggle() }
                            )
                        }
                        else {
                            let id = String(profile.id)
                            LoginManager.shared.switchProfile(
                                to: "shopper",
                                for: id,
                                dialogManager: DialogManager(),
                                onDismiss: {},
                                onTogglePresented: { isPresented.toggle() }
                            )
                        }

                    }
                    
                    actionButtons
                        .padding(.bottom)
                }
                .background( Color.white.cornerRadius(20.0) )
                .padding(.horizontal)
                .onAppear {
                    fetchAllProfiles()
                }
            }
            .navigationDestination(isPresented: $showGroupProfilesView, destination: {
                FamilyProfilesView(isPresented: $isPresented)
                    .toolbar(.hidden)
            })
            .navigationDestination(isPresented: $openChooseRelationView, destination: {
                ChooseProfileRelationView()
                    .toolbar(.hidden)
            })
            
        }
    }
    
    private func fetchAllProfiles() {
        isLoading = true
        NetworkService.shared.fetchAllProfiles() { result in
            DispatchQueue.main.async {
                defer { isLoading = false }
                switch result {
                case .success(let response):
                    self.groupProfileResp = response.data
                    self.profiles = groupProfileResp?.profiles ?? []
                case .failure:
                    NSLog("Error occurred while fetching sub profiles")
                }
            }
        }
    }
    
    private struct HeaderRow: View {
        @Binding var isPresented: Bool
        
        var body: some View {
            HStack {
                Image("group-profile")
                    .resizable()
                    .frame(width: 50, height: 50)
                    .padding(12)
                    .padding(.bottom, 2)
                
                Spacer()
                
                Button(action: {
                    isPresented = false
                }) {
                    Image("cross")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 30, height: 30)
                        .padding(12)
                        .padding(.bottom, 2)
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }
    
    private struct ProfileRow: View {
        let profile: GroupProfile
        @Binding var selectedProfileId: Int?
        var onSelected: ((GroupProfile) -> Void)? = nil
        
        var body: some View {
            Button(action: {
                
                print("profile selected: \(profile) \(profile.id)")
                selectedProfileId = profile.id
                onSelected?(profile)
            }) {
                HStack(alignment: .center, spacing: 12) {
                    WebImageView(
                        url: profile.subProfile?.avatar ?? "",
                        width: 40,
                        height: 40,
                        shape: .circle,
                        scaleMode: .fill,
                        firstName: profile.subProfile?.firstName,
                        lastName: profile.subProfile?.lastName
                    )
                    VStack(alignment: .leading, spacing: 2) {
                        Text(profile.subProfile?.fullName ?? "-")
                            .font(UBUFonts.manropeSemibold(withSize: 15))
                            .foregroundColor(.black)
                        
                        Text(profile.relation ?? "-")
                            .font(UBUFonts.manropeSemibold(withSize: 14))
                            .foregroundColor(.gray)
                    }
                    Spacer()
                    if selectedProfileId == profile.id {
                        Image("check-mark")
                            .resizable()
                            .frame(width: 25 ,height: 25)
                    }
                }
                .padding(.vertical, 5)
                .padding(.horizontal, 5)
                .background(Color.white.opacity(0.01))
            }
            .buttonStyle(PlainButtonStyle())
        }
    }
    
    @ViewBuilder
    private func ProfileListView(isLoading: Bool,
                                 profiles: [GroupProfile],
                                 selectedProfileId: Binding<Int?>,
                                 onSelected: @escaping (GroupProfile) -> Void) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Choose the profile to continue")
                .font(UBUFonts.manropeSemibold(withSize: 14))
                .foregroundColor(Color(hex: "#1E1E1E").opacity(0.7))
                .padding(5)
            
            if isLoading {
                HStack {
                    Spacer()
                    ProgressView()
                    Spacer()
                }
                .padding(.vertical, 20)
            } else {
                if let parent = groupProfileResp?.parent.profile {
                    let primaryProfile = GroupProfile(
                        id: parent.id,
                        relation: "Primary",
                        isActive: true,
                        parentUserID: nil,
                        childUserID: nil,
                        subProfile: parent,
                        hasChildUser: true
                    )
                    ProfileRow(profile: primaryProfile, selectedProfileId: selectedProfileId, onSelected: onSelected)
                }
                ForEach(profiles.prefix(3), id: \.id) { profile in
                    ProfileRow(profile: profile, selectedProfileId: selectedProfileId, onSelected: onSelected)
                }
            }
        }
        .frame(width: 311, alignment: .leading)
        .padding(10)
        .background(Color.white.opacity(0.2))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.black.opacity(0.1), lineWidth: 1)
        )
        .frame(maxWidth: .infinity, alignment: .center)
        .padding(.vertical, 10)
    }
    @ViewBuilder
    private var actionButtons: some View {
        VStack (spacing: 10) {
            if StateManager.shared.userProfile?.isPrimaryUser ?? false {
                Button {
                    openChooseRelationView.toggle()
                } label: {
                    Label("Create Profile", systemImage: "person.fill.badge.plus")
                }
                .buttonStyle(SecondaryButtonStyle())
                .padding(.horizontal, 10)
            }
            Button {
                showGroupProfilesView = true
            } label: {
                Label("See All Profiles", systemImage: "person.2.circle.fill")
            }
            .buttonStyle(PrimaryButtonStyle())
            .padding(10)
        }
    }
}

#Preview {
    GroupProfileAlert(
        isPresented: .constant(true)
    )
}
