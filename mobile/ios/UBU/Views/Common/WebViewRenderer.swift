//
//  WebViewRenderer.swift
//  UBU
//
//  Created by Irtaza Fiaz on 24/03/2025.
//

import SwiftUI
import WebKit

struct WebViewRenderer: UIViewRepresentable {
    
    private let webView: WKWebView
    private var htmlContent: String
    let avatarData: String
    
    init(avatarData: String) {
        self.avatarData = avatarData

        let configuration = BGWebViewConfiguration()
        webView = BGWebView(frame: .zero, configuration: configuration)
        print("✅ WebView initialized with BGWebViewConfiguration")

        if let filepath = Bundle.main.path(forResource: "bodygramAvatar", ofType: "html") {
            print("✅ Found bodygramAvatar.html at path: \(filepath)")
            do {
                let html = try String(contentsOfFile: filepath)
                self.htmlContent = html.replacingOccurrences(of: "{{avatarString}}", with: avatarData.replacingOccurrences(of: "\n", with: ""))
                print("✅ HTML content loaded and avatarData injected")
            } catch {
                fatalError("❌ Failed to read HTML file: \(error)")
            }
        } else {
            fatalError("❌ HTML file not found in Bundle")
        }
    }
    
    func makeUIView(context: Context) -> WKWebView {
        let configuration = webView.configuration
        webView.isUserInteractionEnabled = true
        webView.configuration.preferences.javaScriptEnabled = true
        webView.configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        print("✅ WebView is now interactive")

        webView.navigationDelegate = context.coordinator
        webView.loadHTMLString(htmlContent, baseURL: Bundle.main.bundleURL)
        print("✅ WebView loading HTML content")

        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {
        print("🔄 updateUIView called")
    }
    
    func makeCoordinator() -> Coordinator {
        return Coordinator(self)
    }
    
    class Coordinator: NSObject, WKNavigationDelegate {
        var parent: WebViewRenderer
        
        init(_ parent: WebViewRenderer) {
            self.parent = parent
        }
        
        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            print("📡 WebView started loading...")
        }
        
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            print("✅ WebView finished loading")
        }
        
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            print("❌ WebView failed to load with error: \(error)")
        }
        
        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            print("🔎 WebView Navigation request: \(navigationAction.request.url?.absoluteString ?? "Unknown URL")")
            decisionHandler(.allow)
        }
    }
}

