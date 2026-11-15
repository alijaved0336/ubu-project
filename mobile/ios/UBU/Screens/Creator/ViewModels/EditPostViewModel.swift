//
//  EditPostViewModel.swift
//  UBU
//
//  Created by Irtaza Fiaz on 26/11/2024.
//

import Foundation
import SwiftUI
import PhotosUI

// MARK: - Unified Media Item
enum AttachedMediaItem: Identifiable {
    case remote(CreatorMedia)
    case local(Attachment)
    
    var id: String {
        switch self {
        case .remote(let media):  return media.url
        case .local(let attach):  return attach.hashValue.description
        }
    }
}


// MARK: - Equatable
extension AttachedMediaItem: Equatable {
    static func == (lhs: AttachedMediaItem, rhs: AttachedMediaItem) -> Bool {
        switch (lhs, rhs) {
        case let (.remote(a), .remote(b)):
            return a.url == b.url
        case let (.local(a), .local(b)):
            return a.hashValue == b.hashValue
        default:
            return false
        }
    }
}

// MARK: - Hashable
extension AttachedMediaItem: Hashable {
    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}


// MARK: - View Model
final class EditPostViewModel: ObservableObject {
    // MARK: Published Properties
    @Published var post: CreatorPost
    @Published var status: CreatorPostStatus
    @Published var postTags: [Tag]
    @Published var attachments: [Attachment] = [] {
        didSet { syncItems() }
    }
    @Published var items: [AttachedMediaItem] = []
    
    @Published var selectedItems: [PhotosPickerItem] = []
    @Published var toast: Toast?
    @Published var errorMessage = ""
    @Published var showErrorAlert = false
    
    @Published var affiliateLink = ""
    @Published var awsProduct: AmazonProductResponse?
    @Published var showAddProductSheet = false
    @Published var showProductPreview = false
    
    @Published var uploadProgress: Double = 0.0
    @Published var isEditingImage = false
    @Published var imageToEdit: UIImage?
    @Published var isImageLoading = false
    var imageEditCompletion: ((UIImage?) -> Void)?
    
    // MARK: Init
    init(post: CreatorPost) {
        self.post = post
        self.status = post.status ?? .draft
        self.postTags = post.tags?.map { Tag(name: $0) } ?? []
        syncItems()
    }
    
    // MARK: - Public Methods
    
    /// Handles new selections from the PhotosPicker
    @MainActor
    func handleSelectedItemsChange() async {
        for pickerItem in selectedItems {
            guard let data = try? await pickerItem.loadTransferable(type: Data.self) else { continue }
            defer { isImageLoading = false }
            
            if let image = UIImage(data: data) {
                isImageLoading = true
                let editedImage: UIImage? = await withCheckedContinuation { continuation in
                    Task { @MainActor in
                        imageEditCompletion = { result in continuation.resume(returning: result) }
                        imageToEdit = image
                        isEditingImage = true
                    }
                }
                if let edited = editedImage,
                   let compressed = edited.jpegData(compressionQuality: 0.8) {
                    let sizeStr = compressed.count.byteSize
                    let mb = compressed.megabytes
                    attachments.append(.photo(edited, size: sizeStr, megabytes: mb))
                }
            } else {
                let sizeStr = data.count.byteSize
                let mb = data.megabytes
                attachments.append(.video(data, size: sizeStr, megabytes: mb))
            }
        }
        syncItems()
        selectedItems.removeAll()
    }
    
    /// Initiates the post update network call
    func updatePost(completion: @escaping () -> Void) {
        guard validateInputs() else { return }
        do { try checkAttachmentSizes() }
        catch { handleError("One of the files exceeds the 30 MB limit."); return }
        
        let attachedMediaRequestParam = items.compactMap { item -> ApiRequest.MediaFile? in
            guard case let .local(attachment) = item else { return nil }
            switch attachment {
            case .photo(let img, _, _):
                return .init(data: img.jpegData(compressionQuality: 0.5), type: .image)
            case .video(let vid, _, _):
                return .init(data: vid, type: .video)
            }
        }
        
        let fetchedRemoteImagesRequestParam = items
            .enumerated()
            .compactMap { index, item -> CreatorMedia? in
                guard case let .remote(media) = item else { return nil }
                return CreatorMedia(
                    url: media.url,
                    type: media.type,
                    extensionType: media.extensionType,
                    thumbnail: media.thumbnail,
                    locationIndex: "\(index)"
                )
            }
        
        let request = ApiRequest.EditPostRequest(
            id: String(post.id),
            title: post.title,
            body: post.body,
            files: attachedMediaRequestParam,
            status: status.rawValue,
            tags: postTags.map(\.name).joined(separator: ", "),
            productData: post.productData,
            urls: fetchedRemoteImagesRequestParam
        )
        
        NetworkService.shared.updatePost(
            post: request,
            progressHandler: { [weak self] p in DispatchQueue.main.async { self?.uploadProgress = p } },
            completion: { [weak self] success, error in
                DispatchQueue.main.async {
                    if let err = error {
                        self?.handleError(err.message)
                    } else {
                        self?.toast = Toast(message: "Post updated successfully.", type: .success)
                        DispatchQueue.main.asyncAfter(deadline: .now() + 3, execute: completion)
                    }
                }
            }
        )
    }
    
    /// Retrieves AWS product details from the affiliate link
    func fetchAwsProduct() {
        NetworkService.shared.fetchAwsProduct(amazonLink: affiliateLink) { [weak self] response in
            DispatchQueue.main.async {
                switch response {
                case .success(let product):
                    self?.awsProduct = product
                    self?.showAddProductSheet = true
                case .failure:
                    self?.handleError("Please enter a valid Amazon product link.")
                }
            }
        }
    }
    
    func clearAwsProduct() {
        awsProduct = nil
    }
    
    /// Removes a remote media entry and syncs the items
    func removeMedia(_ media: CreatorMedia) {
        post.media?.removeAll { $0.url == media.url }
        syncItems()
    }
    
    /// Removes a local attachment and syncs the items
    func removeAttachment(_ attachment: Attachment) {
        attachments.removeAll { $0.id == attachment.id }
        syncItems()
    }
    
    /// Deletes a unified media item (remote or local)
    func delete(_ item: AttachedMediaItem) {
        switch item {
        case .remote(let m): removeMedia(m)
        case .local(let a): removeAttachment(a)
        }
    }
    
    // MARK: - Computed Properties
    
    var remoteMedia: [CreatorMedia] {
        items.compactMap {
            if case let .remote(m) = $0 { return m } ; return nil
        }
    }
    
    var localAttachments: [Attachment] {
        items.compactMap {
            if case let .local(a) = $0 { return a } ; return nil
        }
    }
    
    // MARK: - Private Helpers
    
    /// Synchronizes the unified `items` array
    private func syncItems() {
        let remotes = post.media?.map(AttachedMediaItem.remote) ?? []
        let locals = attachments.map(AttachedMediaItem.local)
        items = remotes + locals
    }
    
    private func validateInputs() -> Bool {
        guard !post.title.isEmpty else { handleError("Please enter a title."); return false }
        guard !post.body.isEmpty else { handleError("Please enter the post description."); return false }
        guard !(post.productData?.isEmpty ?? true) else {
            handleError("Please add and fetch the Amazon product link."); return false
        }
        return true
    }
    
    private func checkAttachmentSizes() throws {
        for attach in attachments where attach.sizeInMB > 30.0 {
            throw AttachmentError.fileTooLarge
        }
    }
    
    private func handleError(_ message: String) {
        errorMessage = message
        showErrorAlert = true
    }
}

