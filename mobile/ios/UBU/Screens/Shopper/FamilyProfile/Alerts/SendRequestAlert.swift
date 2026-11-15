//
//  SendRequestAlert.swift
//  UBU
//
//  Created by Irtaza Fiaz on 12/06/2025.
//

import Foundation
import SwiftUI
import Combine

struct SendRequestAlert: View {
    @EnvironmentObject var dialogManager: DialogManager
    
    @Binding var isPresented: Bool
    @Binding var product: AmazonProductInfo?
    
    var onDismiss: (() -> Void)? = nil
    
    @State private var productQuantity = 1
    @State private var message: String = ""
    @State private var currentPage = 0
    @State private var quantityError: String? = nil
    
    @State private var openProductRequestAlert = false
    @State private var dialogType: DialogType?
    
    var body: some View {
        ScrollView {
            VStack(spacing: 10) {
                HStack {
                    Spacer()
                    Button { isPresented = false } label: {
                        Image("cross")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 24, height: 24)
                            .padding(12)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
                
                Image(systemName: "cart")
                    .resizable()
                    .foregroundStyle(.white)
                    .frame(width: 28, height: 28)
                    .padding(20)
                    .background(
                        Circle()
                            .fill(Color(hex: "#F79E1B"))
                            .overlay(
                                Circle()
                                    .stroke(Color(hex: "#F79E1B").opacity(0.2), lineWidth: 10)
                            )
                    )
                
                
                Text("Request to Buy")
                    .font(UBUFonts.manropeBold(withSize: 18))
                    .foregroundStyle(.primaryColor)
                
                if let title = product?.title {
                    Text("“\(title)” will be added to your requests.")
                        .font(UBUFonts.manropeSemibold(withSize: 14))
                        .foregroundStyle(.primaryColor.opacity(0.7))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
                
                ProductDetailRow
                
                VStack(alignment: .leading, spacing: 10) {
                    Text("Message to Buyer (Optional)")
                        .font(UBUFonts.manropeSemibold(withSize: 14))
                        .foregroundColor(.primaryColor)
                    
                    TextEditorWithPlaceholder(
                        text: $message,
                        placeholder: "Write down...",
                        minHeight: 72,
                        maxHeight: 72,
                        backgroundColor: .white
                    )
                    .font(UBUFonts.manropeSemibold(withSize: 14))
                    .toolbar {
                        ToolbarItemGroup(placement: .keyboard) {
                            Spacer()
                            Button("Done") {
                                UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
                            }
                        }
                    }
                    
                }
                .padding()
                .frame(maxWidth: .infinity)
                .background(StyledBackground())
                
                
                if let error = quantityError {
                    Text(error)
                        .font(UBUFonts.manropeSemibold(withSize: 14))
                        .foregroundColor(.red)
                        .padding(.top, 5)
                }
                
                Spacer()
                
                Button {
                    showRequestPopup()
                } label: {
                    HStack {
                        Image(systemName: "paperplane.fill")
                        Text("Send Request")
                            .font(UBUFonts.manropeBold(withSize: 16))
                    }
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.black)
                    .cornerRadius(8)
                }
            }
        }
        .alert(isPresented: $openProductRequestAlert) {
            if let dialogType {
                CustomDialogFactory.makeDialog(dialogType)
            }
        } background: {
            Color.black.opacity(0.5)
                .ignoresSafeArea()
        }
        .modifier(KeyboardAwareModifier())
        .hideKeyboardOnTap()
    }
    
    @ViewBuilder
    private var ProductDetailRow: some View {
        VStack(alignment: .leading) {
            productBanner
            
            HStack(alignment: .center) {
                VStack(alignment: .leading, spacing: 4) {
                    if let title = product?.title {
                        Text(title)
                            .font(UBUFonts.manropeBold(withSize: 14))
                            .foregroundColor(Color.black)
                            .lineLimit(2)
                    }
                    
                    Text("Quantity: \(productQuantity)")
                        .font(UBUFonts.manropeLight(withSize: 14))
                        .foregroundColor(Color(hex:"#475467"))
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                quantityActionButtons
            }.padding(.top)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .center)
        .background(StyledBackground())
        .padding(.vertical, 10)
    }
    
    @ViewBuilder
    private var productBanner: some View {
        ZStack {
            if let media = product?.images {
                ForEach(media.indices, id: \.self) { index in
                    WebImageView(
                        url: media[index],
                        width: 50,
                        height: 50,
                        shape: .circle,
                        scaleMode: .fill
                    )
                    .frame(width: 50, height: 50)
                    .clipShape(Circle())
                    .overlay(
                        Circle()
                            .stroke(Color.white, lineWidth: 1)
                    )
                    .shadow(color: .black.opacity(0.25), radius: 4, x: 1, y: 0)
                    .offset(x: CGFloat(index * 30), y: 0)
                    .zIndex(Double(media.count - index))
                }
            }
        }
        .frame(height: 40)
    }
    
    
    @ViewBuilder
    private var quantityActionButtons : some View {
        HStack {
            Button(action: {
                if productQuantity > 0 {
                    productQuantity -= 1
                    quantityError = nil
                }
            }) {
                Image(systemName: "minus")
                    .resizable()
                    .foregroundColor(.black)
                    .frame(width: 10, height: 2)
                    .padding(.vertical, 20)
                    .padding(6)
                    .background(
                        Circle()
                            .fill(Color.white)
                            .overlay(
                                Circle()
                                    .stroke(Color.black, lineWidth: 1)
                            )
                    )
            }
            .contentShape(Rectangle())
            
            Text("\(productQuantity)")
                .font(UBUFonts.manropeBold(withSize: 16))
                .foregroundColor(Color.black)
            
            Button(action: {productQuantity += 1 }) {
                Image(systemName: "plus")
                    .resizable()
                    .foregroundColor(.white)
                    .frame(width: 12, height: 12)
                    .padding(5)
                    .background(Circle().fill(Color.black))
            }
            .contentShape(Rectangle())
        }
    }
    
    private func showRequestPopup() {
        dialogType = .confirmation(
            title: "Product Request",
            message: "Are you sure you want to request this product?",
            confirmTitle: "Request",
            cancelTitle: "Cancel",
            onConfirm: sendRequestHandler,
            onCancel: { openProductRequestAlert.toggle() }
        )
        openProductRequestAlert.toggle()
    }
    
    private func sendRequestHandler() {
        if productQuantity == 0 {
            quantityError = "Quantity cannot be zero."
            return
        }
        guard let id = product?.id else { return }
        
        let params = ApiRequest.SendProductRequest(
            productId: id,
            quantity: productQuantity,
            message: message
        )
        
        NetworkService.shared.sendProductRequest(params: params) { result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    isPresented = false
                    onDismiss?()
                case .failure(let error):
                    dialogManager.showError(title: "Error", message: error.message)
                }
            }
        }
    }
}



#Preview {
    SendRequestAlert(
        isPresented: .constant(true),
        product: .constant(mockAmazonFavouritesProduct1)
    )
}


extension View {
    func hideKeyboardOnTap() -> some View {
        self.onTapGesture {
            UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
        }
    }
}

struct KeyboardAwareModifier: ViewModifier {
    @State private var keyboardHeight: CGFloat = 0
    
    func body(content: Content) -> some View {
        content
            .padding(.bottom, keyboardHeight)
            .animation(.easeOut(duration: 0.25), value: keyboardHeight)
            .onAppear {
                NotificationCenter.default.addObserver(
                    forName: UIResponder.keyboardWillShowNotification,
                    object: nil,
                    queue: .main
                ) { notif in
                    if let frame = notif.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect {
                        keyboardHeight = frame.height
                    }
                }
                
                NotificationCenter.default.addObserver(
                    forName: UIResponder.keyboardWillHideNotification,
                    object: nil,
                    queue: .main
                ) { _ in
                    keyboardHeight = 0
                }
            }
            .onDisappear {
                NotificationCenter.default.removeObserver(self)
            }
    }
}
