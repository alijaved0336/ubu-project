//
//  ContentStateWrapper.swift
//  UBU
//
//  Created by Irtaza Fiaz on 22/07/2025.
//

import SwiftUI

// MARK: - Content State Enum
enum ContentState<T> {
    case idle
    case loading
    case loaded([T])
    case empty
    case error(String)
}

protocol ContentLoadableList {
    associatedtype Item: Identifiable
    associatedtype RowView: View

    var title: String { get }
    var tab: String? { get }

    func load(completion: @escaping (ContentState<Item>) -> Void)
    @ViewBuilder func row(for item: Item, refresh: @escaping () -> Void) -> RowView
}


struct GenericContentListView<Loader: ContentLoadableList>: View {
    @State private var state: ContentState<Loader.Item> = .idle

    let loader: Loader

    private func loadData() {
        state = .loading
        loader.load { newState in
            self.state = newState
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            if let tabTitle = loader.tab {
                Text(tabTitle)
                    .font(.headline)
                    .padding(.top)
            }

            ContentStateView(
                state: state,
                content: { items in
                    ScrollView {
                        VStack(spacing: 12) {
                            ForEach(items) { item in
                                loader.row(for: item, refresh: loadData)
                            }
                        }
                        .padding()
                    }
                    .refreshable {
                        loadData()
                    }
                }
            )
        }
        .onAppear {
            guard case .idle = state else { return }
            loadData()
        }
    }
}


struct ContentStateView<T, Content: View>: View {
    let state: ContentState<T>
    let content: ([T]) -> Content
    var emptyView: AnyView = AnyView(DefaultEmptyView())
    var loadingView: AnyView = AnyView(DefaultLoadingView())
    var errorView: (String) -> AnyView = { message in AnyView(DefaultErrorView(message: message)) }

    
    var body: some View {
        switch state {
            case .idle, .loading:
                loadingView
            case .loaded(let data):
                if data.isEmpty {
                    emptyView
                } else {
                    content(data)
                }
            case .empty:
                emptyView
            case .error(let message):
                errorView(message)
        }
    }
}

struct DefaultLoadingView: View {
    var body: some View {
        VStack {
            Spacer()
            ProgressView("Loading...")
                .progressViewStyle(.circular)
                .padding()
            Spacer()
        }
    }
}

struct DefaultEmptyView: View {
    var body: some View {
        VStack {
            Spacer()
            Text("No data found.")
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            Spacer()
        }
    }
}

struct DefaultErrorView: View {
    let message: String
    var body: some View {
        VStack {
            Spacer()
            Text(message)
                .foregroundColor(.red)
                .multilineTextAlignment(.center)
                .padding()
            Spacer()
        }
    }
}
