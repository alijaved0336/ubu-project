//
//  ImagePicker.swift
//  UBU
//
//  Created by Irtaza Fiaz on 11/11/2024.
//

import Foundation
import SwiftUI

struct ImagePicker: UIViewControllerRepresentable {
    typealias UIViewControllerType = UIImagePickerController
    typealias Coordinator = ImagePickerCoordinator

    @Binding var isImagePickerShown: Bool
    var sourceType: UIImagePickerController.SourceType = .camera
    var onImagePicked: ((UIImage) -> Void)? = nil

    func makeUIViewController(context: Context) -> UIImagePickerController {
        guard UIImagePickerController.isSourceTypeAvailable(sourceType) else {
            fatalError("Unsupported source type")
        }

        let picker = UIImagePickerController()
        picker.sourceType = sourceType
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }
}

class ImagePickerCoordinator: NSObject, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
    let parent: ImagePicker

    init(parent: ImagePicker) {
        self.parent = parent
    }

    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
        if let selectedImage = info[.originalImage] as? UIImage {
            parent.onImagePicked?(selectedImage)
        }
        parent.isImagePickerShown = false
    }

    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        parent.isImagePickerShown = false
    }
}

