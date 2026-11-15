//
//  DialogManager.swift
//  UBU
//
//  Created by Irtaza Fiaz on 14/07/2025.
//

import SwiftUI

final class DialogManager: ObservableObject {
    @Published var isPresented: Bool = false
    @Published var type: DialogType = .none

    func showError(
        title: String,
        message: String,
        buttonTitle: String = "OK",
        action: (() -> Void)? = nil
    ) {
        type = .error(
            title: title,
            message: message,
            buttonTitle: buttonTitle,
            action: { [weak self] in
                action?()
                self?.dismiss()
            }
        )
        isPresented = true
    }

    func showConfirmation(
        title: String,
        message: String,
        confirmTitle: String = "Yes",
        cancelTitle: String = "No",
        onConfirm: (() -> Void)? = nil,
        onCancel: (() -> Void)? = nil
    ) {
        type = .confirmation(
            title: title,
            message: message,
            confirmTitle: confirmTitle,
            cancelTitle: cancelTitle,
            onConfirm: { [weak self] in
                onConfirm?()
                self?.dismiss()
            },
            onCancel: { [weak self] in
                onCancel?()
                self?.dismiss()
            }
        )
        isPresented = true
    }
    
    func showNotification(
        title: String,
        message: String,
        buttonTitle: String = "OK",
        onConfirm: (() -> Void)? = nil
    ) {
        type = .notification(
            title: title,
            message: message,
            buttonTitle: buttonTitle,
            onConfirm: { [weak self] in
                onConfirm?()
                self?.dismiss()
            }
        )
        isPresented = true
    }

    func dismiss() {
        isPresented = false
        type = .none
    }
}

