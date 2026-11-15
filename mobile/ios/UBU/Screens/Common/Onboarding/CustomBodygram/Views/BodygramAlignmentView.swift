//
//  BodygramAlignmentView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 12/03/2025.
//

import SwiftUI
import CoreMotion

struct BodygramAlignmentView: View {
    @EnvironmentObject var viewModel: BodygramMeasurementVM
    @StateObject private var motionManager = MotionManagera()
    @State private var openBodygramScanView = false 
    
    var body: some View {
        VStack(alignment: .center) {
            UBUTopNavbar()
                .padding(.horizontal)
            
            Text(motionManager.isAligned ? "Your device is set!" : "Place the dot in the center by adjusting the device angle")
                .font(UBUFonts.manropeExtraBold(withSize: 20))
                .foregroundColor(.primaryColor)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
            
            if motionManager.isAligned {
                Text("Now we are going to take 2 photos of you.")
                    .font(UBUFonts.manropeSemibold(withSize: 14))
                    .foregroundColor(.primaryColor.opacity(0.7))
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.leading)
                    .padding(.top, 1)
            }
            
            Spacer()
            
            ZStack {
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color(UIColor.systemGray6))
                    .frame(width: 350, height: 400)
                
                DashedCrosshair()
                
                Circle()
                    .fill(motionManager.isAligned ? Color.green : Color.black)
                    .frame(width: 30, height: 30)
                    .offset(x: motionManager.xOffset, y: motionManager.yOffset)
                
                Circle()
                    .stroke(motionManager.isAligned ? Color.green : Color.orange, lineWidth: 2)
                    .frame(width: 50, height: 50)
            }
            .frame(width: 350, height: 400)
            .padding()
            
            Spacer()
            
            if motionManager.isAligned {
                Button(action: {
                    openBodygramScanView.toggle()
                }) {
                    Text("Continue")
                        .font(UBUFonts.manropeMedium(withSize: 16))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background(.black)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }
                .padding()
            }
            
        }
        .onAppear {
            motionManager.startMotionUpdates()
        }
        .onDisappear {
            motionManager.stopMotionUpdates()
        }
        .navigationDestination(isPresented: $openBodygramScanView, destination: {
            BodygramView(bodygramToken: viewModel.bodygramToken ?? "")
                .toolbar(.hidden)
                .environmentObject(viewModel)
        })
    }
}

class MotionManagera: ObservableObject {
    private var motion = CMMotionManager()
    private let threshold: CGFloat = 5.0
    
    @Published var xOffset: CGFloat = 0.0
    @Published var yOffset: CGFloat = 0.0
    @Published var isAligned: Bool = false
    
    func startMotionUpdates() {
        if motion.isDeviceMotionAvailable {
            motion.deviceMotionUpdateInterval = 0.02
            motion.startDeviceMotionUpdates(to: .main) { [weak self] data, error in
                guard let self = self, let motionData = data else { return }
                
                let roll = motionData.attitude.roll // Rotation around X-axis
                let pitch = motionData.attitude.pitch // Rotation around Y-axis
                
                DispatchQueue.main.async {
                    self.xOffset = CGFloat(roll) * 50
                    self.yOffset = (CGFloat(pitch) * 50) - (1.5 * 50)
                    
                    NSLog("pitch \(pitch)")
                    NSLog("yOffset \(self.yOffset)")
                    
                    // Check if the dot is centered
                    if abs(self.xOffset) < self.threshold &&
                        (pitch > 1 && self.xOffset < 1.5) {
                        self.xOffset = 0
                        self.yOffset = 1
                        self.isAligned = true
                        self.stopMotionUpdates()
                    } else {
                        self.isAligned = false
                    }
                }
            }
        }
    }
    
    func stopMotionUpdates() {
        motion.stopDeviceMotionUpdates()
    }
    
    func resetAlignment() {
        isAligned = false
        startMotionUpdates()
    }
}

struct DashedCrosshair: View {
    var body: some View {
        GeometryReader { geometry in
            Path { path in
                let midX = geometry.size.width / 2
                let midY = geometry.size.height / 2
                
                path.move(to: CGPoint(x: midX, y: 0))
                path.addLine(to: CGPoint(x: midX, y: geometry.size.height))
                
                path.move(to: CGPoint(x: 0, y: midY))
                path.addLine(to: CGPoint(x: geometry.size.width, y: midY))
            }
            .stroke(Color.gray, style: StrokeStyle(lineWidth: 1, dash: [5]))
        }
    }
}

struct BodygramAlignmentView_Previews: PreviewProvider {
    static var previews: some View {
        BodygramAlignmentView().environmentObject(BodygramMeasurementVM())
    }
}

struct UBUTopNavbar: View {
    let showRightMenuButton: Bool
    
    init(showRightMenuButton: Bool = true) {
        self.showRightMenuButton = showRightMenuButton
    }
    
    var body: some View {
        HStack(spacing: 0) {
            
            Image("app-icon-textonly")
            
            Spacer()
            
            if showRightMenuButton {
                Menu {
                    Button("Logout") {
                        NetworkService.shared.logout()
                    }
                } label: {
                    Image("hamburger")
                        .resizable()
                        .scaledToFill()
                        .frame(width: 44, height: 44)
                        .clipShape(Circle())
                        .foregroundStyle(.primaryColor.opacity(0.3))
                }
            }

        }
        .padding(.vertical, 10)
        .background(Color.white)
    }
    
    
    
}
