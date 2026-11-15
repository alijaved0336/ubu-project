//
//  DynamicRefreshView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 13/11/2024.
//

import SwiftUI
import Lottie

struct DynamicRefreshView<Content: View>: View {
    var content: Content
    var showsIndicator: Bool
    var lottieFileName: String
    
    var onRefresh: () async -> ()
    
    @StateObject var scrollVM: ScrollViewModel = .init()
    
    init(showsIndicator: Bool = false,lottieFileName: String,@ViewBuilder content: @escaping ()->Content,onRefresh: @escaping ()async->()){
        self.showsIndicator = showsIndicator
        self.lottieFileName = lottieFileName
        self.content = content()
        self.onRefresh = onRefresh
    }
    
    var body: some View {
        ScrollView(.vertical, showsIndicators: showsIndicator) {
            VStack(spacing: 0) {
                GeometryReader { proxy in
                    ResizableLottieView(fileName: lottieFileName, isPlaying: $scrollVM.isRefreshing)
                        .scaleEffect(scrollVM.isEligible ? 1 : 0.001)
                        .animation(.easeInOut(duration: 0.2), value: scrollVM.isEligible)
                        .overlay {
                            VStack(spacing: 12) {
                                Image(systemName: "arrow.down")
                                    .font(.caption.bold())
                                    .foregroundColor(.white)
                                    .rotationEffect(.init(degrees: scrollVM.progress * 180))
                                    .padding(8)
                                    .background(.primary,in: Circle())
                                
                                Text("Pull To Refresh")
                                    .font(.caption.bold())
                                    .foregroundColor(.primary)
                            }
                            .opacity(scrollVM.isEligible ? 0 : 1)
                            .animation(.easeInOut(duration: 0.25), value: scrollVM.isEligible)
                        }
                        .frame(height: 150)
                        .opacity(scrollVM.progress)
                        .offset(y: scrollVM.isEligible ? -(scrollVM.contentOffset < 0 ? 0 : scrollVM.contentOffset) : -(scrollVM.scrollOffset < 0 ? 0 : scrollVM.scrollOffset))
                }
                .frame(height: 0)
                .offset(y: -75 + (75 * scrollVM.progress))
                
                content.offset(y: scrollVM.progress * 150)
            }
            .offset(coordinateSpace: "SCROLL") { offset in
                scrollVM.contentOffset = offset
                
                if !scrollVM.isEligible {
                    var progress = offset / 150
                    progress = (progress < 0 ? 0 : progress)
                    progress = (progress > 1 ? 1 : progress)
                    scrollVM.scrollOffset = offset
                    scrollVM.progress = progress
                }
                
                if scrollVM.isEligible && !scrollVM.isRefreshing {
                    scrollVM.isRefreshing = true
                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                }
                
            }
        }
        .coordinateSpace(name: "SCROLL")
        .onAppear(perform: scrollVM.addGesture)
        .onDisappear(perform: scrollVM.removeGesture)
        .onChange(of: scrollVM.isRefreshing) {
            if scrollVM.isRefreshing {
                Task {
                    await onRefresh()
                    
                    withAnimation(.easeInOut(duration: 0.25)) {
                        scrollVM.progress = 0
                        scrollVM.isEligible = false
                        scrollVM.isRefreshing = false
                        scrollVM.scrollOffset = 0
                    }
                }
            }
        }
    }
}

#Preview {
    DynamicRefreshView(showsIndicator: false, lottieFileName: "Hand-Loader") {
        Rectangle()
            .fill(.red)
            .frame(height: 200)
    } onRefresh: {
        try? await Task.sleep(nanoseconds: 3_000_000_000)
    }
}
