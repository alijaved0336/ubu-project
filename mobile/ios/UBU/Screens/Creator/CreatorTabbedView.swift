//
//  CustomTabBarView.swift
//  UBU
//
//  Created by Codingcops on 03/07/2025.
//

import SwiftUI

struct CreatorTabbedView: View {
    
    @EnvironmentObject var appState: StateManager
    @EnvironmentObject var dialogManager: DialogManager

    @Namespace var animation
    @State private var selectedTab: CreatorTabs = .posts
    
    var body: some View {
        NavigationStack {
            ZStack(alignment: .bottom) {
                contentView()
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                customTabBar
                    .padding(.bottom, 8)
            }
            .ignoresSafeArea(.keyboard)
        }
    }

    // MARK: - Tab Content
    @ViewBuilder
    private func contentView() -> some View {
        switch selectedTab {
        case .posts:
            PostsListView(dialogManager: dialogManager)
        case .transactions:
            WithdrawalHistoryView()
        case .profile:
            ProfileView()
                .environment(\.isTabBarVisible, .constant(false))
                .environment(\.isTopNavVisible, .constant(false))
        }
    }

    // MARK: - Custom Capsule Tab Bar
    var customTabBar: some View {
        HStack(spacing: 10) {
            ForEach(CreatorTabs.allCases, id: \.self) { tab in
                tabButton(for: tab)
            }
        }
        .padding(.vertical, 10)
        .padding(.horizontal, 10)
        .background(Color(hex: "1D1D1D"))
        .clipShape(Capsule())
        .padding(.horizontal, 10)
        .padding(.bottom, 0)
        .shadow(
            color: Color.white.opacity(0.13),
            radius: 12, y: 4
        )
    }

    @ViewBuilder
    private func tabButton(for tab: CreatorTabs) -> some View {
        let isSelected = selectedTab == tab

        Button(action: {
            withAnimation(.easeInOut) {
                selectedTab = tab
            }
        }) {
            HStack(spacing: isSelected ? 8 : 0) {
                Image(systemName: tab.iconName)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 18, height: 18)
                    .foregroundStyle(isSelected ? .primaryColor : .white)

                if isSelected {
                    Text(tab.title)
                        .font(.system(size: 14, weight: .medium))
                        .lineLimit(1)
                        .foregroundColor(.black)
                }
            }
            .padding(.horizontal, isSelected ? 20 : 0)
            .padding(.vertical, 8)
            .background(isSelected ? Color.white : Color.clear)
            .clipShape(Capsule())
        }
        .frame(minWidth: isSelected ? 0 : 44)
        .animation(.easeInOut, value: isSelected)
    }

}

#Preview {
    CreatorTabbedView()
        .environmentObject(StateManager.shared)
        .environmentObject(DialogManager())
}
