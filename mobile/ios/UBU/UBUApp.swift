//
//  UBUApp.swift
//  UBU
//
//  Created by Irtaza Fiaz on 19/06/2024.
//

import SwiftUI
import SwiftUI
import UIKit
import FacebookCore
import GoogleSignIn
import AWSS3
import AWSCore
import ArkanaKeys
import SDWebImage
import SDWebImageSVGCoder
import LogRocket
import Firebase
import FirebaseMessaging
import UserNotifications


class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {
    
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        if FirstLaunchGuard.isFirstLaunch {
            KeychainManager.shared.wipeUBUItems()
        }
        FirebaseApp.configure()
        UNUserNotificationCenter.current().delegate = self
        Messaging.messaging().delegate = self
        
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
            print("Notification permission granted: \(granted)")
            guard granted else { return }
            DispatchQueue.main.async {
                application.registerForRemoteNotifications()
            }
        }
        
        ApplicationDelegate.shared.application(application, didFinishLaunchingWithOptions: launchOptions)
        SDK.initialize(configuration: Configuration(appID: "ha3odk/ubu"))
        GIDSignIn.sharedInstance.restorePreviousSignIn { user, error in
            if let error = error {
                print("Google Sign-In Error: \(error.localizedDescription)")
            }
        }
        
        configureSDWebImage()
        return true
    }
    
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
    }
    
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        print("✅ FCM Token: \(fcmToken ?? "")")
        guard let token = fcmToken, let userId = StateManager.shared.userProfile?.userId else { return }
        NetworkService.shared.registerForPushNotifications(token: token, userId: userId)
    }
    
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        completionHandler([.banner, .sound, .badge])
    }
    
    private func configureSDWebImage() {
        SDImageCache.shared.config.maxMemoryCost = 50 * 1024 * 1024
        SDImageCache.shared.config.maxDiskSize = 200 * 1024 * 1024
        SDImageCache.shared.config.shouldUseWeakMemoryCache = true
    }
    
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        if GIDSignIn.sharedInstance.handle(url) || ApplicationDelegate.shared.application(app, open: url, options: options) {
            return true
        }
        print("Unhandled URL: \(url)")
        return true
    }
    
    func application(_ application: UIApplication, willContinueUserActivityWithType userActivityType: String) -> Bool {
        print("Continue User Activity")
        return true
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                didReceive response: UNNotificationResponse,
                                withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        print("Notification tapped: \(userInfo)")
        completionHandler()
    }
    
}


@main
struct UBUApp: App {
    
    @Environment(\.scenePhase) var scenePhase
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    
    @ObservedObject private var appState = StateManager.shared
    @StateObject private var dialogManager = DialogManager()
    
    @State private var showSplashView = true
    @State private var progress = 0.0
    private let totalProgressCount = 40.0
    
    @State private var tappedUrl: String = ""
    @State private var isAuthenticated: Bool = false
    @State private var showError: Bool = false

    init() {
        let svgCoder = SDImageSVGCoder.shared
        SDImageCodersManager.shared.addCoder(svgCoder)
        configureAWS()
    }
    
    var body: some Scene {
        WindowGroup {
            ZStack {
                if progress < totalProgressCount {
                    SplashView(progress: $progress, totalProgressCount: totalProgressCount)
                } else {
                    contentView()
                }
            }
            .environmentObject(dialogManager)
            .environmentObject(dialogManager)
            .environmentObject(appState)
            .blur(radius: appState.networkLoading || appState.matchesLoading ? 10 : 0)
            .onAppear{
                NetworkService.shared.checkAuthTokenStorage()
            }
            .alert(isPresented: $dialogManager.isPresented) {
                CustomDialogFactory.makeDialog(dialogManager.type)
            } background: {
                Color.black.opacity(0.5).ignoresSafeArea()
            }
            .overlay(loadingOverlay())
            .onOpenURL { handleIncomingURL($0) }
            .onContinueUserActivity(NSUserActivityTypeBrowsingWeb, perform: handleUserActivity)
        }
    }
    
    // MARK: - AWS Configuration
    private func configureAWS() {
        let credentialsProvider = AWSStaticCredentialsProvider(
            accessKey: ArkanaKeys.Keys.Global().accessKey,
            secretKey: ArkanaKeys.Keys.Global().secretKey
        )
        let configuration = AWSServiceConfiguration(
            region: .USEast2,
            credentialsProvider: credentialsProvider
        )
        AWSServiceManager.default().defaultServiceConfiguration = configuration
        let transferUtilityConfiguration = AWSS3TransferUtilityConfiguration()
        transferUtilityConfiguration.isAccelerateModeEnabled = false
        
        AWSS3TransferUtility.register(
            with: configuration!,
            transferUtilityConfiguration: transferUtilityConfiguration,
            forKey: "S3TransferUtility"
        )
    }
    
    // MARK: - Content View
    @ViewBuilder
    private func contentView() -> some View {
        switch appState.appRoute {
            case .login:
                LoginView()
            case .register:
                RegisterView()
            case .tabview:
                if appState.userRole == .influencer {
                    CreatorTabbedView()
                } else {
                    TabbedView()
                }
            case .creatorScan:
                NavigationStack { BodygramMetricsView() }
            case .resetPassword:
                CreateNewPassword(resetPasswordUrl: tappedUrl)
            case .shopperSurvey:
                SurveyView(shouldLoadAllQuestions: false)
            case .creatorSurvey:
                NavigationStack { CreatorOnboardingIntroView(shouldLoadAllQuestions: false) }
        }
    }
    
    // MARK: - Loading Overlay
    @ViewBuilder
    private func loadingOverlay() -> some View {
        if appState.networkLoading {
            LoadingView()
        } else if appState.matchesLoading {
            MatchLoadingView()
        }
    }
    
    // MARK: - URL Handling
    private func handleIncomingURL(_ url: URL) {
        print("URL opened: \(url)")
        
        switch url.path {
            case "/body-scan":
                setScanCredentials(with: url)
            case "/reset-password":
                if url.queryParameters["token"] != nil {
                    tappedUrl = url.absoluteString
                    StateManager.shared.updateRoute(route: .resetPassword)
                }
            default:
                print("Unhandled deep link path: \(url.path)")
        }
    }
    
    private func handleUserActivity(_ userActivity: NSUserActivity) {
        guard let incomingUrl = userActivity.webpageURL else { return }
        print("Continuing activity via URL: \(incomingUrl)")
        
        handleIncomingURL(incomingUrl)
    }
    
    // MARK: - Scan Credentials
    private func setScanCredentials(with url: URL) {
        tappedUrl = url.absoluteString
        appState.bodyscanUrl = url.absoluteString
        appState.userRole = .influencer
        StateManager.shared.updateRoute(route: .creatorScan)
    }
}

// MARK: - URL Query Parameters Extension
private extension URL {
    var queryParameters: [String: String] {
        guard let query = self.query else { return [:] }
        var parameters: [String: String] = [:]
        for pair in query.split(separator: "&") {
            let keyValue = pair.split(separator: "=", maxSplits: 1).map(String.init)
            if keyValue.count == 2 {
                parameters[keyValue[0]] = keyValue[1]
            }
        }
        return parameters
    }
}

