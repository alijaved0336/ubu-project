//
//  VideoPlayerView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 12/07/2024.
//

import SwiftUI
import AVKit

struct VideoPlayerView: View {
    @StateObject private var playerManager: PlayerManager
    @State private var isMuted: Bool = true
    private let previewable : Bool
    let height: CGFloat
    let displaySoundIcon: Bool
    @State private var showPreview: Bool = false
    private let url: String
    
    init(url: String, height: CGFloat = 450, displaySoundIcon: Bool = true, previewable: Bool = false) {
        _playerManager = StateObject(wrappedValue: PlayerManager(url: url))
        self.height = height
        self.displaySoundIcon = displaySoundIcon
        self.previewable = previewable
        self.url = url
    }
    
    var body: some View {
        VStack {
            ZStack(alignment: .topTrailing) {
                PlayerView(player: playerManager.player)
                    .onAppear {
                        playerManager.play()
                        playerManager.setMute(isMuted)
                    }
                    .onDisappear {
                        playerManager.pause()
                    }
                    .frame(height: height)
//                    .onTapGesture {   // for video preview
//                        showPreview = true
//                    }
                
                if displaySoundIcon {
                    Button(action: toggleMute) {
                        Image(systemName: isMuted ? "speaker.slash.fill" : "speaker.wave.1.fill")
                            .foregroundColor(.white)
                            .frame(width: 30, height: 30)
                            .background(Color.black.opacity(0.6))
                            .clipShape(Circle())
                            .padding()
                    }
                }
            }
        }
//        .fullScreenCover(isPresented: $showPreview) {
//            VideoPreview(isPresented: $showPreview, videoURL: URL(string: url)!)
//        }
    }
    
    private func toggleMute() {
        isMuted.toggle()
        playerManager.setMute(isMuted)
    }
}

// MARK: - AVPlayer Manager (Handles Looping)
class PlayerManager: ObservableObject {
    @Published var player: AVPlayer
    
    init(url: String) {
        let videoURL = URL(string: url)!
        self.player = AVPlayer(url: videoURL)
        self.player.actionAtItemEnd = .none
        
        // Listen for when the video reaches the end
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(videoDidEnd),
                                               name: .AVPlayerItemDidPlayToEndTime,
                                               object: player.currentItem)
    }
    
    func play() {
        player.play()
    }
    
    func pause() {
        player.pause()
    }
    
    func setMute(_ mute: Bool) {
        player.isMuted = mute
    }
    
    @objc private func videoDidEnd() {
        // Restart the video when it reaches the end
        player.seek(to: .zero)
        player.play()
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}

// MARK: - Player View
struct PlayerView: UIViewRepresentable {
    var player: AVPlayer
    
    func makeUIView(context: Context) -> PlayerUIView {
        return PlayerUIView(player: player)
    }
    
    func updateUIView(_ uiView: PlayerUIView, context: Context) {
        uiView.playerLayer.player = player
    }
}

class PlayerUIView: UIView {
    let playerLayer = AVPlayerLayer()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    init(player: AVPlayer) {
        super.init(frame: .zero)
        setupPlayer(player: player)
    }
    
    deinit {
        playerLayer.player = nil
        NotificationCenter.default.removeObserver(self)
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        playerLayer.frame = bounds
    }
    
    private func setupPlayer(player: AVPlayer) {
        playerLayer.player = player
        layer.addSublayer(playerLayer)
        playerLayer.videoGravity = .resizeAspectFill
    }
}
//
//extension View {
//    @ViewBuilder
//    func `if`<Content: View>(_ condition: Bool, transform: (Self) -> Content) -> some View {
//        if condition {
//            transform(self)
//        } else {
//            self
//        }
//    }
//}


#Preview {
    VideoPlayerView(url: "https://videos.pexels.com/video-files/4065629/4065629-sd_506_960_25fps.mp4")
}


