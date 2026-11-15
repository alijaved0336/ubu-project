//
//  ResizableLottieView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 13/11/2024.
//

import Foundation
import SwiftUI
import UIKit
import Lottie

struct ResizableLottieView: UIViewRepresentable {
    var fileName: String
    @Binding var isPlaying: Bool
    
    func makeUIView(context: Context) -> some UIView {
        let view = UIView()
        view.backgroundColor = .clear
        addLottieView(view: view)
        return view
    }
    
    func updateUIView(_ uiView: UIViewType, context: Context) {
        uiView.subviews.forEach { view in
            if view.tag == 1009, let lottieView = view as? LottieAnimationView {
                if isPlaying {
                    lottieView.play()
                } else {
                    lottieView.pause()
                }
            }
        }
    }
    
    func addLottieView(view to: UIView) {
        let lottieView = LottieAnimationView(name: fileName, bundle: .main)
        lottieView.backgroundColor = .clear
        lottieView.tag = 1009
        lottieView.translatesAutoresizingMaskIntoConstraints = false
        
        let constraints = [
            lottieView.widthAnchor.constraint(equalTo: to.widthAnchor),
            lottieView.heightAnchor.constraint(equalTo: to.heightAnchor),
        ]
        
        to.addSubview(lottieView)
        to.addConstraints(constraints)
    }
    
}
