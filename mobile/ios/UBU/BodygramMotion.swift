//
//  BodygramMotion.swift
//  UBU
//
//  Created by Irtaza Fiaz on 04/03/2025.
//

import SwiftUI
@preconcurrency import WebKit
import AVFoundation

struct BodygramMotion: View {
    @State private var bodygramToken: String?
    @State private var bodygramScannerURL: URL?
    
    var body: some View {
        Group {
            if let url = bodygramScannerURL {
                BodygramMotionWebView(url: url)
                    .ignoresSafeArea()
            } else {
                ProgressView("Loading...")
            }
        }
        .onAppear {
            createScanAndContinue()
        }
        .ignoresSafeArea()
    }
    
    private func createScanAndContinue() {
        NetworkService.shared.createScanToken { result in
            switch result {
            case .success(let response):
                DispatchQueue.main.async {
                    self.bodygramToken = response.token
                    self.bodygramScannerURL = URL(string: "https://www.platform.bodygram.com/org_3pDj1gQg89i981uZre7rIc/scan?token=\(response.token)&system=metric&height=170&weight=70&age=25&gender=male&screens=scan&can-save-as-image=false")
                }
            case .failure(let failure):
                NSLog("🌝 BodygramMotion/createScanAndContinue", failure.message)
            }
        }
    }
}

struct BodygramMotionWebView: UIViewRepresentable {
    let url: URL
    
    func makeCoordinator() -> BodygramMotionCoordinator {
        return BodygramMotionCoordinator(self)
    }
    
    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        
        if #available(iOS 14.0, *) {
            configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        }
        
        let contentController = WKUserContentController()
        contentController.add(context.coordinator, name: "BGScanflowJSWebviewInterface")
        
        let jsInterface = """
            window.BGScanflowJSWebviewInterface = {
                postMessage: function(message) {
                    window.webkit.messageHandlers.BGScanflowJSWebviewInterface.postMessage(message);
                }
            };
            """
        
        let userScript = WKUserScript(source: jsInterface, injectionTime: .atDocumentStart, forMainFrameOnly: false)
        contentController.addUserScript(userScript)
        configuration.userContentController = contentController
        
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        
        let request = URLRequest(url: url)
        webView.load(request)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            let jsScript = """
                window.BGScanflowJSWebviewInterface = function(fnName, args) {
                    window.webkit.messageHandlers.BGScanflowJSWebviewInterface.postMessage({ fnName: fnName, args: args });
                };
                """
            webView.evaluateJavaScript(jsScript, completionHandler: nil)
        }
        
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {}
    
    @MainActor
    class BodygramMotionCoordinator: NSObject, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {
        var parent: BodygramMotionWebView
        
        init(_ parent: BodygramMotionWebView) {
            self.parent = parent
        }
        
        // Handle JavaScript messages
        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            print("ddd")
            guard message.name == "BGScanflowJSWebviewInterface",
                  let body = message.body as? [String: Any],
                  let function = body["fnName"] as? String else { return }
            
            switch function {
            case "onRequestClose":
                print("Scanner closed: \(body["args"] ?? "")")
            case "onSuccess":
                print("Scan successful: \(body["args"] ?? "")")
            case "onError":
                print("Scan error: \(body["args"] ?? "")")
            default:
                print("Unknown function: \(function)")
            }
        }
        
        
        
        // Handle navigation decisions
        func webView(_ webView: WKWebView, decidePolicyFor navigationResponse: WKNavigationResponse, decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void) {
            decisionHandler(.allow)
        }
    }
}

// Camera Permission Manager
class CameraPermissionManager {
    static func requestCameraPermission(completion: @escaping (Bool) -> Void) {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            completion(true)
        case .denied, .restricted:
            completion(false)
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { granted in
                DispatchQueue.main.async {
                    completion(granted)
                }
            }
        @unknown default:
            completion(false)
        }
    }
}


