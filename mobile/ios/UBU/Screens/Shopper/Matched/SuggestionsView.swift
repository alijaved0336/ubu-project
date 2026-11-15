//
//  SuggestionsView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 11/12/2024.
//

import SwiftUI

struct SuggestionsView: View {
    @EnvironmentObject var dialogManager: DialogManager
    @State var matchedInfluencers: MatchedInfluencers?

    var body: some View {
        VStack {
            if let influencers = matchedInfluencers {
                MatchedInfluencersView(matchedInfluencers: influencers)
                    .toolbar(.visible, for: .tabBar)
            }
        }
        .onAppear {
            fetchMatchedInfluencers()
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
                // TODO: Check why are we getting this error
                print("❌ \(#function)")
//                dialogManager.showAlert(
//                    alertType: .notification,
//                    title: "Failed to fetched influencers",
//                    description: error.message,
//                    primaryAction: {}
//                )
            }
        }
    }
    
}

#Preview {
    SuggestionsView()
}
