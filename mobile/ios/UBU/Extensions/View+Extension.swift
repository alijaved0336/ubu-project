//
//  View+Extension.swift
//  UBU
//
//  Created by Irtaza Fiaz on 28/06/2024.
//

import Foundation
import SwiftUI

extension View {
    
    func focusNextField<F: RawRepresentable>(_ field: FocusState<F?>.Binding) where F.RawValue == Int {
        guard let currentValue = field.wrappedValue else { return }
        let nextValue = currentValue.rawValue + 1
        if let newValue = F.init(rawValue: nextValue) {
            field.wrappedValue = newValue
        }
    }
    
    func focusPreviousField<F: RawRepresentable>(_ field: FocusState<F?>.Binding) where F.RawValue == Int {
        guard let currentValue = field.wrappedValue else { return }
        let nextValue = currentValue.rawValue - 1
        if let newValue = F.init(rawValue: nextValue) {
            field.wrappedValue = newValue
        }
    }
    
    func roundedCornerWithBorder(lineWidth: CGFloat, borderColor: Color, radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners) )
            .overlay(RoundedCorner(radius: radius, corners: corners)
                .stroke(borderColor, lineWidth: lineWidth))
    }
    
    @ViewBuilder
    func popView<Content: View>(
        config: Config = .init(),
        isPresented: Binding<Bool>,
        onDismiss: @escaping () -> (),
        @ViewBuilder content: @escaping () -> Content
    ) -> some View {
        self
            .modifier(
                PopViewHelper(
                    config: config,
                    isPresented: isPresented,
                    onDismiss: onDismiss,
                    viewContent: content
                )
            )
    }
    
    @ViewBuilder
    func offset(coordinateSpace: String, offset: @escaping (CGFloat) -> ()) -> some View {
        self.overlay {
            GeometryReader { proxy in
                let minY = proxy.frame(in: .named(coordinateSpace)).minY
                
                Color.clear
                    .preference(key: OffsetKey.self, value: minY)
                    .onPreferenceChange(OffsetKey.self) { value in
                        offset(value)
                    }
            }
        }
    }
    
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners
    
    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(roundedRect: rect, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        return Path(path.cgPath)
    }
}

extension Image {
    func applyShape(_ shape: ImageShape) -> some View {
        switch shape {
        case .circle:
            return AnyView(self.clipShape(Circle()))
        case .rectangle(let cornerRadius):
            return AnyView(self.clipShape(RoundedRectangle(cornerRadius: cornerRadius)))
        case .customRect(let topLeadingRadius, let bottomLeadingRadius, let bottomTrailingRadius, let topTrailingRadius):
            return AnyView(
                self.clipShape(
                    .rect(
                        topLeadingRadius: topLeadingRadius,
                        bottomLeadingRadius: bottomLeadingRadius,
                        bottomTrailingRadius: bottomTrailingRadius,
                        topTrailingRadius: topTrailingRadius
                    )
                )
            )
        }
    }
}

extension View {
    func applyShape(_ shape: ImageShape) -> some View {
        switch shape {
        case .circle:
            return AnyView(self.clipShape(Circle()))
        case .rectangle(let cornerRadius):
            return AnyView(self.clipShape(RoundedRectangle(cornerRadius: cornerRadius)))
        case .customRect(let topLeadingRadius, let bottomLeadingRadius, let bottomTrailingRadius, let topTrailingRadius):
            return AnyView(
                self.clipShape(
                    .rect(
                        topLeadingRadius: topLeadingRadius,
                        bottomLeadingRadius: bottomLeadingRadius,
                        bottomTrailingRadius: bottomTrailingRadius,
                        topTrailingRadius: topTrailingRadius
                    )
                )
            )
        }
    }
    
    func border(width: CGFloat, edges: [Edge], color: Color) -> some View {
        overlay(EdgeBorder(width: width, edges: edges).foregroundColor(color))
    }
    
    
    
}


// TODO: Add check to support swipe functionality in view level
//extension UINavigationController: UIGestureRecognizerDelegate {
//    override open func viewDidLoad() {
//        super.viewDidLoad()
//        interactivePopGestureRecognizer?.delegate = self
//    }
//    
//    public func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
//        return viewControllers.count > 1
//    }
//}

struct EdgeBorder: Shape {
    var width: CGFloat
    var edges: [Edge]
    
    func path(in rect: CGRect) -> Path {
        edges.map { edge -> Path in
            switch edge {
            case .top: return Path(.init(x: rect.minX, y: rect.minY, width: rect.width, height: width))
            case .bottom: return Path(.init(x: rect.minX, y: rect.maxY - width, width: rect.width, height: width))
            case .leading: return Path(.init(x: rect.minX, y: rect.minY, width: width, height: rect.height))
            case .trailing: return Path(.init(x: rect.maxX - width, y: rect.minY, width: width, height: rect.height))
            }
        }.reduce(into: Path()) { $0.addPath($1) }
    }
}

extension Int {
    var byteSize: String {
        return ByteCountFormatter().string(fromByteCount: Int64(self))
    }
}

extension Data {

    var bytes: Int64 {
        .init(self.count)
    }

    public var kilobytes: Double {
        return Double(bytes) / 1_024
    }

    public var megabytes: Double {
        return kilobytes / 1_024
    }

    public var gigabytes: Double {
        return megabytes / 1_024
    }

    public func getReadableUnit() -> String {

        switch bytes {
            case 0..<1_024:
                return "\(bytes) bytes"
            case 1_024..<(1_024 * 1_024):
                return "\(String(format: "%.2f", kilobytes)) kb"
            case 1_024..<(1_024 * 1_024 * 1_024):
                return "\(String(format: "%.2f", megabytes)) mb"
            case (1_024 * 1_024 * 1_024)...Int64.max:
                return "\(String(format: "%.2f", gigabytes)) gb"
            default:
                return "\(bytes) bytes"
        }
    }
}
