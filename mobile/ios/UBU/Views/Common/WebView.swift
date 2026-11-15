//
//  WebView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 17/09/2024.
//

import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let urlString: String
    @Binding var isLoading: Bool
    @Binding var showError: Bool

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator

        if let url = URL(string: urlString) {
            let request = URLRequest(url: url)
            webView.load(request)
        }

        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

    class Coordinator: NSObject, WKNavigationDelegate {
        var parent: WebView

        init(parent: WebView) {
            self.parent = parent
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            parent.isLoading = false
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            parent.isLoading = false
            parent.showError = true
        }
        
        func webView(_ webView: WKWebView, didFailProvisionalLoadWithError error: Error) {
            parent.isLoading = false
            parent.showError = true
        }
        
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            parent.isLoading = false
            parent.showError = true
        }

    }
}

/// MARK: Webview Usage
/// Privacy Policy
/// Terms And Conditions
struct LinkTextView: View {
    var linkText: String
    var targetLink: String

    @State var showError: Bool = false
    @State var isLoading: Bool = true
    
    var body: some View {
        NavigationLink(destination: WebView(urlString: targetLink, isLoading: $isLoading, showError: $showError)) {
            Text(linkText)
                .font(UBUFonts.manropeExtraBold(withSize: 14))
                .foregroundStyle(.primaryColor)
                .lineSpacing(0)
        }
    }
}

#Preview {
    LinkTextView(linkText: "Terms", targetLink: "")
}
