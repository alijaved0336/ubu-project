//
//  OBJ3DView.swift
//  UBU
//
//  Created by Irtaza Fiaz on 24/03/2025.
//

import SwiftUI
import SceneKit

struct Avatar3DView: UIViewRepresentable {
    let base64OBJ: String

    func makeUIView(context: Context) -> SCNView {
        let sceneView = SCNView()
        sceneView.scene = loadAvatarFromBase64(base64OBJ)
        sceneView.allowsCameraControl = true
        sceneView.autoenablesDefaultLighting = true
        sceneView.backgroundColor = .clear
        print("🌟 SCNView initialized")
        return sceneView
    }

    func updateUIView(_ uiView: SCNView, context: Context) {}

    private func loadAvatarFromBase64(_ base64OBJ: String) -> SCNScene {
        let scene = SCNScene()
        print("🔹 Loading avatar from Base64")

        // Decode Base64 string
        guard let data = Data(base64Encoded: base64OBJ) else {
            print("❌ Invalid Base64 Data")
            return scene
        }
        print("🌟 Successfully decoded Base64 data (Size: \(data.count) bytes)")

        let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent("avatar.obj")

        do {
            try data.write(to: tempURL)
            print("🌟 OBJ file written to temporary path: \(tempURL.path)")

            if let avatarScene = try? SCNScene(url: tempURL, options: nil) {
                print("🌟 Successfully loaded OBJ into SCNScene")
                let avatarNode = avatarScene.rootNode
                scene.rootNode.addChildNode(avatarNode)
                print("🌟 Avatar node added to scene")
            } else {
                print("❌ Failed to load OBJ from file")
            }
        } catch {
            print("❌ Error writing OBJ file: \(error)")
        }

        let cameraNode = SCNNode()
        cameraNode.camera = SCNCamera()
        cameraNode.position = SCNVector3(0, 1, 2.0)
        scene.rootNode.addChildNode(cameraNode)
        print("🌟 Camera added at position (0, 1.3, 2.0)")

        return scene
    }
}

#Preview {
    CustomBodygramSuccessView(scanId: "")
}
