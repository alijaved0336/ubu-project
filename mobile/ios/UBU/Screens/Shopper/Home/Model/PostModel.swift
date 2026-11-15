//
//  PostModel.swift
//  UBU
//
//  Created by Irtaza Fiaz on 19/08/2024.
//

import Foundation

@MainActor
class PostModel: ObservableObject {
    
    let networkService: NetworkService
    @Published private(set) var homeFeedPost: HomeFeedPosts?
    @Published private(set) var followedInfluencers: [FollowedInfluencer] = []
    @Published private(set) var currentPage: Int = 0
    @Published private(set) var isLastPage: Bool = false
    private var isLoading = false
    
    @Published var matchedInfluencers: MatchedInfluencers?
    
    init(networkService: NetworkService) {
        self.networkService = networkService
        fetchHomeFeedPosts(page: currentPage, limit: 5) { _ in }
    }
    
    func fetchHomeFeedPosts(page: Int = 1, limit: Int = 5, completion: @escaping ((Bool) -> Void)) {
        guard !isLoading, !isLastPage else { return }
        isLoading = true
        currentPage += 1
        networkService.fetchHomeFeedPosts(page: currentPage, limit: limit) { result in
            DispatchQueue.main.async {
                self.isLoading = false
                switch result {
                    case .success(let success):
                        completion(true)
                        if success.posts?.isEmpty == true {
                            self.isLastPage = true
                        } else {
                            self.homeFeedPost?.posts?.append(contentsOf: success.posts ?? [])
                            ?? (self.homeFeedPost = success)
                        }
                    case .failure(let failure):
                        completion(false)
                        //                    NSLog(failure.localizedDescription)
                        //                    self.homeFeedPost = mockHomeFeedPosts
                }
            }
        }
    }
    
    func resetValuesAndRefresh(completion: @escaping ((Bool) -> Void)) {
        guard !isLoading else { return }
        currentPage = 0
        isLastPage = false
        isLoading = false
        homeFeedPost?.posts?.removeAll()
        
        fetchHomeFeedPosts() { result in completion(result) }
        NetworkService.shared.fetchShopperProfile { result in
            switch result {
                case .success(let profile):
                    StateManager.shared.updateUserProfile(with: profile)
                case.failure(let error):
                    NSLog("Error: \(error.localizedDescription)")
            }
        }
    }
    
    func fetchFollowedInfluencers() {
        networkService.fetchFollowedInfluencers() { result in
            switch result {
                case .success(let success):
                    self.followedInfluencers = success
                case .failure(let failure):
                    NSLog(failure.message)
                    // Remove: Preview Purposes
                    // self.followedInfluencers = mockFeedUserInfoList
            }
        }
    }
    
    private func fetchMatchedInfluencers() {
        NetworkService.shared.getMatchedInfluencers(pageNo: 1) { result in
            switch result {
                case .success(let influencers):
                    DispatchQueue.main.async {
                        self.matchedInfluencers = influencers
                    }
                case .failure(let error):
                    break
            }
        }
    }
    
    func removePost(_ postId: Int) {
        homeFeedPost?.posts?.removeAll(where: { $0.post.id == postId })
    }
    
}
