//
//  SearchProfilesView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 26/06/2024.
//

import SwiftUI
import Combine

struct SearchProfilesView: View {
    @State private var userProfiles: [ProfileSearchResponse.User] = []
    @State private var searchText = ""
    @State private var showWithdrawalSheet = false
    @State private var selectedProfile: ProfileSearchResponse.User?
    @State private var isLoading = false
    @State private var isLoadingMore = false
    @State private var page = 1
    @State private var hasMore = true
    
    @State private var searchInProgress = false
    
    @State private var openWarningAlert = false
    @State private var dialogType: DialogType?
    
    @State private var debouncedText = ""
    private let debounceTime = 0.5
    @State private var cancellable: AnyCancellable?

    var body: some View {
        VStack(spacing: 0) {
            BackButton().padding(.leading)
            Text("Search Profiles")
                .font(UBUFonts.manropeBold(withSize: 20))
                .foregroundStyle(.primaryColor)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.vertical)
                .padding(.leading)
            
            HStack {
                HStack {
                    TextField("Search by name or email", text: $searchText)
                        .padding(.vertical, 8)
                        .padding(.leading, 12)
                        .disableAutocorrection(true)
                        .textInputAutocapitalization(.never)

                    if !searchText.isEmpty {
                        Button(action: {
                            searchText = ""
                            hideKeyboard()
                            performSearchIfNeeded()
                        }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.gray)
                                .padding(.trailing, 8)
                        }
                    }
                }
                .background(Color(.systemGray6))
                .cornerRadius(8)
                
                Button(action: {
                    hideKeyboard()
                    performSearchIfNeeded()
                }) {
                    Image(systemName: "magnifyingglass.circle.fill")
                        .font(.system(size: 28))
                        .foregroundColor(searchText.isEmpty ? .gray : .primaryColor)
                        .padding(.horizontal, 6)
                }
                .disabled(searchText.trimmingCharacters(in: .whitespaces).isEmpty)
                
            }
            .padding([.horizontal, .top], 16)
            .padding(.bottom, 8)

            
            if isLoading && userProfiles.isEmpty {
                Spacer()
                ProgressView("Searching...")
                    .padding()
                Spacer()
            } else if !isLoading && userProfiles.isEmpty {
                Spacer()
                Text("No results found.")
                    .foregroundColor(.secondary)
                    .padding()
                Spacer()
            } else {
                List {
                    ForEach(userProfiles, id: \.id) { user in
                        let nameParts = (user.name ?? "").split(separator: " ")
                        let firstName = nameParts.first.map(String.init) ?? ""
                        let lastName = nameParts.dropFirst().joined(separator: " ")

                        HStack(spacing: 16) {
                            WebImageView(
                                url: user.avatar ?? "",
                                width: 48,
                                height: 48,
                                shape: .circle,
                                scaleMode: .fill,
                                firstName: firstName,
                                lastName: lastName
                            )
                            VStack(alignment: .leading, spacing: 4) {
                                Text(user.name ?? "-")
                                    .font(UBUFonts.manropeBold(withSize: 17))
                                Text(user.email)
                                    .font(UBUFonts.manropeLight(withSize: 15))
                                    .foregroundColor(.secondary)
                            }
                            Spacer()
                            Button {
                                selectedProfile = user
                                showWithdrawalSheet = true
                            } label: {
                                Image(systemName: "arrowshape.turn.up.right.circle.fill")
                                    .font(.system(size: 24))
                                    .foregroundColor(.primaryColor)
                                    .padding(4)
                            }
                        }
                        .padding(.vertical, 6)
                        .onAppear {
                            guard user.id == userProfiles.last?.id else { return }
                            if hasMore && !isLoading && !isLoadingMore {
                                loadMore()
                            }
                        }
                    }
                    if isLoadingMore {
                        HStack {
                            Spacer()
                            ProgressView()
                                .padding(.vertical, 12)
                            Spacer()
                        }
                    }
                }
                .listStyle(.plain)
            }
        }
        .onChange(of: searchText) {
            cancellable?.cancel()
            cancellable = Just(searchText)
                .delay(for: .seconds(debounceTime), scheduler: RunLoop.main)
                .sink { value in
                    debouncedText = value
                    performSearchIfNeeded()
                }
        }
        .alert(isPresented: $openWarningAlert) {
            if let dialogType {
                CustomDialogFactory.makeDialog(dialogType)
            }
        } background: {
            Color.black.opacity(0.5)
                .ignoresSafeArea()
        }
        .floatingBottomSheet(isPresented: Binding(get: {showWithdrawalSheet},set: {showWithdrawalSheet = $0})) {
            if let profile = selectedProfile {
                ProfileRequestSheet(
                    isPresented: $showWithdrawalSheet,
                    action: { relationType, requestFor, requesteeId in
                        sendRelationRequest(
                            requesteeId: requesteeId,
                            relationType: relationType,
                            requestFor: requestFor
                        )
                    },
                    profile: profile
                ).presentationDetents([.medium])
            }
        }
    }
    
    // MARK: - Search Logic
    
    private func performSearchIfNeeded() {
        let trimmed = searchText.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else {
            userProfiles = []
            return
        }
        performSearch()
    }

    private func performSearch() {
        guard !searchText.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        if searchInProgress { return }
        isLoading = true
        isLoadingMore = false
        page = 1
        hasMore = true
        searchInProgress = true
        NetworkService.shared.searchUserProfiles(query: searchText, page: page, limit: 10) { response in
            DispatchQueue.main.async {
                switch response {
                    case .success(let success):
                        let users = success.users ?? []
                        self.userProfiles = users
                        self.hasMore = users.count == 10
                    case .failure:
                        self.userProfiles = []
                        self.hasMore = false
                }
                self.isLoading = false
                self.searchInProgress = false
            }
        }
    }
    
    private func loadMore() {
        guard !isLoading, !isLoadingMore, hasMore else { return }
        isLoadingMore = true
        let nextPage = page + 1
        NetworkService.shared.searchUserProfiles(query: searchText, page: nextPage, limit: 10) { response in
            DispatchQueue.main.async {
                switch response {
                    case .success(let success):
                        let newUsers = success.users ?? []
                        if !newUsers.isEmpty {
                            self.userProfiles.append(contentsOf: newUsers)
                            self.page = nextPage
                            self.hasMore = newUsers.count == 10
                        } else {
                            self.hasMore = false
                        }
                    case .failure:
                        self.hasMore = false
                }
                self.isLoadingMore = false
            }
        }
    }
    
    private func sendRelationRequest(requesteeId: Int, relationType: String, requestFor: String) {
        NetworkService.shared
            .sendRelationRequest(
                requesteeId: requesteeId,
                relationType: relationType,
                requestFor: requestFor,
                completion: { response in
                    switch response {
                        case .success(_):
                            resetSheetValues()
                            showSuccessAlert()
                        case .failure(let failure):
                            resetSheetValues()
                            showErrorAlert(message: failure.message)
                    }
                }
            )
    }
    
    private func resetSheetValues() {
        selectedProfile = nil
        showWithdrawalSheet = false
    }
    
    private func showErrorAlert(message: String) {
        dialogType = .error(
            title: "Error!",
            message: message,
            buttonTitle: "Ok",
            action: {openWarningAlert.toggle()}
        )
        openWarningAlert.toggle()
    }
    
    private func showSuccessAlert() {
        dialogType = .success(
            title: "Success!",
            message: "Relation request is sent successfully.",
            buttonTitle: "Ok",
            onConfirm: {openWarningAlert.toggle()}
        )
        openWarningAlert.toggle()
    }
    
    private func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
    
    // MARK: - ProfileRequestSheet
    
    struct ProfileRequestSheet: View {
        enum RequestForType: CaseIterable {
            case parent
            case child
            
            var title: String {
                switch self {
                    case .parent:
                        return "Parent"
                    case .child:
                        return "Child"
                }
            }
            
            var displayValue: String {
                switch self {
                    case .parent:
                        return "Primary Profile"
                    case .child:
                        return "Sub Profile"
                }
            }
        }
        @Binding var isPresented: Bool
        var action: (String, String, Int) -> Void
        var profile: ProfileSearchResponse.User
        
        @State private var selectedRelationship = ProfileRelationship.father
        @State private var selectedRequestFor: RequestForType = .parent
        
        private let requestForOptions = ["Parent", "Child"]
        
        var body: some View {
            VStack(spacing: 16) {
                WebImageView(
                    url: profile.avatar ?? "",
                    width: 65,
                    height: 65,
                    shape: .circle,
                    scaleMode: .fill,
                    firstName: profile.name,
                    lastName: profile.name
                )
                .background(.primaryColor.gradient, in: .circle)
                .background {
                    Circle()
                        .stroke(.background, lineWidth: 8)
                }
                
                Text(profile.name ?? "-")
                    .font(UBUFonts.manropeBold(withSize: 16))
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("Relationship")
                        .font(UBUFonts.manropeMedium(withSize: 12))
                        .foregroundColor(.secondary)
                    Picker("Relationship", selection: $selectedRelationship) {
                        ForEach(ProfileRelationship.allCases, id: \.self) { relationship in
                            Text(relationship.displayName)
                        }
                    }
                    .pickerStyle(.menu)
                    .foregroundStyle(.primaryColor)
                    .tint(.primaryColor)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .strokeBorder(Color.gray, lineWidth: 0.8)
                    )
                }
                .padding(.horizontal, 2)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("Request For")
                        .font(UBUFonts.manropeMedium(withSize: 12))
                        .foregroundColor(.secondary)
                    Picker("Request For", selection: $selectedRequestFor) {
                        ForEach(RequestForType.allCases, id: \.self) { option in
                            Text(option.displayValue)
                        }
                    }
                    .pickerStyle(.menu)
                    .foregroundStyle(.primaryColor)
                    .tint(.primaryColor)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .strokeBorder(Color.gray, lineWidth: 0.8)
                    )
                    let name = StateManager.shared.userProfile?.firstName ?? ""
                    Text("\(name) wants to become \(selectedRequestFor.displayValue.lowercased()) of \(profile.name ?? "")")
                        .font(UBUFonts.manropeBold(withSize: 10))
                        .foregroundStyle(.primaryColor.opacity(0.4))
                }
                .padding(.horizontal, 2)
                
                HStack {
                    Button(action: { isPresented.toggle() }) {
                        Label("Cancel", systemImage: "oar.2.crossed")
                    }
                    .styledButton(type: .stroke)
                    
                    Button(action: { action(selectedRelationship.displayName, selectedRequestFor.title, profile.id) }) {
                        Label("Request", systemImage: "creditcard.and.123")
                    }
                    .styledButton(type: .primary)
                }
            }
            .padding([.horizontal, .bottom], 15)
            .background {
                RoundedRectangle(cornerRadius: 15)
                    .fill(.background)
                    .padding(.top, 30)
            }
            .shadow(color: .black.opacity(0.12), radius: 8)
            .padding(.horizontal, 15)
            .onAppear {
                if selectedRelationship.displayName.isEmpty { selectedRelationship = ProfileRelationship.father }
            }
        }
    }
    
}

#Preview {
    SearchProfilesView.ProfileRequestSheet(isPresented: .constant(true), action: {_, _, _ in}, profile: ProfileSearchResponse.mock.users!.first!)
}
