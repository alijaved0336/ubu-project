//
//  ScrollViewModel.swift
//  UBU
//
//  Created by Irtaza Fiaz on 13/11/2024.
//

import Foundation
import UIKit

class ScrollViewModel: NSObject, ObservableObject, UIGestureRecognizerDelegate {
    let gestureId: String = UUID().uuidString
    
    @Published var isEligible: Bool = false
    @Published var isRefreshing: Bool = false
    
    @Published var scrollOffset: CGFloat = 0
    @Published var contentOffset: CGFloat = 0
    @Published var progress: CGFloat = 0
    
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
        return true
    }
    
    func addGesture() {
        let panGesture = UIPanGestureRecognizer(target: self, action: #selector(onGestureChange(gesture:)))
        panGesture.delegate = self
        panGesture.name = gestureId
        getRootController().view.addGestureRecognizer(panGesture)
    }
    
    func removeGesture() {
        getRootController().view.gestureRecognizers?.removeAll(where: { gesture in gesture.name == gestureId })
    }
    
    @objc
    func onGestureChange(gesture: UIPanGestureRecognizer) {
        if gesture.state == .cancelled || gesture.state == .ended {
            NSLog("User released the touch.")
            if !isRefreshing {
                isEligible = scrollOffset > 150 ? true : false
            }
        }
    }
    
    private func getRootController() -> UIViewController {
        guard let screen = UIApplication.shared.connectedScenes.first as? UIWindowScene else {
            return .init()
        }
        guard let root = screen.windows.first?.rootViewController else {
            return .init()
        }
        return root
    }
    
}
