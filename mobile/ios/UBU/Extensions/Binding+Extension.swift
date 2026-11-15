//
//  Binding+Extension.swift
//  UBU
//
//  Created by Irtaza Fiaz on 28/06/2024.
//

import Foundation
import SwiftUI

extension Binding where Value == String {
    func max(_ limit: Int) -> Self {
        if self.wrappedValue.count > limit {
            DispatchQueue.main.async {
                self.wrappedValue = String(self.wrappedValue.prefix(limit))
            }
        }
        return self
    }
}

extension Binding {
  func unwrap<T>() -> Binding<T>? where Value == T? {
    guard let _ = wrappedValue else { return nil }
    return Binding<T>(
      get: { self.wrappedValue! },
      set: { self.wrappedValue = $0 }
    )
  }
}
